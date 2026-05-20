import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import './Tables.css';

const TABLE_COLORS = ['#FCE3EC','#C8A9D4','#dbeeff','#d4edda','#fff3cd','#f0e8ef'];
const DEFAULT_COLOR_NAMES = {
  '#FCE3EC': 'Soft Pink',
  '#C8A9D4': 'Lilac',
  '#dbeeff': 'Sky Blue',
  '#d4edda': 'Mint',
  '#fff3cd': 'Champagne',
  '#f0e8ef': 'Lavender',
};

const ROOM_W = 900;
const ROOM_H = 520;
const T_SIZE  = 84;

export default function Tables() {
  const [tables, setTables]     = useState([]);
  const [guests, setGuests]     = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ tableNumber: '', capacity: 8 });
  const [tableColors, setTableColors] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tableColors') || '{}'); } catch { return {}; }
  });
  const [colorNames, setColorNames] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tableColorNames') || 'null') || DEFAULT_COLOR_NAMES; } catch { return DEFAULT_COLOR_NAMES; }
  });
  const [editingColor, setEditingColor] = useState(null);
  const [editNameVal, setEditNameVal]   = useState('');

  // Floor plan state
  const [view, setView]       = useState('list');
  const [positions, setPositions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tablePlanPositions') || '{}'); } catch { return {}; }
  });
  const [tableShapes, setTableShapes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tableShapes') || '{}'); } catch { return {}; }
  });
  const [selected, setSelected] = useState(null);
  const draggingId  = useRef(null);
  const dragOffset  = useRef({ x: 0, y: 0 });
  const posRef      = useRef(positions);
  const roomRef     = useRef(null);

  useEffect(() => { posRef.current = positions; }, [positions]);

  const load = () => {
    api.get('/tables').then(r => setTables(r.data));
    api.get('/guests').then(r => setGuests(r.data));
  };
  useEffect(() => { load(); }, []);

  // Auto-init positions for tables that don't have one yet
  useEffect(() => {
    if (!tables.length) return;
    setPositions(prev => {
      const next = { ...prev };
      let changed = false;
      tables.forEach((t, i) => {
        if (next[t.id] === undefined) {
          next[t.id] = { x: 40 + (i % 4) * 210, y: 50 + Math.floor(i / 4) * 170 };
          changed = true;
        }
      });
      if (changed) localStorage.setItem('tablePlanPositions', JSON.stringify(next));
      return changed ? next : prev;
    });
  }, [tables]);

  const handleCreate = async e => {
    e.preventDefault();
    await api.post('/tables', form);
    setForm({ tableNumber: '', capacity: 8 });
    setShowForm(false);
    load();
  };

  const handleDelete = async id => {
    await api.delete(`/tables/${id}`);
    load();
  };

  const assignGuest = async (tableId, guestId) => {
    if (!guestId) return;
    await api.put(`/guests/${guestId}`, { tableId });
    load();
  };

  const setColor = (id, color) => {
    const updated = { ...tableColors, [id]: color };
    setTableColors(updated);
    localStorage.setItem('tableColors', JSON.stringify(updated));
  };

  const startEditName = color => { setEditingColor(color); setEditNameVal(colorNames[color] || ''); };
  const saveColorName = () => {
    const updated = { ...colorNames, [editingColor]: editNameVal.trim() || DEFAULT_COLOR_NAMES[editingColor] };
    setColorNames(updated);
    localStorage.setItem('tableColorNames', JSON.stringify(updated));
    setEditingColor(null);
    setEditNameVal('');
  };

  // ── Floor plan drag handlers ──────────────────────────────────────────────
  const startDrag = (clientX, clientY, id) => {
    const rect = roomRef.current.getBoundingClientRect();
    draggingId.current = id;
    dragOffset.current = {
      x: clientX - rect.left - (posRef.current[id]?.x || 0),
      y: clientY - rect.top  - (posRef.current[id]?.y || 0),
    };
    setSelected(id);
  };

  const moveDrag = (clientX, clientY) => {
    if (!draggingId.current || !roomRef.current) return;
    const rect = roomRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(ROOM_W - T_SIZE, clientX - rect.left - dragOffset.current.x));
    const y = Math.max(0, Math.min(ROOM_H - T_SIZE, clientY - rect.top  - dragOffset.current.y));
    setPositions(prev => ({ ...prev, [draggingId.current]: { x, y } }));
  };

  const endDrag = () => {
    if (draggingId.current) {
      localStorage.setItem('tablePlanPositions', JSON.stringify(posRef.current));
      draggingId.current = null;
    }
  };

  const setShape = (id, shape) => {
    const next = { ...tableShapes, [id]: shape };
    setTableShapes(next);
    localStorage.setItem('tableShapes', JSON.stringify(next));
  };

  const resetPositions = () => {
    const next = {};
    tables.forEach((t, i) => { next[t.id] = { x: 40 + (i % 4) * 210, y: 50 + Math.floor(i / 4) * 170 }; });
    setPositions(next);
    localStorage.setItem('tablePlanPositions', JSON.stringify(next));
  };

  const getShapeStyle = (id, color) => {
    const shape = tableShapes[id] || 'round';
    const isSelected = selected === id;
    const base = {
      position: 'absolute', width: T_SIZE, height: T_SIZE,
      background: color,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      cursor: draggingId.current === id ? 'grabbing' : 'grab',
      userSelect: 'none',
      boxShadow: isSelected ? '0 0 0 3px #ff6eb4, 0 4px 16px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.12)',
      border: '2px solid rgba(255,255,255,0.8)',
      transition: 'box-shadow .15s',
    };
    if (shape === 'round')    return { ...base, borderRadius: '50%' };
    if (shape === 'triangle') return { ...base, borderRadius: 0, clipPath: 'polygon(50% 4%, 2% 96%, 98% 96%)', paddingTop: 22 };
    return { ...base, borderRadius: 10 };
  };

  const selectedTable = tables.find(t => t.id === selected);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem' }}>Tables & Seating</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* View toggle */}
          <div style={{ display: 'flex', border: '1.5px solid var(--gray-light)', borderRadius: 10, overflow: 'hidden' }}>
            {['list', 'plan'].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: '7px 18px', fontSize: '.85rem', cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                  background: view === v ? 'var(--pink)' : 'var(--white)',
                  color: view === v ? '#fff' : 'var(--black)',
                  fontWeight: view === v ? 600 : 400 }}>
                {v === 'list' ? '☰ List' : '⊞ Floor Plan'}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Table</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input type="number" placeholder="Table #" value={form.tableNumber} onChange={e => setForm({...form, tableNumber: e.target.value})} required style={inp} />
          <input type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} style={{...inp, width: 100}} />
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}

      {/* Color legend */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '.82rem', color: 'var(--gray-mid)' }}>Color scheme:</span>
        {TABLE_COLORS.map(color => (
          <span key={color} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: color, border: '1px solid #ddd', display: 'inline-block', flexShrink: 0 }} />
            {editingColor === color
              ? <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <input value={editNameVal} onChange={e => setEditNameVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveColorName(); if (e.key === 'Escape') setEditingColor(null); }}
                    style={{ ...inp, padding: '2px 6px', fontSize: '.78rem', width: 90 }} autoFocus />
                  <button onClick={saveColorName} style={{ background: 'var(--pink)', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: '.75rem', cursor: 'pointer' }}>✓</button>
                </span>
              : <span style={{ fontSize: '.8rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                  {colorNames[color]}
                  <button onClick={() => startEditName(color)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-mid)', fontSize: '.7rem', padding: '0 2px' }}>✎</button>
                </span>
            }
          </span>
        ))}
      </div>

      {/* ── LIST VIEW ──────────────────────────────────────────────────────── */}
      {view === 'list' && (
        <div className="tables-grid">
          {tables.map(t => {
            const color = tableColors[t.id] || TABLE_COLORS[0];
            return (
              <div key={t.id} className="table-card card">
                <div className="table-circle" style={{ background: color }}>
                  <span>{t.tableNumber}</span>
                </div>
                <div className="color-picker">
                  {TABLE_COLORS.map(c => (
                    <button key={c} onClick={() => setColor(t.id, c)} title={colorNames[c]}
                      style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: c === color ? '2px solid var(--black)' : '2px solid transparent', cursor: 'pointer', padding: 0 }} />
                  ))}
                </div>
                <div className="table-info">
                  <strong>Table {t.tableNumber}</strong>
                  <span style={{ fontSize: '.8rem', color: 'var(--gray-mid)' }}>Capacity: {t.capacity}</span>
                  <span style={{ fontSize: '.75rem', color: 'var(--gray-mid)', fontStyle: 'italic' }}>{colorNames[color]}</span>
                </div>
                <div className="table-seats">
                  {(t.Guests || []).map(g => <span key={g.id} className="seat-chip">{g.name}</span>)}
                </div>
                <select onChange={e => assignGuest(t.id, e.target.value)} defaultValue="" style={inp}>
                  <option value="" disabled>Assign guest…</option>
                  {guests.filter(g => !g.tableId || g.tableId === t.id).map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
                <button onClick={() => handleDelete(t.id)}
                  style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '.85rem', cursor: 'pointer', marginTop: 4 }}>
                  Delete table
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── FLOOR PLAN VIEW ────────────────────────────────────────────────── */}
      {view === 'plan' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: '.83rem', color: 'var(--gray-mid)' }}>
              {selectedTable ? `Selected: Table ${selectedTable.tableNumber}` : 'Click a table to select · Drag to reposition'}
            </span>
            <button onClick={resetPositions}
              style={{ fontSize: '.8rem', background: 'none', border: '1px solid var(--gray-light)', borderRadius: 8, padding: '4px 14px', cursor: 'pointer' }}>
              Reset positions
            </button>
          </div>

          {/* Room */}
          <div style={{ overflowX: 'auto' }}>
            <div
              ref={roomRef}
              style={{
                position: 'relative', width: ROOM_W, height: ROOM_H,
                background: '#faf7f0',
                border: '2.5px solid var(--gray-light)',
                borderRadius: 18,
                backgroundImage: 'radial-gradient(circle, #d8cebd 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
              onMouseMove={e => moveDrag(e.clientX, e.clientY)}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }}
              onTouchEnd={endDrag}
              onClick={() => setSelected(null)}
            >
              {/* Room label */}
              <span style={{ position: 'absolute', bottom: 12, right: 18, fontSize: '.75rem', color: '#bbb', pointerEvents: 'none' }}>
                Wedding Venue
              </span>

              {tables.map(t => {
                const color = tableColors[t.id] || TABLE_COLORS[0];
                const pos   = positions[t.id] || { x: 40, y: 40 };
                return (
                  <div
                    key={t.id}
                    style={{ ...getShapeStyle(t.id, color), left: pos.x, top: pos.y }}
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); startDrag(e.clientX, e.clientY, t.id); }}
                    onTouchStart={e => { e.stopPropagation(); startDrag(e.touches[0].clientX, e.touches[0].clientY, t.id); }}
                    onClick={e => { e.stopPropagation(); setSelected(t.id); }}
                  >
                    <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#333', textAlign: 'center', lineHeight: 1.2, padding: '0 4px' }}>
                      {t.tableNumber}
                    </span>
                    <span style={{ fontSize: '.6rem', color: '#666' }}>👤{t.capacity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shape selector */}
          {selectedTable && (
            <div className="card" style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '.85rem', fontWeight: 600 }}>Table {selectedTable.tableNumber} shape:</span>
              {[
                { key: 'round',    label: '⬤  Round'    },
                { key: 'square',   label: '■  Square'   },
                { key: 'triangle', label: '▲  Triangle' },
              ].map(s => (
                <button key={s.key} onClick={() => setShape(selected, s.key)}
                  style={{
                    padding: '7px 20px', borderRadius: 9, cursor: 'pointer', fontSize: '.85rem',
                    border: '1.5px solid var(--gray-light)',
                    background: (tableShapes[selected] || 'round') === s.key ? 'var(--pink)' : 'var(--white)',
                    color:      (tableShapes[selected] || 'round') === s.key ? '#fff'         : 'var(--black)',
                    fontWeight: (tableShapes[selected] || 'round') === s.key ? 600             : 400,
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)', width: '100%' };
