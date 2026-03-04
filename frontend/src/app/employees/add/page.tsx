'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { employeeApi } from '@/lib/api';
import { CreateEmployeeRequest } from '@/types/employee';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, User, Mail, Hash, DollarSign, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';
import Modal from '@/components/Modal';

const initial: CreateEmployeeRequest = {
  firstName: '', lastName: '', email: '', employmentNumber: '',
  salary: 0, position: 'JUNIOR_DEVELOPER', employmentDate: '',
};

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon: any;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
}

const Field = ({ label, name, type = 'text', placeholder, icon: Icon, value, onChange, error }: FieldProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <Icon size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: error ? 'var(--danger)' : '#c0c0c0', pointerEvents: 'none' }} />
      <input className={`input${error ? ' error' : ''}`}
        style={{ paddingLeft: '34px' }}
        type={type} name={name}
        value={String(value)}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
    {error && <span style={{ fontSize: '11px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '3px' }}>↑ {error}</span>}
  </div>
);

export default function AddEmployeePage() {
  const router = useRouter();
  const [form, setForm]       = useState<CreateEmployeeRequest>(initial);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'salary' ? parseFloat(value) || 0 : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim())  e.firstName = 'Required';
    if (!form.lastName.trim())   e.lastName  = 'Required';
    if (!form.email.trim())      e.email     = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.employmentNumber.trim()) e.employmentNumber = 'Required';
    if (!form.salary || form.salary <= 0) e.salary = 'Must be greater than 0';
    if (!form.employmentDate)    e.employmentDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await employeeApi.create(form);
      setModalMessage('Employee added successfully');
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.validationErrors) setErrors(data.validationErrors);
      else toast.error(data?.message || 'Failed to add employee');
    } finally { setLoading(false); }
  };

  const filled = [form.firstName, form.lastName, form.email, form.employmentNumber,
    form.salary > 0 ? '1' : '', form.employmentDate].filter(Boolean).length;
  const pct = Math.round((filled / 6) * 100);

  return (
    <div style={{ padding: '44px', maxWidth: '660px' }} className="animate-fade-in">

      
      <Link href="/employees" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#b0b0b0', fontSize: '12px', marginBottom: '22px', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#737373'}
        onMouseLeave={e => e.currentTarget.style.color = '#b0b0b0'}>
        <ArrowLeft size={12} /> Employees
      </Link>

      <h1 style={{ fontWeight: 800, fontSize: '26px', letterSpacing: '-0.025em', color: '#0a0a0a', marginBottom: '4px' }}>
        New Employee
      </h1>
      <p style={{ color: '#737373', fontSize: '13px', marginBottom: '28px' }}>
        Fill in the details below to add a new team member.
      </p>

      
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
          <span style={{ fontSize: '11px', color: '#b0b0b0' }}>Form completion</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: pct === 100 ? '#16a34a' : '#1e2d40', fontFamily: 'var(--font-mono)' }}>{pct}%</span>
        </div>
        <div style={{ height: '3px', background: '#ebebeb', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: pct === 100 ? '#16a34a' : '#1e2d40',
            borderRadius: '99px', transition: 'width 0.3s ease, background 0.3s',
          }} />
        </div>
      </div>

      
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

        
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
            <User size={12} color="#b0b0b0" />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Personal Information</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <Field label="First Name" name="firstName" placeholder="Jane" icon={User}
              value={form.firstName} onChange={handleChange} error={errors.firstName} />
            <Field label="Last Name" name="lastName" placeholder="Smith" icon={User}
              value={form.lastName} onChange={handleChange} error={errors.lastName} />
          </div>
          <Field label="Email Address" name="email" type="email" placeholder="jane@company.com" icon={Mail}
            value={form.email} onChange={handleChange} error={errors.email} />
        </div>

        <div style={{ height: '1px', background: '#f0f0f0' }} />

        
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
            <Briefcase size={12} color="#b0b0b0" />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Employment Details</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <Field label="Employee No." name="employmentNumber" placeholder="EMP-001" icon={Hash}
              value={form.employmentNumber} onChange={handleChange} error={errors.employmentNumber} />
            <Field label="Salary (KES)" name="salary" type="number" placeholder="75000" icon={DollarSign}
              value={form.salary} onChange={handleChange} error={errors.salary} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Position</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#c0c0c0', pointerEvents: 'none' }} />
                <select className="input" style={{ paddingLeft: '34px' }} name="position" value={form.position} onChange={handleChange}>
                  <option value="JUNIOR_DEVELOPER">Junior Developer</option>
                  <option value="SENIOR_DEVELOPER">Senior Developer</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Start Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: errors.employmentDate ? 'var(--danger)' : '#c0c0c0', pointerEvents: 'none' }} />
                <input className={`input${errors.employmentDate ? ' error' : ''}`}
                  style={{ paddingLeft: '34px' }} type="date"
                  name="employmentDate" value={form.employmentDate} onChange={handleChange} />
              </div>
              {errors.employmentDate && <span style={{ fontSize: '11px', color: 'var(--danger)' }}>↑ {errors.employmentDate}</span>}
            </div>
          </div>
        </div>

        
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: '148px', justifyContent: 'center', padding: '10px 20px' }}>
            {loading
              ? <><span style={{ width:13,height:13,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin 0.65s linear infinite' }} /> Saving…</>
              : <><Save size={13} /> Save Employee</>}
          </button>
          <Link href="/employees" style={{ textDecoration: 'none' }}>
            <button className="btn-ghost">Cancel</button>
          </Link>
          {pct === 100 && (
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              ✓ Ready to save
            </span>
          )}
        </div>
      </div>
      <Modal open={!!modalMessage} title="Success" onClose={() => { setModalMessage(null); router.push('/employees'); }}>
        {modalMessage}
      </Modal>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
