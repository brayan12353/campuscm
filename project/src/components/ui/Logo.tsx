import { Link } from 'react-router-dom';
import { cn } from '@/utils/format';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  className?: string;
}

export function Logo({ size = 'md', to = '/', className }: LogoProps) {
  const sizes = {
    sm: { box: 'w-7 h-7', text: 'text-base', icon: 16 },
    md: { box: 'w-9 h-9', text: 'text-lg', icon: 20 },
    lg: { box: 'w-12 h-12', text: 'text-2xl', icon: 28 },
  };
  const s = sizes[size];
  return (
    <Link to={to} className={cn('flex items-center gap-2 font-bold', className)}>
      <div className={cn('rounded-xl bg-primary-600 flex items-center justify-center', s.box)}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none">
          <path d="M7 9v6c0 2.2 1.8 4 4 4s4-1.8 4-4V9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="7" cy="7" r="1.5" fill="white"/>
          <circle cx="12" cy="7" r="1.5" fill="white"/>
          <circle cx="17" cy="7" r="1.5" fill="white"/>
        </svg>
      </div>
      <span className={cn('text-gray-900', s.text)}>Campus<span className="text-primary-600">CM</span></span>
    </Link>
  );
}
