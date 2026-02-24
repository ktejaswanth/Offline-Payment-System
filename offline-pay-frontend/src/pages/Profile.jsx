import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Building2, CreditCard, Save, Camera, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:8080/api/user';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function Profile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        contact: '',
        profilePic: '',
        bankName: '',
        bankAccountNumber: '',
        bankIfsc: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API}/profile`, getAuthHeaders());
                const data = res.data;
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    contact: data.contact || '',
                    profilePic: data.profilePic || '',
                    bankName: data.bankName || '',
                    bankAccountNumber: data.bankAccountNumber || '',
                    bankIfsc: data.bankIfsc || '',
                });
            } catch (err) {
                console.error('Failed to load profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (field) => (e) => {
        setProfile(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, profilePic: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`${API}/profile`, {
                name: profile.name,
                contact: profile.contact,
                profilePic: profile.profilePic,
                bankName: profile.bankName,
                bankAccountNumber: profile.bankAccountNumber,
                bankIfsc: profile.bankIfsc,
            }, getAuthHeaders());
            // Update localStorage name if changed
            localStorage.setItem('name', profile.name);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save profile', err);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '3rem', minHeight: '100vh' }}>
            <nav className="navbar">
                <div className="nav-brand">
                    <User size={24} />
                    <span>My Profile</span>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '720px', paddingTop: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>

                {/* Profile Photo & Name */}
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    width: '110px', height: '110px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', overflow: 'hidden', border: '3px solid var(--border-color)',
                                    boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
                                }}
                            >
                                {profile.profilePic ? (
                                    <img src={profile.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={48} color="#fff" />
                                )}
                            </div>
                            <div style={{
                                position: 'absolute', bottom: 4, right: 4, background: '#6366f1',
                                borderRadius: '50%', padding: '5px', display: 'flex', cursor: 'pointer'
                            }} onClick={() => fileInputRef.current?.click()}>
                                <Camera size={14} color="#fff" />
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Display Name</div>
                            <input
                                type="text"
                                className="input-field"
                                value={profile.name}
                                onChange={handleChange('name')}
                                placeholder="Your full name"
                                style={{ fontSize: '1.1rem', fontWeight: '600' }}
                            />
                            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Tap the photo to change it
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>
                        <Mail size={18} /> Personal Information
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Mail size={14} /> Email Address
                            </label>
                            <input
                                type="email"
                                className="input-field"
                                value={profile.email}
                                disabled
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />
                            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Email cannot be changed</small>
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Phone size={14} /> Contact Number
                            </label>
                            <input
                                type="tel"
                                className="input-field"
                                value={profile.contact}
                                onChange={handleChange('contact')}
                                placeholder="e.g. +91 9876543210"
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 className="section-title" style={{ marginBottom: '0.5rem' }}>
                        <Building2 size={18} /> Bank Details
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        Saved bank details will auto-fill when you initiate a withdrawal.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Building2 size={14} /> Bank Name
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                value={profile.bankName}
                                onChange={handleChange('bankName')}
                                placeholder="e.g. State Bank of India"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <CreditCard size={14} /> Account Number
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                value={profile.bankAccountNumber}
                                onChange={handleChange('bankAccountNumber')}
                                placeholder="Enter bank account number"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <CreditCard size={14} /> IFSC Code
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                value={profile.bankIfsc}
                                onChange={(e) => setProfile(prev => ({ ...prev, bankIfsc: e.target.value.toUpperCase() }))}
                                placeholder="e.g. SBIN0001234"
                            />
                        </div>
                    </div>
                </div>

                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saved ? <><CheckCircle size={20} /> Saved!</> : saving ? 'Saving...' : <><Save size={20} /> Save Profile</>}
                </button>
            </div>
        </div>
    );
}
