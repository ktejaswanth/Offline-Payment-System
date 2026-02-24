import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Wallet, UserPlus, Mail, Lock, User, Sun, Moon } from "lucide-react";

// eslint-disable-next-line react/prop-types
export default function Register({ toggleTheme, theme }) {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await register(form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("email", form.email);
            localStorage.setItem("userId", res.data.userId);

            import("../services/cryptoService").then(async (module) => {
                try {
                    const pubKey = await module.generateKeyPair(res.data.userId);
                    if (pubKey) {
                        const { savePublicKey } = await import("../services/authService");
                        await savePublicKey(pubKey);
                    }
                } catch (e) {
                    console.error("Key pair generation failed", e);
                }
            });

            alert("Registered successfully");
            navigate("/dashboard");
        } catch (err) {
            setError("Registration failed: " + (err.response?.data?.message || err.response?.data || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            {/* Contextual Theme Switcher */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <div className="glass-panel auth-card">
                <div className="auth-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                        <Wallet size={48} />
                    </div>
                    <h2 className="auth-title">Join OfflinePay</h2>
                    <p className="auth-subtitle">Create a new secure wallet account.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="John Doe"
                                style={{ paddingLeft: '2.5rem' }}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                style={{ paddingLeft: '2.5rem' }}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={{ paddingLeft: '2.5rem' }}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '500', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        <UserPlus size={20} />
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
