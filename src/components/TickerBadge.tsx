import React from 'react';

interface TickerBadgeProps {
  text: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TickerBadge: React.FC<TickerBadgeProps> = ({
  text,
  color,
  size = 'md',
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-6 h-6 text-[10px]'
      : size === 'lg'
        ? 'w-11 h-11 text-sm'
        : 'w-8 h-8 text-[11px]';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold text-white shrink-0 select-none ${sizeClasses}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
};
