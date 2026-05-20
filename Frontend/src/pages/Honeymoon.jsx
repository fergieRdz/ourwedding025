import { useState, useEffect } from 'react';
import api from '../services/api';
import ImageInput from '../components/ImageInput';
import './Honeymoon.css';

export default function Honeymoon() {
  const [entries, setEntries]   = useState([]);
  const [form, setForm]         = useState({ destination: '', photoUrl: '', startDate: '', endDate: '', tripLink: '', itinerary: '' });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [error, setError]       = useState('');

  const load = () => api.get('/honeymoon').then(r => setEntries(r.data));
  useEffect(() => { load(); }, []);

  const resetForm = () => setForm({ destination: '', photoUrl: '', startDate: '', endDate: '', tripLink: '', itinerary: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`/honeymoon/${editing}`, form);
        setEditing(null);
      } else {
        await api.post('/honeymoon', form);
      }
      resetForm();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Make sure you are logged in with your real account, not demo mode.');
    }
  };

  const handleDelete = async id => {
    setEntries(prev => prev.filter(h => h.id !== id));
    api.delete(`/honeymoon/${id}`).catch(() => {});
  };

  const startEdit = h => {
    setForm({ destination: h.destination, photoUrl: h.photoUrl || '', startDate: h.startDate || '', endDate: h.endDate || '', tripLink: h.tripLink || '', itinerary: h.itinerary || '' });
    setEditing(h.id);
    setShowForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Honeymoon</h2>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); resetForm(); setError(''); }}>
          + Add Destination
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input placeholder="Destination" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} required style={inp} />
            <ImageInput value={form.photoUrl} onChange={v => setForm({...form, photoUrl: v})} placeholder="Photo URL or upload" />
            <input placeholder="Trip link (https://…)" value={form.tripLink} onChange={e => setForm({...form, tripLink: e.target.value})} style={inp} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <label style={{ fontSize: '.75rem', color: 'var(--gray-mid)' }}>Start date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} style={inp} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <label style={{ fontSize: '.75rem', color: 'var(--gray-mid)' }}>End date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} style={inp} />
            </div>
          </div>
          <textarea placeholder="Itinerary (day by day plan…)" value={form.itinerary}
            onChange={e => setForm({...form, itinerary: e.target.value})}
            style={{...inp, resize: 'vertical', minHeight: 100}} />
          {error && <p style={{ color: '#c0392b', fontSize: '.9rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Save'}</button>
            <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); setError(''); }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {entries.map(h => (
          <div key={h.id} className="honeymoon-card card">
            {h.photoUrl && <img src={h.photoUrl} alt={h.destination} className="honeymoon-img" />}
            <div className="honeymoon-info">
              <h3>{h.destination}</h3>
              {(h.startDate || h.endDate) && (
                <p style={{ color: 'var(--pink)', fontStyle: 'italic', margin: '6px 0' }}>{h.startDate} → {h.endDate}</p>
              )}
              {h.tripLink && (
                <a href={h.tripLink} target="_blank" rel="noreferrer" style={{ color: 'var(--pink)', fontSize: '.9rem' }}>
                  View Trip ↗
                </a>
              )}
              {h.itinerary && (
                <p style={{ color: 'var(--gray-mid)', marginTop: 10, whiteSpace: 'pre-line', fontSize: '.9rem' }}>{h.itinerary}</p>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '.85rem' }} onClick={() => startEdit(h)}>
                  Edit
                </button>
                <button style={{ padding: '6px 16px', fontSize: '.85rem', background: 'none', border: '1px solid #c0392b', borderRadius: 8, color: '#c0392b', cursor: 'pointer' }} onClick={() => handleDelete(h.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)', width: '100%' };
