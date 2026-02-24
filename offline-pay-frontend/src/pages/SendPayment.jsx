import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createOfflineTransaction, syncTransactions } from '../services/offlinePaymentService';
import { ArrowLeft, Wifi, WifiOff, ScanLine } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SendPayment() {
    const navigate = useNavigate();
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [qrData, setQrData] = useState(null);
    const [forceOffline, setForceOffline] = useState(false);
    const isOffline = !navigator.onLine || forceOffline;
    const [status, setStatus] = useState('');

    const videoRef = useRef(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        return () => {
            codeReader.current.reset();
        };
    }, []);

    const startScanner = async () => {
        try {
            setIsScanning(true);
            await codeReader.current.decodeFromVideoDevice(
                undefined,
                videoRef.current,
                (result) => {
                    if (result) {
                        setReceiverId(result.getText());
                        stopScanner();
                    }
                }
            );
        } catch (err) {
            console.error("Camera access failed", err);
            setIsScanning(false);
            setStatus("Camera access failed. Please check permissions.");
        }
    };

    const stopScanner = () => {
        codeReader.current.reset();
        setIsScanning(false);
    };

    useEffect(() => {
        const handleOnline = () => {
            if (!forceOffline) {
                syncTransactions(); // Auto sync
            }
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [forceOffline]);

    const handleSendOnline = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Please log in first.");

            const res = await axios.post("http://localhost:8080/api/transaction/send", {
                receiverId,
                amount: parseFloat(amount)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                setStatus("Transaction Successful!");
            }
        } catch (e) {
            console.error(e);
            const errMsg = typeof e.response?.data === 'string' ? e.response?.data : e.response?.data?.message || e.message;
            setStatus("Online transaction failed: " + errMsg);
        }
    };

    const handleSendOffline = async () => {
        const senderId = localStorage.getItem("userId");
        if (!senderId) {
            setStatus("User ID not found locally. Please log in when online to cache your ID.");
            return;
        }

        try {
            const tx = await createOfflineTransaction(senderId, receiverId, parseFloat(amount));
            setQrData(JSON.stringify(tx));
            setStatus("Offline transaction signed! Show this QR code to the receiver.");
        } catch (e) {
            console.error(e);
            setStatus("Failed to generate offline transaction: " + e.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setQrData(null);

        if (isOffline) {
            await handleSendOffline();
        } else {
            await handleSendOnline();
        }
    };

    return (
        <div className="container dashboard-grid" style={{ paddingTop: '2rem' }}>
            <div className="col-span-12 glass-panel" style={{ padding: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                    <ArrowLeft size={18} /> Back
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="section-title">Send Payment</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => setForceOffline(!forceOffline)}
                            title="Test Offline QR flow"
                            style={{
                                padding: '4px 8px',
                                border: '1px solid currentColor',
                                borderRadius: '4px',
                                background: forceOffline ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                color: forceOffline ? '#ef4444' : 'inherit',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            {forceOffline ? "Force Offline: ON" : "Force Offline: OFF"}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isOffline ? '#ef4444' : '#10b981' }}>
                            {isOffline ? <><WifiOff size={18} /> Offline Mode</> : <><Wifi size={18} /> Online Mode</>}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxWidth: '400px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label>Receiver UUID</label>
                            <input
                                type="text"
                                className="input-field"
                                value={receiverId}
                                onChange={(e) => setReceiverId(e.target.value)}
                                placeholder="Scan or type ID"
                                required
                            />
                        </div>
                        <button type="button" onClick={isScanning ? stopScanner : startScanner} className="btn-secondary" style={{ padding: '0.65rem 1rem' }} title="Scan UUID">
                            <ScanLine size={18} />
                        </button>
                    </div>

                    <div style={{ display: isScanning ? 'flex' : 'none', background: '#000', borderRadius: '8px', overflow: 'hidden', width: '100%', height: '250px', alignItems: 'center', justifyContent: 'center' }}>
                        <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                    </div>
                    <div>
                        <label>Amount (₹)</label>
                        <input
                            type="number"
                            className="input-field"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="100.00"
                            required
                            min="1"
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                        {isOffline ? "Generate Offline QR" : "Send Now"}
                    </button>

                    {status && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{status}</p>}
                </form>

                {qrData && (
                    <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', display: 'inline-block', borderRadius: '8px' }}>
                        <QRCodeSVG value={qrData} size={256} />
                        <p style={{ color: '#000', marginTop: '0.5rem', textAlign: 'center' }}>Receiver can scan this</p>
                    </div>
                )}
            </div>
        </div>
    );
}
