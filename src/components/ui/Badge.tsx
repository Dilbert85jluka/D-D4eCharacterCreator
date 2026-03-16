import type { ReactNode } from 'react';

type BadgeColor = 'red' | 'blue' | 'green' | 'purple' | 'amber' | 'stone' | 'teal';

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  size?: 'sm' | 'md';
}

const colorClasses: Record<BadgeColor, string> = {
  red:    'bg-red-100 text-red-800 border-red-200',
  blue:   'bg-blue-100 text-blue-800 border-blue-200',
  green:  'bg-emerald-100 text-emerald-800 border-emerald-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  amber:  'bg-amber-100 text-amber-800 border-amber-200',
  stone:  'bg-stone-100 text-stone-700 border-stone-200',
  teal:   'bg-teal-100 text-teal-800 border-teal-200',
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
};

export function Badge({ children, color = 'stone', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const roleColors: Record<string, BadgeColor> = {
    Controller: 'purple',
    Defender: 'blue',
    Leader: 'green',
    Striker: 'red',
  };
  return <Badge color={roleColors[role] ?? 'stone'}>{role}</Badge>;
}
