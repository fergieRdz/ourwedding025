import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import './Calendar.css';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Calendar() {
  const [events, setEvents]     = useState([]);
  const [form, setForm]         = useState({ title: '', date: '', time: '', reminderEnabled: false, notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const eventsPanelRef = useRef(null);

  const load = () => api.get('/calendar').then(r => setEvents(r.data));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selected && eventsPanelRef.current) {
      eventsPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selected]);

  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/calendar', form);
    setForm({ title: '', date: '', time: '', reminderEnabled: false, notes: '' });
    setShowForm(false);
    setSelected(null);
    load();
  };

  const handleDelete = async id => {
    await api.delete(`/calendar/${id}`);
    load();
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); };

  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const pad = n => String(n).padStart(2,'0');
  const dateStr = d => `${viewYear}-${pad(viewMonth+1)}-${pad(d)}`;
  const eventsOn = d => events.filter(e => e.date === dateStr(d));

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
  const selectedEvents = selected ? eventsOn(selected) : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Calendar</h2>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setSelected(null); }}>+ Add Event</button>
      </div>

      {/* Add event form — shows right below the button when clicked */}
      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <input placeholder="Event title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inp} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label style={{ fontSize: '.75rem', color: 'var(--gray-mid)' }}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required style={inp} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label style={{ fontSize: '.75rem', color: 'var(--gray-mid)' }}>Time</label>
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} style={inp} />
          </div>
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{...inp, resize: 'none', height: 38}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'center' }}>
            <input type="checkbox" checked={form.reminderEnabled} onChange={e => setForm({...form, reminderEnabled: e.target.checked})} />
            Reminder
          </label>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Save</button>
          <button type="button" className="btn-secondary" style={{ alignSelf: 'flex-end' }} onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      {/* Month navigator */}
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>‹</button>
        <span className="cal-title">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="cal-nav" onClick={nextMonth}>›</button>
      </div>

      {/* Day-of-week headers */}
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-dow">{d}</div>)}

        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const ds = dateStr(d);
          const evs = eventsOn(d);
          const isToday = ds === todayStr;
          const isSel   = selected === d;
          return (
            <div key={d} className={`cal-day${isToday ? ' today' : ''}${isSel ? ' selected' : ''}`}
              onClick={() => { setSelected(isSel ? null : d); setForm(f => ({ ...f, date: ds })); }}>
              <span className="cal-day-num">{d}</span>
              <div className="cal-dots">
                {evs.slice(0,3).map(ev => <span key={ev.id} className="cal-dot" />)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected day events */}
      {selected && (
        <div ref={eventsPanelRef} className="card" style={{ marginTop: 20, borderLeft: '4px solid var(--pink)' }}>
          <h3 style={{ marginBottom: 12 }}>{MONTHS[viewMonth]} {selected}</h3>
          {selectedEvents.length === 0
            ? <p style={{ color: 'var(--gray-mid)', fontStyle: 'italic' }}>No events — add one below.</p>
            : selectedEvents.map(ev => (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '8px 0', borderBottom: '1px solid var(--gray-light)' }}>
                  <div>
                    <strong>{ev.title}</strong>
                    {ev.time && <span style={{ color: 'var(--gray-mid)', marginLeft: 8, fontSize: '.9rem' }}>{ev.time}</span>}
                    {ev.reminderEnabled && <span className="badge badge-blue" style={{ marginLeft: 8 }}>Reminder</span>}
                    {ev.notes && <p style={{ fontSize: '.85rem', color: 'var(--gray-mid)', marginTop: 2 }}>{ev.notes}</p>}
                  </div>
                  <button onClick={() => handleDelete(ev.id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>✕</button>
                </div>
              ))
          }
        </div>
      )}

      {/* Quick add from selected day */}
      {selected && (
        <form onSubmit={handleAdd} className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          <input placeholder="Event title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inp} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <label style={{ fontSize: '.75rem', color: 'var(--gray-mid)' }}>Time</label>
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} style={inp} />
          </div>
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{...inp, resize: 'none', height: 38}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'center' }}>
            <input type="checkbox" checked={form.reminderEnabled} onChange={e => setForm({...form, reminderEnabled: e.target.checked})} />
            Reminder
          </label>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Add</button>
        </form>
      )}
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)' };
