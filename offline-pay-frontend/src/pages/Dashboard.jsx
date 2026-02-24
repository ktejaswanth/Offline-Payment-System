import { useState, useEffect } from "react";
import { getBalance, addMoney, withdrawMoney, getTransactions } from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
    Wallet, Plus, ArrowUpRight, ArrowDownLeft,
    Activity, Settings, LogOut, Sun, Moon,
    CreditCard, Send, ShieldCheck, ScanLine, Copy, Landmark, User
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import AddMoneyModal from '../components/AddMoneyModal';
import WithdrawModal from '../components/WithdrawModal';

const mockData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 550 },
    { name: 'Thu', value: 480 },
    { name: 'Fri', value: 700 },
    { name: 'Sat', value: 650 },
    { name: 'Sun', value: 900 },
];

// eslint-disable-next-line react/prop-types
export default function Dashboard({ toggleTheme, theme }) {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [liveTxHistory, setLiveTxHistory] = useState([]);
    const [isQrZoomed, setIsQrZoomed] = useState(false);
    const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate("/login");
            return;
        }
        fetchBalance();
    }, [email, navigate]);

    const fetchBalance = async () => {
        try {
            const res = await getBalance(email);
            setBalance(res.data);

            const txRes = await getTransactions();
            const rawTransactions = txRes.data;
            const mappedTransactions = rawTransactions.map(tx => {
                const isPositive = tx.transactionType === 'DEPOSIT' || tx.receiver.email === email;

                let name = tx.transactionType;
                if (tx.transactionType === 'ONLINE' || tx.transactionType === 'OFFLINE') {
                    name = isPositive ? `Received from ${tx.sender.name}` : `Sent to ${tx.receiver.name}`;
                }

                return {
                    id: tx.id,
                    name: name,
                    date: new Date(tx.createdAt).toLocaleString(),
                    amount: `${isPositive ? '+' : '-'} ₹${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    type: isPositive ? 'positive' : 'negative',
                    icon: isPositive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />
                };
            });
            setLiveTxHistory(mappedTransactions);

            // We will just keep the chart visual static instead of mutated
            // to avoid read-only properties errors in React strict mode.
        } catch (err) {
            console.error("Failed to fetch balance / tx details", err);
            if (err.response?.status === 403) {
                alert("Session expired. Please log in again.");
                handleLogout();
            }
        }
    };

    const handleAdd = async () => {
        if (!email) return;
        setLoading(true);
        try {
            await addMoney(email, 100);
            await fetchBalance();
        } catch (err) {
            console.error("Failed to add money", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMoneyAdded = async (amountToAdd) => {
        if (!email) return;
        try {
            await addMoney(email, amountToAdd);
            await fetchBalance();
        } catch (err) {
            console.error("Failed to process payment integration", err);
            alert("Payment Integration Error: Could not verify funds addition.");
        }
    };

    const handleWithdrawSubmitted = async (amountToWithdraw) => {
        if (!email) return;
        try {
            await withdrawMoney(email, amountToWithdraw);
            await fetchBalance();
        } catch (err) {
            console.error("Failed to withdraw money", err);
            const errMsg = typeof err.response?.data === 'string' ? err.response?.data : err.response?.data?.message || err.message;
            alert("Withdrawal Failed: " + errMsg);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        navigate("/login");
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <nav className="navbar">
                <div className="nav-brand">
                    <Wallet size={28} />
                    <span>OfflinePay</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={toggleTheme} className="theme-toggle">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        style={{
                            width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden',
                            background: profilePic ? 'transparent' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                            border: '2px solid var(--border-color)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                        }}
                        title="My Profile"
                    >
                        {profilePic
                            ? <img src={profilePic} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <User size={20} color="#fff" />}
                    </button>
                    <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        <LogOut size={18} />
                        <span style={{ display: 'none' }} className="hide-mobile">Logout</span>
                    </button>
                </div>
            </nav>

            <div className="container dashboard-grid">

                {/* Left Column */}
                <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Main Balance Card */}
                    <div className="glass-panel stat-card">
                        <div className="stat-title">
                            <CreditCard size={18} /> Available Balance
                        </div>
                        <div className="stat-value">₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

                        <div style={{ marginTop: '1rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div
                                    style={{ background: '#fff', padding: '0.25rem', borderRadius: '4px', display: 'flex', cursor: 'pointer' }}
                                    onClick={() => setIsQrZoomed(true)}
                                    title="Click to view full size"
                                >
                                    <QRCodeSVG value={localStorage.getItem('userId') || ''} size={48} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>My Receiver UUID:</div>
                                    <div style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: '0.9rem', wordBreak: 'break-all' }}>{localStorage.getItem('userId') || 'Loading...'}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(localStorage.getItem('userId'));
                                    alert('Receiver UUID Copied to clipboard!');
                                }}
                                className="btn-secondary"
                                style={{ padding: '0.5rem', minWidth: 'auto', border: 'none' }}
                                title="Copy UUID"
                            >
                                <Copy size={16} />
                            </button>
                        </div>

                        <div className="stat-actions" style={{ marginTop: '1.5rem', flexWrap: 'wrap' }}>
                            <button className="btn-primary" onClick={() => setIsAddMoneyOpen(true)}>
                                <Plus size={18} />
                                Add Money
                            </button>
                            <button className="btn-primary" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setIsWithdrawOpen(true)}>
                                <Landmark size={18} />
                                Withdraw
                            </button>
                            <button className="btn-secondary" onClick={() => navigate('/send')}>
                                <Send size={18} /> Send
                            </button>
                        </div>
                    </div>

                    {/* Chart Card */}
                    <div className="glass-panel" style={{ padding: '1.5rem', height: '350px' }}>
                        <h3 className="section-title"><Activity size={20} /> Analytics Overview</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme === 'dark' ? '#818cf8' : '#6366f1'} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={theme === 'dark' ? '#818cf8' : '#6366f1'} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke={theme === 'dark' ? '#818cf8' : '#6366f1'} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Quick Actions */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 className="section-title"><Settings size={20} /> Quick Services</h3>
                        <div className="action-grid">
                            <button className="action-card" onClick={() => navigate('/receive')}>
                                <ScanLine size={24} />
                                <span>Scan QR</span>
                            </button>
                            <button className="action-card">
                                <ShieldCheck size={24} />
                                <span>Security</span>
                            </button>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 className="section-title">Recent Transactions</h3>
                        <div className="tx-list">
                            {liveTxHistory.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No recent activity.</div>
                            ) : liveTxHistory.slice(0, 5).map((tx) => (
                                <div className="tx-item" key={tx.id}>
                                    <div className="tx-info">
                                        <div className="tx-icon">
                                            {tx.icon}
                                        </div>
                                        <div className="tx-details">
                                            <span className="tx-name">{tx.name}</span>
                                            <span className="tx-date">{tx.date}</span>
                                        </div>
                                    </div>
                                    <div className={`tx-amount ${tx.type}`}>
                                        {tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>
                            View All Activity
                        </button>
                    </div>

                </div>
            </div>

            <AddMoneyModal
                isOpen={isAddMoneyOpen}
                onClose={() => setIsAddMoneyOpen(false)}
                amountAdded={handleMoneyAdded}
            />
            <WithdrawModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                amountWithdrawn={handleWithdrawSubmitted}
            />

            {isQrZoomed && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                        <QRCodeSVG value={localStorage.getItem('userId') || ''} size={300} />
                        <div style={{ color: '#000', marginTop: '1.5rem', textAlign: 'center', maxWidth: '350px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Scan to Send Payment</p>
                            <p style={{ fontFamily: 'monospace', wordBreak: 'break-all', color: '#4b5563', fontSize: '0.9rem' }}>
                                {localStorage.getItem('userId')}
                            </p>
                        </div>
                    </div>
                    <button className="btn-secondary" style={{ marginTop: '2.5rem', padding: '0.75rem 2.5rem', fontSize: '1.1rem' }} onClick={() => setIsQrZoomed(false)}>
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
