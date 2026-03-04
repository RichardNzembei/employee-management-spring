'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserPlus, Search, LayoutDashboard } from 'lucide-react';

const nav = [
  { href: '/',                 label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/employees',        label: 'All Employees', icon: Users           },
  { href: '/employees/add',    label: 'Add Employee',  icon: UserPlus        },
  { href: '/employees/search', label: 'Search',        icon: Search          },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, width: '220px', height: '100vh',
      background: '#fff',
      borderRight: '1px solid #e8e8e8',
      display: 'flex', flexDirection: 'column', zIndex: 50,
    }}>
      
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #ebebeb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#1e2d40',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Users size={16} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em', color: '#0a0a0a' }}>EMS</div>
          </div>
        </div>
      </div>

      
      <nav style={{ padding: '14px 12px', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#c0c0c0', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>
          Menu
        </div>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '8px 10px', borderRadius: '8px', marginBottom: '2px',
              textDecoration: 'none',
              background: active ? '#eef1f5' : 'transparent',
              color: active ? '#1e2d40' : '#737373',
              fontWeight: active ? 600 : 400,
              fontSize: '13.5px',
              transition: 'all 0.12s',
              borderLeft: active ? '2px solid #1e2d40' : '2px solid transparent',
              paddingLeft: active ? '9px' : '9px',
            }}>
              <Icon size={15} strokeWidth={active ? 2.5 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      
      <div style={{ padding: '16px 20px', borderTop: '1px solid #ebebeb' }}>
        <div style={{ fontSize: '10px', color: '#c0c0c0', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
         version 1
        </div>
      </div>
    </aside>
  );
}
