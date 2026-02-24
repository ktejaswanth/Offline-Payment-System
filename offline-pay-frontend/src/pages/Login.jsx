import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Wallet, LogIn, Mail, Lock, Sun, Moon } from "lucide-react";

// eslint-disable-next-line react/prop-types
export default function Login({ toggleTheme, theme }) {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await login(form);
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

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || "Invalid credentials");
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
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to your OfflinePay account.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
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
                        <LogIn size={20} />
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Create one</Link></p>
                </div>
            </div>
        </div>
    );
}
