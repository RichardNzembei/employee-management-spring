'use client';
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { useEmployees } from '@/hooks/useEmployees';
import EmployeeCard from '@/components/EmployeeCard';
import Modal from '@/components/Modal';
import { Users, RefreshCw, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Filter = 'ALL' | 'JUNIOR_DEVELOPER' | 'SENIOR_DEVELOPER';

export default function EmployeesPage() {
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState<Filter>('ALL');
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const { data, isLoading: loading, refetch } = useEmployees();
  const employees: Employee[] = (data ?? []) as Employee[];

  const handleRefresh = async () => {
    try {
      await refetch();
      setModalMessage('Employee list refreshed');
    } catch {
      toast.error('Failed to load employees');
    }
  };

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    return (filter === 'ALL' || e.position === filter) &&
      `${e.firstName} ${e.lastName} ${e.email} ${e.employmentNumber}`.toLowerCase().includes(q);
  });

  const tabs: { key: Filter; label: string }[] = [
    { key: 'ALL',              label: `All (${employees.length})` },
    { key: 'JUNIOR_DEVELOPER', label: `Junior (${employees.filter(e=>e.position==='JUNIOR_DEVELOPER').length})` },
    { key: 'SENIOR_DEVELOPER', label: `Senior (${employees.filter(e=>e.position==='SENIOR_DEVELOPER').length})` },
  ];

  return (
    <div style={{ padding: '44px' }} className="animate-fade-in">

      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '28px', letterSpacing: '-0.025em', color: '#0a0a0a', marginBottom: '4px' }}>
            Employees
          </h1>
          <p style={{ color: '#737373', fontSize: '13px' }}>
            {loading ? 'Loading…' : `${employees.length} team member${employees.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-ghost" onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <Link href="/employees/add" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={13} /> Add Employee
            </button>
          </Link>
        </div>
      </div>

      
      {!loading && employees.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #ebebeb', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setFilter(t.key)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '13px',
                fontWeight: filter === t.key ? 600 : 400,
                color: filter === t.key ? '#1e2d40' : '#737373',
                padding: '6px 14px', borderBottom: filter === t.key ? '2px solid #1e2d40' : '2px solid transparent',
                marginBottom: '-1px', transition: 'all 0.12s',
              }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', position: 'relative', width: '280px' }}>
            <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#b0b0b0', pointerEvents: 'none' }} />
            <input className="input" style={{ paddingLeft: '32px', fontSize: '13px' }}
              placeholder="Search name, email, number…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      )}

      
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b0b0b0', padding: '64px 0' }}>
          <span style={{ width: '15px', height: '15px', border: '2px solid #e0e0e0', borderTopColor: '#1e2d40', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.65s linear infinite' }} />
          <span style={{ fontSize: '13px' }}>Loading employees…</span>
        </div>
      ) : employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', border: '1px dashed #e0e0e0', borderRadius: '14px', background: '#fafafa' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eef1f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Users size={20} color="#1e2d40" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a0a0a', marginBottom: '6px' }}>No employees yet</h3>
          <p style={{ color: '#737373', fontSize: '13px', marginBottom: '22px' }}>Add your first team member to get started.</p>
          <Link href="/employees/add" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={13} /> Add First Employee
            </button>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', border: '1px solid #ebebeb', borderRadius: '14px' }}>
          <p style={{ color: '#737373', fontSize: '13px' }}>No results for &quot;<strong style={{ color: '#0a0a0a' }}>{search}</strong>&quot;</p>
          <button onClick={() => { setSearch(''); setFilter('ALL'); }}
            style={{ marginTop: '10px', background: 'none', border: 'none', color: '#1e2d40', cursor: 'pointer', fontSize: '12px', fontWeight: 500, textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {filtered.map(emp => (
            <EmployeeCard key={emp.email} employee={emp} />
          ))}
        </div>
      )}
      <Modal open={!!modalMessage} title="Success" onClose={() => setModalMessage(null)}>
        {modalMessage}
      </Modal>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
