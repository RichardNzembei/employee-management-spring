'use client';
import { useState } from 'react';
import { employeeApi } from '@/lib/api';
import { Employee, POSITION_LABELS } from '@/types/employee';
import toast from 'react-hot-toast';
import { Search, Calendar, DollarSign, Hash, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function SearchPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<Employee | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) { toast.error('Enter an email to search'); return; }
    setLoading(true); setResult(null); setNotFound(false);
    try {
      setResult(await employeeApi.getByEmail(email.trim()));
    } catch (e: any) {
      if (e.response?.status === 404) setNotFound(true);
      else toast.error(e.response?.data?.message || 'Search failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', marginBottom: '8px' }}>Search by Email</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Look up an employee by their email address</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          className="input"
          type="email"
          placeholder="employee@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No employee with email <strong>{email}</strong></div>
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
