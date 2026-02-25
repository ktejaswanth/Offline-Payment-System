import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';

export default function ReceivePayment() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [status, setStatus] = useState('Position the offline QR code inside the frame to scan.');
    const [loading, setLoading] = useState(false);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const isScanning = useRef(false);

    useEffect(() => {
        let mounted = true;

        const startScanning = async () => {
            try {
                if (isScanning.current) return;
                isScanning.current = true;

                // Passing undefined automatically picks the default camera (often the back camera on mobile).
                await codeReader.current.decodeFromVideoDevice(
                    undefined,
                    videoRef.current,
                    (result, err) => {
                        if (result && mounted && !loading) {
                            handleScanResult(result.getText());
                        }
                    }
                );
            } catch (err) {
                console.error(err);
                if (mounted) setStatus("Failed to access camera. Please check your browser permissions.");
            }
        };

        startScanning();

        return () => {
            mounted = false;
            codeReader.current.reset();
            isScanning.current = false;
        };
    }, [loading]);

    const handleScanResult = async (qrText) => {
        setLoading(true);
        setStatus("Processing QR code data...");

        try {
            const payload = JSON.parse(qrText);

            // Expected payload format:
            // { senderId, receiverId, amount, nonce, signature }
            if (!payload.signature || !payload.nonce) {
                throw new Error("Invalid format");
            }

            const token = localStorage.getItem("token");
            if (!token) throw new Error("You must be logged in to receive payments");

            setStatus("Verifying signature with server...");

            // Post to our backend to verify the offline transaction
            const res = await axios.post("https://offline-payment-system-backend.onrender.com/api/offline-transaction/verify", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                setStatus(`Success! Received ₹${payload.amount} securely.`);
                // Stop camera since we are done
                codeReader.current.reset();
                isScanning.current = false;
            }
        } catch (e) {
            console.error(e);
            setStatus(`Error verifying transaction: ${e.response?.data || e.message}`);
            // Let the scanner try a bit later
            setTimeout(() => setLoading(false), 3000);
        }
    };

    return (
        <div className="container dashboard-grid" style={{ paddingTop: '2rem' }}>
            <div className="col-span-12 glass-panel" style={{ padding: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginBottom: '1rem', padding: '0.5rem' }}>
                    <ArrowLeft size={18} /> Back
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="section-title">Scan Offline QR</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                        <ScanLine size={18} /> Scanner Active
                    </div>
                </div>

                <div style={{ marginTop: '1rem', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative', width: '100%', maxWidth: '500px', margin: '1rem auto' }}>
                    <video ref={videoRef} style={{ width: '100%', height: '300px', objectFit: 'cover' }}></video>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.1rem', fontWeight: '500', color: loading ? '#6366f1' : 'var(--text-primary)' }}>
                    {status}
                </p>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={() => window.location.reload()} className="btn-secondary">
                        Restart Camera
                    </button>
                </div>
            </div>
        </div>
    );
}
