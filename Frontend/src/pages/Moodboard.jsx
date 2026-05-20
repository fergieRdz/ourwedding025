import { useState, useEffect } from 'react';
import api from '../services/api';
import ImageInput from '../components/ImageInput';
import './Moodboard.css';

export default function Moodboard() {
  const [photos, setPhotos]     = useState([]);
  const [form, setForm]         = useState({ imageUrl: '', category: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filterCat, setFilterCat] = useState('');

  const load = () => api.get('/moodboard').then(r => setPhotos(r.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async e => {
    e.preventDefault();
    setError('');
    if (!form.imageUrl.trim()) { setError('Image URL or upload is required'); return; }
    try {
      await api.post('/moodboard', { imageUrl: form.imageUrl.trim(), category: form.category.trim() });
      setForm({ imageUrl: '', category: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save photo');
    }
  };

  const handleDelete = async id => {
    await api.delete(`/moodboard/${id}`);
    load();
  };

  const categories = [...new Set(photos.map(p => p.category).filter(Boolean))];

  const visible = photos.filter(p => {
    const matchCat = !filterCat || p.category === filterCat;
    const matchSearch = !search || (p.category || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Inspiration & Moodboard</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Photo</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 2, minWidth: 220 }}>
              <ImageInput value={form.imageUrl} onChange={v => setForm({...form, imageUrl: v})} placeholder="Photo URL or upload" />
            </div>
            <input placeholder="Category (Dress, Decor…)" value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
              style={{...inp, flex: 1, minWidth: 140}} />
          </div>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" onError={e => e.target.style.display='none'}
              style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />
          )}
          {error && <p style={{ color: '#c0392b', fontSize: '.9rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Search & filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search by category…" value={search} onChange={e => setSearch(e.target.value)} style={{...inp, width: 220}} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => setFilterCat('')}
            style={{ borderRadius: 20, padding: '4px 14px', fontSize: '.82rem', cursor: 'pointer',
              background: !filterCat ? 'var(--pink)' : 'var(--soft-pink)',
              color: !filterCat ? 'var(--white)' : '#b5516e',
              border: 'none', fontWeight: !filterCat ? 600 : 400 }}>
            All
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(filterCat === c ? '' : c)}
              style={{ borderRadius: 20, padding: '4px 14px', fontSize: '.82rem', cursor: 'pointer',
                background: filterCat === c ? 'var(--pink)' : 'var(--soft-pink)',
                color: filterCat === c ? 'var(--white)' : '#b5516e',
                border: 'none', fontWeight: filterCat === c ? 600 : 400 }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="moodboard-grid">
        {visible.map(p => (
          <div key={p.id} className="moodboard-item">
            <img src={p.imageUrl} alt={p.category || 'inspiration'} />
            <div className="moodboard-overlay">
              {p.category && <span className="moodboard-cat">{p.category}</span>}
              <button onClick={() => handleDelete(p.id)} className="moodboard-del">✕</button>
            </div>
          </div>
        ))}
      </div>
      {visible.length === 0 && (
        <p style={{ color: 'var(--gray-mid)', textAlign: 'center', marginTop: 40, fontStyle: 'italic' }}>
          {photos.length === 0 ? 'No photos yet — add your first inspiration!' : 'No photos match your filter.'}
        </p>
      )}
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)' };
