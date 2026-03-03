'use client';
import { useEffect, useState } from 'react';
import { employeeApi } from '@/lib/api';
import { Employee } from '@/types/employee';
import Link from 'next/link';
import { Users, UserPlus, Search, ArrowRight, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeApi.getAll().then(setEmployees).catch(console.error).finally(() => setLoading(false));
  }, []);

  const juniors     = employees.filter(e => e.position === 'JUNIOR_DEVELOPER').length;
  const seniors     = employees.filter(e => e.position === 'SENIOR_DEVELOPER').length;
  const totalSalary = employees.reduce((s, e) => s + Number(e.salary), 0);

  const stats = [
    { label: 'Total Employees',   value: loading ? '—' : String(employees.length), sub: 'all positions' },
    { label: 'Junior Developers', value: loading ? '—' : String(juniors),           sub: employees.length ? `${Math.round(juniors/employees.length*100)}% of team` : '0% of team' },
    { label: 'Senior Developers', value: loading ? '—' : String(seniors),           sub: employees.length ? `${Math.round(seniors/employees.length*100)}% of team` : '0% of team' },
    { label: 'Monthly Payroll',   value: loading ? '—' : `KES ${totalSalary.toLocaleString()}`, sub: 'total compensation' },
  ];

  return (
    <div style={{ padding: '48px 44px', maxWidth: '1060px' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0faf4', border: '1px solid #bbf7d0', borderRadius: '99px', padding: '4px 12px', marginBottom: '18px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, letterSpacing: '0.03em' }}>All systems operational</span>
        </div>
        <h1 style={{ fontWeight: 800, fontSize: '38px', letterSpacing: '-0.035em', color: '#0a0a0a', lineHeight: 1.1, marginBottom: '10px' }}>
          Good morning.
        </h1>
        <p style={{ color: '#737373', fontSize: '15px' }}>Here's your team overview for today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '44px' }}>
        {stats.map(({ label, value, sub }) => (
          <div key={label} style={{
            background: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px',
            padding: '22px 20px', transition: 'border-color 0.18s, box-shadow 0.18s', cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c8c8c8'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontWeight: 800, fontSize: '30px', letterSpacing: '-0.03em', color: '#1e2d40', lineHeight: 1, marginBottom: '8px' }}>
              {value}
            </div>
            <div style={{ fontWeight: 500, fontSize: '13px', color: '#404040', marginBottom: '3px' }}>{label}</div>
            <div style={{ fontSize: '11px', color: '#b0b0b0' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#b0b0b0', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '14px' }}>
          Quick Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
          {[
            { href: '/employees',        icon: Users,    label: 'View All Employees', desc: 'Browse and manage the team'  },
            { href: '/employees/add',    icon: UserPlus, label: 'Add Employee',        desc: 'Onboard a new team member'  },
            { href: '/employees/search', icon: Search,   label: 'Search by Email',     desc: 'Look up someone quickly'    },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', border: '1px solid #e8e8e8', borderRadius: '12px',
                padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1e2d40'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,45,64,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eef1f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="#1e2d40" strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#0a0a0a', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: '#b0b0b0' }}>{desc}</div>
                  </div>
                </div>
                <ArrowRight size={14} color="#c8c8c8" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
