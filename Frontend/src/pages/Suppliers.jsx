import { useState, useEffect } from 'react';
import api from '../services/api';
import ImageInput from '../components/ImageInput';

const DEFAULT_CATEGORIES = ['Photographer', 'Flowers', 'Dress', 'Catering', 'Music', 'Decoration', 'Other'];

export default function Suppliers() {
  const [suppliers, setSuppliers]   = useState([]);
  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState('');
  const [form, setForm]             = useState({ name: '', category: '', phone: '', status: 'pending', photoUrl: '', notes: '' });
  const [showForm, setShowForm]     = useState(false);
  const [customCat, setCustomCat]   = useState('');
  const [categories, setCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem('supplierCategories') || 'null') || DEFAULT_CATEGORIES; } catch { return DEFAULT_CATEGORIES; }
  });
  const [showAddCat, setShowAddCat] = useState(false);

  const saveCategories = cats => {
    setCategories(cats);
    localStorage.setItem('supplierCategories', JSON.stringify(cats));
  };

  const addCategory = () => {
    const cat = customCat.trim();
    if (cat && !categories.includes(cat)) {
      saveCategories([...categories, cat]);
    }
    setCustomCat('');
    setShowAddCat(false);
  };

  const removeCategory = cat => saveCategories(categories.filter(c => c !== cat));

  const load = () => {
    const params = {};
    if (search) params.search = search;
    if (filterCat) params.category = filterCat;
    api.get('/suppliers', { params }).then(r => setSuppliers(r.data));
  };
  useEffect(() => { load(); }, [search, filterCat]);

  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/suppliers', form);
    setForm({ name: '', category: '', phone: '', status: 'pending', photoUrl: '', notes: '' });
    setShowForm(false);
    load();
  };

  const toggleStatus = async s => {
    await api.put(`/suppliers/${s.id}`, { status: s.status === 'confirmed' ? 'pending' : 'confirmed' });
    load();
  };

  const handleDelete = async id => {
    await api.delete(`/suppliers/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Suppliers</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Supplier</button>
      </div>

      {/* Category manager */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.85rem', color: 'var(--gray-mid)' }}>Categories:</span>
          {categories.map(c => (
            <span key={c} style={{ background: 'var(--soft-pink)', color: '#b5516e', borderRadius: 20, padding: '3px 10px', fontSize: '.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              {c}
              <button onClick={() => removeCategory(c)} style={{ background: 'none', border: 'none', color: '#b5516e', fontSize: '.75rem', cursor: 'pointer', padding: 0 }}>✕</button>
            </span>
          ))}
          {showAddCat
            ? <span style={{ display: 'flex', gap: 6 }}>
                <input value={customCat} onChange={e => setCustomCat(e.target.value)} placeholder="New category" style={{...inp, width: 140, padding: '4px 8px'}} onKeyDown={e => e.key === 'Enter' && addCategory()} />
                <button className="btn-primary" style={{ padding: '4px 12px', fontSize: '.8rem' }} onClick={addCategory}>Add</button>
              </span>
            : <button onClick={() => setShowAddCat(true)} style={{ fontSize: '.8rem', color: 'var(--pink)', background: 'none', border: '1px dashed var(--pink)', borderRadius: 20, padding: '3px 10px', cursor: 'pointer' }}>+ New</button>
          }
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={inp} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={inp}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inp} />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inp}>
            <option value="">Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inp} />
          <ImageInput value={form.photoUrl} onChange={v => setForm({...form, photoUrl: v})} placeholder="Photo URL or upload" />
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{...inp, resize: 'none', height: 38}} />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16 }}>
        {suppliers.map(s => (
          <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {s.photoUrl && <img src={s.photoUrl} alt={s.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong>{s.name}</strong>
                <div style={{ fontSize: '.8rem', color: 'var(--gray-mid)' }}>{s.category}</div>
                {s.phone && <div style={{ fontSize: '.8rem', color: 'var(--gray-mid)' }}>{s.phone}</div>}
              </div>
              <span className={`badge ${s.status === 'confirmed' ? 'badge-blue' : 'badge-pending'}`}>{s.status}</span>
            </div>
            {s.notes && <p style={{ fontSize: '.82rem', color: 'var(--gray-mid)' }}>{s.notes}</p>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '6px' }} onClick={() => toggleStatus(s)}>
                {s.status === 'confirmed' ? 'Unconfirm' : 'Confirm'}
              </button>
              <button onClick={() => handleDelete(s.id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)' };
