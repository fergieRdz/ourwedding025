import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Todos() {
  const [todos, setTodos]       = useState([]);
  const [form, setForm]         = useState({ title: '', date: '', time: '', deadline: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/todos').then(r => setTodos(r.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/todos', { title: form.title, date: form.date, time: form.time });
    setForm({ title: '', date: '', time: '', deadline: '' });
    setShowForm(false);
    load();
  };

  const toggleDone = async todo => {
    await api.put(`/todos/${todo.id}`, { completed: !todo.completed });
    load();
  };

  const pending   = todos.filter(t => !t.completed);
  const completed = todos.filter(t => t.completed);

  const isOverdue = t => t.date && !t.completed && new Date(t.date) < new Date(new Date().toDateString());

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Things To Do</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Task</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <input placeholder="Task title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inp} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label style={{ fontSize: '.75rem', color: 'var(--gray-mid)' }}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inp} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label style={{ fontSize: '.75rem', color: 'var(--gray-mid)' }}>Time</label>
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} style={inp} />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Save</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pending.map(t => <TodoRow key={t.id} t={t} onToggle={toggleDone} overdue={isOverdue(t)} />)}

        {completed.length > 0 && (
          <>
            <p style={{ fontSize: '.8rem', color: 'var(--gray-mid)', marginTop: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Completed</p>
            {completed.map(t => <TodoRow key={t.id} t={t} onToggle={toggleDone} overdue={false} />)}
          </>
        )}
      </div>
    </div>
  );
}

function TodoRow({ t, onToggle, overdue }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <input type="checkbox" checked={t.completed} onChange={() => onToggle(t)}
        style={{ width: 18, height: 18, accentColor: 'var(--pink)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <span style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? 'var(--gray-mid)' : 'var(--black)' }}>
          {t.title}
        </span>
        {(t.date || t.time) && (
          <span style={{ fontSize: '.92rem', color: overdue ? '#c0392b' : 'var(--gray-mid)', marginLeft: 10 }}>
            {overdue && '⚠️ '}
            {t.date} {t.time}
          </span>
        )}
      </div>
      {overdue && (
        <span style={{ fontSize: '.75rem', background: '#fde8e8', color: '#c0392b', padding: '2px 8px', borderRadius: 20 }}>Overdue</span>
      )}
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)' };
