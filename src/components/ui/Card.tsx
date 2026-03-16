import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  selected?: boolean;
  interactive?: boolean;
}

export function Card({ children, selected, interactive, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-xl border bg-white shadow-sm overflow-hidden',
        interactive ? 'cursor-pointer transition-all duration-150' : '',
        selected
          ? 'border-amber-600 ring-2 ring-amber-400 shadow-md'
          : interactive
            ? 'border-stone-200 hover:border-amber-400 hover:shadow-md'
            : 'border-stone-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-4 py-3 border-b border-stone-100 bg-stone-50 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}
