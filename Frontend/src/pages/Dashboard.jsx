import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const DEFAULT_DATE = '2026-12-14';

function calcCountdown(dateStr) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const diff = new Date(y, mo - 1, d, 0, 0, 0) - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [targetDate, setTargetDate] = useState(DEFAULT_DATE);
  const [editDate, setEditDate]     = useState(false);
  const [dateInput, setDateInput]   = useState(DEFAULT_DATE);
  const [countdown, setCountdown]   = useState(() => calcCountdown(DEFAULT_DATE));
  const [summary, setSummary]       = useState(null);
  const [stats, setStats]           = useState({});

  // Sync target date from authenticated user
  useEffect(() => {
    if (user?.weddingDate) {
      setTargetDate(user.weddingDate);
      setDateInput(user.weddingDate);
    }
  }, [user]);

  // Restart interval whenever targetDate changes
  useEffect(() => {
    setCountdown(calcCountdown(targetDate));
    const id = setInterval(() => setCountdown(calcCountdown(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const { days, hours, minutes, seconds } = countdown;

  // Stats & budget
  useEffect(() => {
    api.get('/budget/summary').then(r => setSummary(r.data)).catch(() => {});

    Promise.allSettled([
      api.get('/guests'),
      api.get('/tables'),
      api.get('/todos'),
      api.get('/suppliers'),
      api.get('/moodboard'),
      api.get('/shopping'),
      api.get('/honeymoon'),
      api.get('/calendar'),
    ]).then(([guests, tables, todos, suppliers, moodboard, shopping, honeymoon, calendar]) => {
      const g  = guests.value?.data    || [];
      const tb = tables.value?.data    || [];
      const td = todos.value?.data     || [];
      const sp = suppliers.value?.data || [];
      const mb = moodboard.value?.data || [];
      const sh = shopping.value?.data  || [];
      const hm = honeymoon.value?.data || [];
      const cl = calendar.value?.data  || [];

      const today = new Date().toISOString().slice(0, 10);
      const dest  = hm.slice(0, 2).map(h => h.destination).join(', ');

      setStats({
        '/guests':    `${g.length} guests · ${g.filter(x => x.status === 'confirmed').length} confirmed`,
        '/tables':    `${tb.length} table${tb.length !== 1 ? 's' : ''}`,
        '/todos':     `${td.filter(x => !x.completed).length} pending`,
        '/suppliers': `${sp.filter(x => x.status === 'confirmed').length} / ${sp.length} confirmed`,
        '/moodboard': `${mb.length} photo${mb.length !== 1 ? 's' : ''}`,
        '/shopping':  `${sh.filter(x => !x.purchased).length} item${sh.filter(x => !x.purchased).length !== 1 ? 's' : ''} left`,
        '/honeymoon': dest || `${hm.length} destination${hm.length !== 1 ? 's' : ''}`,
        '/calendar':  `${cl.filter(e => e.date >= today).length} upcoming event${cl.filter(e => e.date >= today).length !== 1 ? 's' : ''}`,
      });
    });
  }, []);

  const saveDate = () => {
    if (dateInput) {
      setTargetDate(dateInput);
      api.put('/auth/me', { weddingDate: dateInput }).catch(() => {});
    }
    setEditDate(false);
  };

  const QUICK = [
    { to: '/guests',    label: 'Guests',      icon: '💌' },
    { to: '/budget',    label: 'Budget',       icon: '💍' },
    { to: '/tables',    label: 'Tables',       icon: '🌹' },
    { to: '/calendar',  label: 'Calendar',     icon: '💒' },
    { to: '/todos',     label: 'Things To Do', icon: '📋' },
    { to: '/suppliers', label: 'Suppliers',    icon: '🎀' },
    { to: '/moodboard', label: 'Moodboard',    icon: '🌸' },
    { to: '/shopping',  label: 'Shopping',     icon: '👗' },
    { to: '/honeymoon', label: 'Honeymoon',    icon: '🏝️' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="hero-text">
          <h1>Hello, {user?.name || 'Fergie'}!</h1>
          <p className="hero-sub">Your perfect day is almost here — keep going!</p>
          {editDate
            ? <span style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
                <input type="date" value={dateInput} onChange={e => setDateInput(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: 8, border: '1.5px solid var(--gray-light)', fontSize: '.85rem' }} />
                <button onClick={saveDate} style={{ background: 'var(--pink)', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer', fontSize: '.85rem' }}>Save</button>
                <button onClick={() => setEditDate(false)} style={{ background: 'none', border: 'none', color: 'var(--gray-mid)', cursor: 'pointer', fontSize: '.85rem' }}>Cancel</button>
              </span>
            : <button onClick={() => setEditDate(true)} style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--pink)', fontSize: '.8rem', cursor: 'pointer', padding: 0 }}>
                ✎ {targetDate}
              </button>
          }
        </div>

        <div className="countdown-box">
          <div className="countdown-unit">
            <span className="countdown-num">{days}</span>
            <span className="countdown-label">days</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-num">{hours}</span>
            <span className="countdown-label">hours</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-num">{minutes}</span>
            <span className="countdown-label">minutes</span>
          </div>
          <div className="countdown-unit">
            <span className="countdown-num">{seconds}</span>
            <span className="countdown-label">seconds</span>
          </div>
        </div>
      </div>

      {summary && (
        <div className="budget-summary card">
          <h2>Budget Overview</h2>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill"
              style={{ width: summary.totalSpent ? `${Math.min((summary.totalPaid / summary.totalSpent) * 100, 100)}%` : '0%' }} />
          </div>
          <div className="budget-numbers">
            <span>Total: ${Number(summary.totalSpent).toLocaleString()}</span>
            <span>Paid: ${Number(summary.totalPaid).toLocaleString()}</span>
            <span>Pending: ${Number(summary.totalPending).toLocaleString()}</span>
            <span>Gifts: ${Number(summary.totalGifts).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="quick-access">
        <h2 className="quick-title">Quick Access</h2>
        <div className="quick-grid">
          {QUICK.map(q => (
            <button key={q.to} className="quick-card" onClick={() => navigate(q.to)}>
              <span className="quick-icon">{q.icon}</span>
              <span className="quick-label">{q.label}</span>
              {stats[q.to] !== undefined
                ? <span className="quick-preview">{stats[q.to]}</span>
                : q.to === '/budget' && summary
                  ? <span className="quick-preview">${Number(summary.totalPaid).toLocaleString()} paid</span>
                  : <span className="quick-preview" style={{ opacity: 0 }}>—</span>
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
