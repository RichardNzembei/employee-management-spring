'use client';
import { useState } from 'react';
import { employeeApi } from '@/lib/api';
import { Employee, POSITION_LABELS } from '@/types/employee';
import toast from 'react-hot-toast';
import { Search, Calendar, DollarSign, Hash, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Employee | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const qRaw = query.trim();
    if (!qRaw) { toast.error('Enter a name, email, employee id, or gmail'); return; }
    setLoading(true); setResult(null); setNotFound(false);
    try {
      const list = await employeeApi.getAll();
      const q = qRaw.toLowerCase();

      const matches = list.filter(e => {
        const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
        if (fullName.includes(q)) return true;
        if (e.email.toLowerCase().includes(q)) return true;
        if (e.employmentNumber && e.employmentNumber.toLowerCase().includes(q)) return true;
        if (POSITION_LABELS[e.position].toLowerCase().includes(q) || e.position.toLowerCase().includes(q)) return true;
        if ((q === 'gmail' || q === 'gmail.com') && e.email.toLowerCase().endsWith('@gmail.com')) return true;
        return false;
      });

      if (matches.length === 0) setNotFound(true);
      else if (matches.length === 1) setResult(matches[0]);
      else {
        setResult(matches[0]);
        toast(`Found ${matches.length} results — showing first`);
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Search failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', marginBottom: '8px' }}>Search employees</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Search by name, email (or gmail), employee ID, or position</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          className="input"
          type="text"
          placeholder="name, email, EMP-001, junior, gmail..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn-primary" onClick={handleSearch} disabled={loading} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={14} /> {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {notFound && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderColor: 'var(--danger)' }}>
          <AlertCircle size={20} color="var(--danger)" />
          <div>
            <div style={{ fontWeight: 600 }}>Not Found</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No employee with email <strong>{query}</strong></div>
          </div>
        </div>
      )}

      {result && (
        <div className="card animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px' }}>{result.firstName} {result.lastName}</h2>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{result.email}</div>
            </div>
            <span className={result.position === 'SENIOR_DEVELOPER' ? 'badge-senior' : 'badge-junior'}>
              {POSITION_LABELS[result.position]}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <Hash size={14} /> <span>Employment #</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{result.employmentNumber}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <DollarSign size={14} /> <span>Salary</span>
              <span style={{ color: 'var(--text-primary)' }}>${Number(result.salary).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <Calendar size={14} /> <span>Employed</span>
              <span style={{ color: 'var(--text-primary)' }}>{format(new Date(result.employmentDate), 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
