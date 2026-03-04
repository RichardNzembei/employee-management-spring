'use client';
import { useState } from 'react';
import { Employee, POSITION_LABELS } from '@/types/employee';
import { employeeApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Pencil, X, Check, Calendar, DollarSign, Hash } from 'lucide-react';
import Modal from './Modal';
import { format } from 'date-fns';

interface Props {
  employee: Employee;
  onDeleted: (email: string) => void;
  onUpdated: (updated: Employee) => void;
}

export default function EmployeeCard({ employee, onDeleted, onUpdated }: Props) {
  const [editing,   setEditing]   = useState(false);
  const [firstName, setFirstName] = useState(employee.firstName);
  const [lastName,  setLastName]  = useState(employee.lastName);
  const [loading,   setLoading]   = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) { toast.error('Name cannot be empty'); return; }
    setLoading(true);
    try {
      const updated = await employeeApi.updateName(employee.email, { firstName, lastName });
      onUpdated(updated);
      setEditing(false);
      setModalMessage('Name updated');
    } catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setConfirmingDelete(false);
    setDeleting(true);
    try {
      await employeeApi.delete(employee.email);
      setModalMessage('Employee removed');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const isSenior = employee.position === 'SENIOR_DEVELOPER';
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-mid)', borderRadius: '12px',
      padding: '20px', transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <div style={{
            width: '38px', height: '38px', borderRadius: '9px',
            background: isSenior ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isSenior ? 'rgba(34,197,94,0.15)' : 'var(--border-mid)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px',
            color: isSenior ? '#22c55e' : '#888',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            {editing ? (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '2px' }}>
                <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)}
                  style={{ width: '100px', padding: '4px 8px', fontSize: '13px' }} placeholder="First" />
                <input className="input" value={lastName} onChange={e => setLastName(e.target.value)}
                  style={{ width: '100px', padding: '4px 8px', fontSize: '13px' }} placeholder="Last" />
              </div>
            ) : (
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff', marginBottom: '2px', letterSpacing: '-0.01em' }}>
                {employee.firstName} {employee.lastName}
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{employee.email}</div>
          </div>
        </div>
        <span className={isSenior ? 'badge-senior' : 'badge-junior'}>
          {isSenior ? 'Senior' : 'Junior'}
        </span>
      </div>

      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {[
          { icon: Hash,        text: employee.employmentNumber, mono: true },
          { icon: DollarSign,  text: `${Number(employee.salary).toLocaleString()}` },
          { icon: Calendar,    text: format(new Date(employee.employmentDate), 'MMM d, yyyy') },
        ].map(({ icon: Icon, text, mono }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Icon size={11} color="var(--text-muted)" />
            <span style={mono ? { fontFamily: 'var(--font-mono)', fontSize: '11px' } : {}}>{text}</span>
          </div>
        ))}
      </div>

      
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
        {editing ? (
          <>
            <button className="btn-ghost" onClick={() => { setEditing(false); setFirstName(employee.firstName); setLastName(employee.lastName); }}
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <X size={12} /> Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={loading}
              style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              {loading ? '…' : <><Check size={12} /> Save</>}
            </button>
          </>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => setEditing(true)}
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <Pencil size={12} /> Edit
            </button>
            <button className="btn-danger" onClick={() => setConfirmingDelete(true)} disabled={deleting}
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <Trash2 size={12} /> {deleting ? '…' : 'Delete'}
            </button>
          </>
        )}
      <Modal open={!!modalMessage} title="Success" onClose={() => {
        if (modalMessage === 'Employee removed') onDeleted(employee.email);
        setModalMessage(null);
      }}>
        {modalMessage}
      </Modal>

      <Modal open={confirmingDelete} title="Confirm delete" onClose={() => setConfirmingDelete(false)}
        onConfirm={handleDelete} confirmText="Delete" cancelText="Cancel">
        Remove {employee.firstName} {employee.lastName}?
      </Modal>
      </div>
    </div>
  );
}
