import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Budget() {
  const [items, setItems]       = useState([]);
  const [summary, setSummary]   = useState(null);
  const [form, setForm]         = useState({ category: '', description: '', amount: '', paid: false, date: '', isDebt: false });
  const [showForm, setShowForm] = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [fundsForm, setFundsForm] = useState({ mode: 'funds', amount: '', message: '', giverName: '' });
  const [budget, setBudget]     = useState(() => Number(localStorage.getItem('totalBudget')) || 0);
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  const load = () => {
    api.get('/budget').then(r => setItems(r.data));
    api.get('/budget/summary').then(r => setSummary(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/budget', form);
    setForm({ category: '', description: '', amount: '', paid: false, date: '', isDebt: false });
    setShowForm(false);
    load();
  };

  const togglePaid = async item => {
    await api.put(`/budget/${item.id}`, { paid: !item.paid });
    load();
  };

  const handleDelete = async id => {
    await api.delete(`/budget/${id}`);
    load();
  };

  const handleAddFunds = async e => {
    e.preventDefault();
    const payload = { amount: fundsForm.amount, message: fundsForm.message };
    if (fundsForm.mode === 'gift') payload.giverName = fundsForm.giverName;
    await api.post('/budget/gifts', payload);
    setFundsForm({ mode: 'funds', amount: '', message: '', giverName: '' });
    setShowFunds(false);
    load();
  };

  const saveBudget = () => {
    const val = Number(budgetInput);
    if (val > 0) { setBudget(val); localStorage.setItem('totalBudget', val); }
    setEditBudget(false);
  };

  const categories = [...new Set(items.map(i => i.category))];
  const totalSpent  = Number(summary?.totalSpent  || 0);
  const totalPaid   = Number(summary?.totalPaid   || 0);
  const totalGifts  = Number(summary?.totalGifts  || 0);
  const remaining   = budget > 0 ? budget - totalSpent : null;

  const totalPending = Number(summary?.totalPending || 0);
  const chartData = [
    { name: 'Budget',    value: budget,       fill: '#C8A9D4' },
    { name: 'Spent',     value: totalSpent,   fill: '#ff6eb4' },
    { name: 'Paid',      value: totalPaid,    fill: '#dbeeff' },
    { name: 'Pending',   value: totalPending, fill: '#FCE3EC' },
    { name: 'Remaining', value: remaining ?? 0, fill: '#d4edda' },
    { name: 'Gifts',     value: totalGifts,   fill: '#fff3cd' },
  ].filter(d => d.value > 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Budget</h2>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setShowFunds(false); }}>+ Add Expense</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <input placeholder="Category (e.g. Dress)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required style={inp} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={inp} />
          <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required style={{...inp, width: 120}} />
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inp} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.9rem' }}>
            <input type="checkbox" checked={form.paid} onChange={e => setForm({...form, paid: e.target.checked})} /> Paid
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.9rem' }}>
            <input type="checkbox" checked={form.isDebt} onChange={e => setForm({...form, isDebt: e.target.checked})} /> Debt
          </label>
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}

      {/* Add Funds section */}
      <div className="card" style={{ marginBottom: 24, padding: '13px 18px', background: '#fde8ea' }}>
        {!showFunds ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--pink)' }}>Funds / Gifts</span>
            <button onClick={() => setShowFunds(true)}
              style={{ fontSize: '.75rem', color: 'var(--pink)', background: 'none', border: '1px solid var(--pink)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>
              + Add
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddFunds} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="radio" name="fundsMode" value="funds" checked={fundsForm.mode === 'funds'} onChange={() => setFundsForm({...fundsForm, mode: 'funds'})} />
              Funds
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="radio" name="fundsMode" value="gift" checked={fundsForm.mode === 'gift'} onChange={() => setFundsForm({...fundsForm, mode: 'gift'})} />
              Gift
            </label>
            {fundsForm.mode === 'gift' && (
              <input placeholder="Giver name" value={fundsForm.giverName} onChange={e => setFundsForm({...fundsForm, giverName: e.target.value})} required style={{...sInp, width: 130}} />
            )}
            <input type="number" placeholder="Amount" value={fundsForm.amount} onChange={e => setFundsForm({...fundsForm, amount: e.target.value})} required style={{...sInp, width: 90}} />
            <input placeholder="Note" value={fundsForm.message} onChange={e => setFundsForm({...fundsForm, message: e.target.value})} style={{...sInp, flex: 1, minWidth: 80}} />
            <button type="submit" className="btn-primary" style={{ background: 'var(--pink)', padding: '5px 12px', fontSize: '.78rem' }}>Save</button>
            <button type="button" onClick={() => setShowFunds(false)} style={{ fontSize: '.78rem', background: 'none', border: 'none', color: 'var(--gray-mid)', cursor: 'pointer' }}>✕</button>
          </form>
        )}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Budget" value={budget > 0 ? `$${budget.toLocaleString()}` : '—'} sub={
          editBudget
            ? <span style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} style={{ ...inp, width: 90, padding: '4px 8px' }} placeholder="Amount" />
                <button className="btn-primary" style={{ padding: '4px 10px', fontSize: '.8rem' }} onClick={saveBudget}>Save</button>
              </span>
            : <button onClick={() => { setEditBudget(true); setBudgetInput(budget || ''); }} style={{ fontSize: '.75rem', color: 'var(--pink)', background: 'none', border: 'none', marginTop: 4 }}>Edit</button>
        } color="var(--lilac)" />
        <StatCard label="Total Expenses"  value={`$${totalSpent.toLocaleString()}`}  color="var(--black)" />
        <StatCard label="Paid"            value={`$${totalPaid.toLocaleString()}`}   color="var(--pink)" />
        <StatCard label="Pending"         value={`$${Number(summary?.totalPending || 0).toLocaleString()}`} color="#c0392b" />
        {remaining !== null && <StatCard label="Remaining"  value={`$${remaining.toLocaleString()}`} color={remaining >= 0 ? 'var(--pink)' : '#c0392b'} />}
        <StatCard label="Gifts Received"  value={`$${totalGifts.toLocaleString()}`}  color="var(--pink)" />
      </div>

      {/* Progress bar */}
      {budget > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: 'var(--gray-mid)', marginBottom: 8 }}>
            <span>Spent vs Budget</span>
            <span>{budget > 0 ? Math.round((totalSpent / budget) * 100) : 0}%</span>
          </div>
          <div style={{ background: 'var(--gray-light)', borderRadius: 99, height: 12, overflow: 'hidden' }}>
            <div style={{ background: totalSpent > budget ? '#c0392b' : 'var(--pink)', height: '100%', borderRadius: 99, width: `${Math.min((totalSpent / budget) * 100, 100)}%`, transition: 'width .6s' }} />
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Budget Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 500000]} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `$${Number(v).toLocaleString()}`} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <h3 style={{ color: 'var(--pink)', marginBottom: 8, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</h3>
          {items.filter(i => i.category === cat).map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <span>{item.description || item.category}</span>
                {item.date && <span style={{ color: 'var(--gray-mid)', fontSize: '.8rem', marginLeft: 8 }}>{item.date}</span>}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <strong>${Number(item.amount).toLocaleString()}</strong>
                <button
                  onClick={() => togglePaid(item)}
                  style={{ padding: '4px 12px', fontSize: '.8rem', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    background: item.paid ? '#d4edda' : '#FCE3EC', color: item.paid ? 'var(--pink)' : '#b5516e',
                    fontWeight: item.paid ? 'normal' : '600' }}>
                  {item.paid ? 'Paid' : 'Unpaid'}
                </button>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#c0392b' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const inp  = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)' };
const sInp = { padding: '5px 9px',  border: '1.5px solid var(--gray-light)', borderRadius: 7,  fontSize: '.8rem',  outline: 'none', background: 'var(--white)' };

function StatCard({ label, value, color, sub }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '.75rem', color: 'var(--gray-mid)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, color }}>{value}</div>
      {sub}
    </div>
  );
}
