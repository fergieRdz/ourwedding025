export default function ImageInput({ value, onChange, placeholder = 'Paste image URL or upload file' }) {
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
      <input
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inp}
      />
      <label style={{
        cursor: 'pointer', padding: '8px 14px', border: '1.5px solid var(--gray-light)',
        borderRadius: 8, fontSize: '.85rem', whiteSpace: 'nowrap', background: 'var(--white)',
        color: 'var(--black)', transition: 'border-color .2s',
      }}>
        📁 Upload
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </label>
    </div>
  );
}

const inp = { padding: '8px 12px', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '.95rem', outline: 'none', background: 'var(--white)', width: '100%' };
