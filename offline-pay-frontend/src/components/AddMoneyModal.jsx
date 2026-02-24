import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CreditCard, Smartphone, Building, X, CheckCircle } from 'lucide-react';

export default function AddMoneyModal({ isOpen, onClose, amountAdded }) {
    const [amount, setAmount] = useState('100');
    const [method, setMethod] = useState(''); // 'card', 'netbanking', 'upi'
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const upiId = "8688088449sbi@ibl";
    const upiLink = `upi://pay?pa=${upiId}&pn=OfflinePay&am=${amount}&cu=INR`;

    const handleSimulatePayment = async () => {
        setLoading(true);
        // Simulate real transaction delay
        await new Promise(res => setTimeout(res, 1500));
        setLoading(false);
        setSuccess(true);
        await amountAdded(parseFloat(amount));
        setTimeout(() => {
            setSuccess(false);
            setMethod('');
            setAmount('100');
            onClose();
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '1rem',
            backdropFilter: 'blur(4px)'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h2 className="section-title">Add Money to Wallet</h2>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto', marginBottom: '1rem' }} />
                        <h3 style={{ color: '#10b981', fontSize: '1.25rem' }}>Payment Completed!</h3>
                        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>₹{amount} has been securely added to your wallet.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Enter Amount (₹)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                placeholder="e.g. 500"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Select Payment Method</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                <button className={`action-card`} onClick={() => setMethod('card')} style={{ padding: '1rem', flexDirection: 'row', justifyContent: 'flex-start', border: method === 'card' ? '2px solid #818cf8' : '1px solid var(--border-color)', background: method === 'card' ? 'rgba(129, 140, 248, 0.1)' : 'var(--bg-card)' }}>
                                    <CreditCard size={24} style={{ color: method === 'card' ? '#818cf8' : 'var(--text-primary)' }} />
                                    <span style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Debit / Credit Card</span>
                                </button>
                                <button className={`action-card`} onClick={() => setMethod('netbanking')} style={{ padding: '1rem', flexDirection: 'row', justifyContent: 'flex-start', border: method === 'netbanking' ? '2px solid #818cf8' : '1px solid var(--border-color)', background: method === 'netbanking' ? 'rgba(129, 140, 248, 0.1)' : 'var(--bg-card)' }}>
                                    <Building size={24} style={{ color: method === 'netbanking' ? '#818cf8' : 'var(--text-primary)' }} />
                                    <span style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Net Banking</span>
                                </button>
                                <button className={`action-card`} onClick={() => setMethod('upi')} style={{ padding: '1rem', flexDirection: 'row', justifyContent: 'flex-start', border: method === 'upi' ? '2px solid #818cf8' : '1px solid var(--border-color)', background: method === 'upi' ? 'rgba(129, 140, 248, 0.1)' : 'var(--bg-card)' }}>
                                    <Smartphone size={24} style={{ color: method === 'upi' ? '#818cf8' : 'var(--text-primary)' }} />
                                    <span style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>UPI (QR Code)</span>
                                </button>
                            </div>
                        </div>

                        {method === 'upi' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                <QRCodeSVG value={upiLink} size={180} />
                                <div style={{ color: '#000', marginTop: '1rem', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>Scan to pay ₹{amount}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>UPI ID: {upiId}</p>
                                </div>
                            </div>
                        )}

                        {(method === 'card' || method === 'netbanking') && (
                            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p style={{ margin: 0 }}>Secure Gateway Integration verified.</p>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Proceed below to simulate backend processing.</p>
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                            disabled={!method || !amount || parseFloat(amount) <= 0 || loading}
                            onClick={handleSimulatePayment}
                        >
                            {loading ? "Processing Payment securely..." : `Simulate Payment Completed`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
