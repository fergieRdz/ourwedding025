import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Login.css';

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode]   = useState('login');
  const [form, setForm]   = useState({ name: '', email: '', password: '', weddingDate: '', partnerName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        weddingDate: form.weddingDate,
        partnerName: form.partnerName,
      });
      setSuccess('Account created! You can now log in.');
      setMode('login');
      setForm({ ...form, name: '', weddingDate: '', partnerName: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Our Wedding</h1>
        <p className="login-subtitle">Fergie & Jaime</p>

        <div className="login-tabs">
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => switchMode('login')}>Login</button>
          <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => switchMode('register')}>Sign Up</button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="login-form">
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <input type="text" placeholder="Partner's name" value={form.partnerName} onChange={e => setForm({ ...form, partnerName: e.target.value })} />
            <input type="date" placeholder="Wedding date" value={form.weddingDate} onChange={e => setForm({ ...form, weddingDate: e.target.value })} />
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Account</button>
          </form>
        )}

        <div className="login-divider">or</div>
        <button className="btn-secondary" style={{ width: '100%' }} onClick={() => { demoLogin(); navigate('/dashboard'); }}>
          Demo — enter without backend
        </button>
      </div>
    </div>
  );
}
