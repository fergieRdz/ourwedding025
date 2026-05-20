import { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const STATUS_COLORS = { confirmed: '#FCE3EC', unconfirmed: '#dbeeff', pending: '#ede0f5' };
const STATUS_TEXT   = { confirmed: '#b5516e', unconfirmed: '#154360', pending: '#7b5ea7' };
const CHART_COLORS  = { confirmed: '#ff85a1', unconfirmed: '#5b9bd5', pending: '#9b72cf' };

export default function Guests() {
  const [guests, setGuests]     = useState([]);
  const [form, setForm]         = useState({ name: '', email: '', phone: '', status: 'pending' });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');

  const load = () => api.get('/guests').then(r => setGuests(r.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/guests', form);
    setForm({ name: '', email: '', phone: '', status: 'pending' });
    setShowForm(false);
    load();
  };

  const handleStatus = async (id, status) => {
    await api.put(`/guests/${id}`, { status });
    load();
  };

  const handleDelete = async id => {
    await api.delete(`/guests/${id}`);
    load();
  };

  const counts    = guests.reduce((acc, g) => { acc[g.status] = (acc[g.status] || 0) + 1; return acc; }, {});
  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const filtered  = guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 2 }}>Guest List</h2>
          <span style={{ fontSize: '.85rem', color: 'var(--gray-mid)' }}>
            {guests.length} registered · {counts.confirmed || 0} confirmed · {counts.pending || 0} pending
          </span>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Guest</button>
      </div>

      <input
        placeholder="Search by name…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inp, marginBottom: 20, maxWidth: 300 }}
      />

      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={inp} />
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inp} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inp} />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={inp}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="unconfirmed">Unconfirmed</option>
          </select>
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          {filtered.length === 0 && search && (
            <p style={{ color: 'var(--gray-mid)', fontStyle: 'italic', fontSize: '.9rem' }}>No guests match "{search}".</p>
          )}
          {['confirmed', 'pending', 'unconfirmed'].map(status => {
            const group = filtered.filter(g => g.status === status);
            if (group.length === 0) return null;
            return (
              <div key={status} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{
                    padding: '3px 14px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600,
                    background: STATUS_COLORS[status], color: STATUS_TEXT[status],
                    textTransform: 'capitalize',
                  }}>{status}</span>
                  <span style={{ fontSize: '.82rem', color: 'var(--gray-mid)' }}>{group.length} guest{group.length !== 1 ? 's' : ''}</span>
                </div>
                {group.map(g => (
                  <div key={g.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <strong>{g.name}</strong>
                      <div style={{ fontSize: '.85rem', color: 'var(--gray-mid)' }}>{g.email} {g.phone}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select value={g.status} onChange={e => handleStatus(g.id, e.target.value)} style={{ ...inp, width: 'auto' }}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="unconfirmed">Unconfirmed</option>
                      </select>
                      <button onClick={() => handleDelete(g.id)} style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '1.1rem' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {chartData.length > 0 && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 320 }}>
            <h3 style={{ marginBottom: 12 }}>Confirmation Rate</h3>
            <PieChart width={320} height={300}>
              <Pie data={chartData} cx={160} cy={130} innerRadius={70} outerRadius={120} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={true}>
                {chartData.map(entry => (
                  <Cell key={entry.name} fill={CHART_COLORS[entry.name] || '#eee'} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)' };
