import React from 'react';
import { TechnicalRating } from '../data/marketsData';

interface TechnicalGaugeProps {
  rating: TechnicalRating;
  symbol: string;
}

const RATING_CONFIG: Record<
  TechnicalRating,
  { angle: number; color: string; sell: number; neutral: number; buy: number }
> = {
  'Strong sell': { angle: -72, color: '#F23645', sell: 18, neutral: 6, buy: 2 },
  Sell: { angle: -36, color: '#F7525F', sell: 14, neutral: 8, buy: 4 },
  Neutral: { angle: 0, color: '#787B86', sell: 7, neutral: 12, buy: 7 },
  Buy: { angle: 36, color: '#089981', sell: 4, neutral: 7, buy: 15 },
  'Strong buy': { angle: 72, color: '#089981', sell: 2, neutral: 5, buy: 19 },
};

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ rating, symbol }) => {
  const cfg = RATING_CONFIG[rating];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-32">
        <svg viewBox="0 0 220 120" className="w-full h-full overflow-visible">
          {/* 5 Arc segments representing Strong sell -> Strong buy */}
          {[
            { start: -180, end: -146, color: '#F23645' },
            { start: -143, end: -109, color: '#FF9800' },
            { start: -106, end: -74, color: '#9CA3AF' },
            { start: -71, end: -37, color: '#26A69A' },
            { start: -34, end: 0, color: '#089981' },
          ].map((seg, i) => {
            const r = 84;
            const cx = 110;
            const cy = 104;
            const rad1 = (seg.start * Math.PI) / 180;
            const rad2 = (seg.end * Math.PI) / 180;
            const x1 = cx + r * Math.cos(rad1);
            const y1 = cy + r * Math.sin(rad1);
            const x2 = cx + r * Math.cos(rad2);
            const y2 = cy + r * Math.sin(rad2);
            return (
              <path
                key={i}
                d={`M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`}
                fill="none"
                stroke={seg.color}
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.88"
              />
            );
          })}

          {/* Needle */}
          <g transform={`translate(110, 104) rotate(${cfg.angle})`}>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-66"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-[#131722] dark:text-white"
            />
            <circle
              cx="0"
              cy="0"
              r="5"
              fill="currentColor"
              className="text-[#131722] dark:text-white"
            />
          </g>
        </svg>
      </div>

      <div className="text-center -mt-1">
        <div className="text-base font-bold" style={{ color: cfg.color }}>
          {rating}
        </div>
        <div className="text-xs text-[#787B86] mt-0.5">
          Technical summary for {symbol}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-4 w-full max-w-xs text-center border-t border-[#E0E3EB] dark:border-[#2A2E39] pt-3">
        <div>
          <div className="text-xs text-[#787B86]">Sell</div>
          <div className="text-sm font-semibold font-mono text-[#F23645] tabular-nums">
            {cfg.sell}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#787B86]">Neutral</div>
          <div className="text-sm font-semibold font-mono text-[#787B86] tabular-nums">
            {cfg.neutral}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#787B86]">Buy</div>
          <div className="text-sm font-semibold font-mono text-[#089981] tabular-nums">
            {cfg.buy}
          </div>
        </div>
      </div>
    </div>
  );
};
