import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Shopping() {
  const [items, setItems]       = useState([]);
  const [form, setForm]         = useState({ name: '', quantity: 1, deadline: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/shopping').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/shopping', form);
    setForm({ name: '', quantity: 1, deadline: '' });
    setShowForm(false);
    load();
  };

  const togglePurchased = async item => {
    await api.put(`/shopping/${item.id}`, { purchased: !item.purchased });
    load();
  };

  const isOverdue = item => item.deadline && !item.purchased && new Date(item.deadline) < new Date(new Date().toDateString());

  const pending   = items.filter(i => !i.purchased);
  const purchased = items.filter(i => i.purchased);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Shopping List</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Item</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <input placeholder="Item name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inp} />
          <input type="number" placeholder="Qty" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} style={{...inp, width: 80}} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label style={{ fontSize: '.75rem', color: 'var(--gray-mid)' }}>Purchase deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} style={inp} />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Save</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pending.map(item => <ShopRow key={item.id} item={item} onToggle={togglePurchased} overdue={isOverdue(item)} />)}

        {purchased.length > 0 && (
          <>
            <p style={{ fontSize: '.8rem', color: 'var(--gray-mid)', marginTop: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Purchased</p>
            {purchased.map(item => <ShopRow key={item.id} item={item} onToggle={togglePurchased} overdue={false} />)}
          </>
        )}
      </div>
    </div>
  );
}

function ShopRow({ item, onToggle, overdue }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <input type="checkbox" checked={item.purchased} onChange={() => onToggle(item)}
        style={{ width: 18, height: 18, accentColor: 'var(--pink)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <span style={{ textDecoration: item.purchased ? 'line-through' : 'none', color: item.purchased ? 'var(--gray-mid)' : 'var(--black)' }}>
          {item.name}
        </span>
        <span style={{ color: 'var(--gray-mid)', fontSize: '.85rem', marginLeft: 8 }}>x{item.quantity}</span>
      </div>
      {item.deadline && (
        <span style={{ fontSize: '.8rem', color: overdue ? '#c0392b' : 'var(--gray-mid)',
          background: overdue ? '#fde8e8' : '#ede0f5', color: overdue ? '#c0392b' : '#7b5ea7', padding: '2px 10px', borderRadius: 20 }}>
          {overdue && '⚠️ '}By {item.deadline}
        </span>
      )}
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)' };
