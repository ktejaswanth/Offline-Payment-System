import { useState, useEffect } from 'react';
import { Landmark, Smartphone, X, CheckCircle, User } from 'lucide-react';
import axios from 'axios';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function WithdrawModal({ isOpen, onClose, amountWithdrawn }) {
    const [amount, setAmount] = useState('100');
    const [method, setMethod] = useState(''); // 'bank', 'upi'
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [savedBank, setSavedBank] = useState(null);

    // Form fields
    const [upiId, setUpiId] = useState('');
    const [accNo, setAccNo] = useState('');
    const [reAccNo, setReAccNo] = useState('');
    const [ifsc, setIfsc] = useState('');

    useEffect(() => {
        if (isOpen) {
            axios.get('https://offline-payment-system-backend.onrender.com/api/user/profile', getAuthHeaders())
                .then(res => {
                    const d = res.data;
                    if (d.bankAccountNumber || d.bankIfsc) {
                        setSavedBank({
                            accountNumber: d.bankAccountNumber || '',
                            ifsc: d.bankIfsc || '',
                            bankName: d.bankName || ''
                        });
                    }
                })
                .catch(() => { });
        }
    }, [isOpen]);

    const applysSavedBank = () => {
        if (!savedBank) return;
        setAccNo(savedBank.accountNumber);
        setReAccNo(savedBank.accountNumber);
        setIfsc(savedBank.ifsc);
        setMethod('bank');
    };

    if (!isOpen) return null;

    const handleWithdraw = async () => {
        if (method === 'upi' && !upiId) {
            alert("Please enter a valid UPI ID");
            return;
        }
        if (method === 'bank') {
            if (!accNo || accNo !== reAccNo || !ifsc) {
                alert("Please verify your account details. Account numbers must match.");
                return;
            }
        }

        setLoading(true);
        await new Promise(res => setTimeout(res, 2000));

        try {
            await amountWithdrawn(parseFloat(amount));
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setMethod('');
                setAmount('100');
                setUpiId('');
                setAccNo('');
                setReAccNo('');
                setIfsc('');
                onClose();
            }, 2500);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
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

                <h2 className="section-title">Withdraw to Bank</h2>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto', marginBottom: '1rem' }} />
                        <h3 style={{ color: '#10b981', fontSize: '1.25rem' }}>Withdrawal Processing!</h3>
                        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>₹{amount} is being securely transferred to your {method === 'upi' ? 'UPI ID' : 'Bank Account'}. This usually takes up to 2 hours.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Enter Amount to Withdraw (₹)</label>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Select Transfer Destination</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                <button className={`action-card`} onClick={() => setMethod('upi')} style={{ padding: '1rem', flexDirection: 'row', justifyContent: 'flex-start', border: method === 'upi' ? '2px solid #818cf8' : '1px solid var(--border-color)', background: method === 'upi' ? 'rgba(129, 140, 248, 0.1)' : 'var(--bg-card)' }}>
                                    <Smartphone size={24} style={{ color: method === 'upi' ? '#818cf8' : 'var(--text-primary)' }} />
                                    <span style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>UPI ID</span>
                                </button>
                                <button className={`action-card`} onClick={() => setMethod('bank')} style={{ padding: '1rem', flexDirection: 'row', justifyContent: 'flex-start', border: method === 'bank' ? '2px solid #818cf8' : '1px solid var(--border-color)', background: method === 'bank' ? 'rgba(129, 140, 248, 0.1)' : 'var(--bg-card)' }}>
                                    <Landmark size={24} style={{ color: method === 'bank' ? '#818cf8' : 'var(--text-primary)' }} />
                                    <span style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Direct Bank Transfer</span>
                                </button>
                            </div>
                        </div>

                        {method === 'upi' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Enter Receiver UPI ID</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="e.g. 1234567890@ybl"
                                />
                            </div>
                        )}

                        {method === 'bank' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                {savedBank && (
                                    <div style={{
                                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                                        borderRadius: '8px', padding: '0.75rem 1rem',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saved Bank Details</div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{savedBank.bankName || 'Bank'}</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                ••••{savedBank.accountNumber.slice(-4)} | {savedBank.ifsc}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                                            onClick={applysSavedBank}
                                        >
                                            Use This
                                        </button>
                                    </div>
                                )}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Account Number</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={accNo}
                                        onChange={(e) => setAccNo(e.target.value)}
                                        placeholder="Enter Account Number"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Re-enter Account Number</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={reAccNo}
                                        onChange={(e) => setReAccNo(e.target.value)}
                                        placeholder="Re-enter to confirm"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>IFSC Code</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={ifsc}
                                        onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                                        placeholder="e.g. SBIN0001234"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                            disabled={!method || !amount || parseFloat(amount) <= 0 || loading}
                            onClick={handleWithdraw}
                        >
                            {loading ? "Verifying Details..." : `Submit Withdrawal Request`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
