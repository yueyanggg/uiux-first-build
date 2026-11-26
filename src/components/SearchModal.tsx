import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import {
  ALL_INSTRUMENTS,
  AssetCategory,
  formatChangePercent,
  formatInstrumentPrice,
} from '../data/marketsData';
import { TickerBadge } from './TickerBadge';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

const FILTER_CATS: { id: 'all' | AssetCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures' },
  { id: 'forex', label: 'Forex' },
  { id: 'bonds', label: 'Bonds' },
  { id: 'etfs', label: 'ETFs' },
];

export const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onClose,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<'all' | AssetCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      setQuery('');
      setCat('all');
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_INSTRUMENTS.filter((item) => {
      if (cat !== 'all' && item.category !== cat) return false;
      if (!q) return true;
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.exchange.toLowerCase().includes(q) ||
        (item.sector && item.sector.toLowerCase().includes(q))
      );
    });
  }, [query, cat]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 bg-black/50 backdrop-blur-[2px] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Symbol search"
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <Search className="w-4 h-4 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker, company, index, crypto, or currency..."
            className="w-full bg-transparent text-sm text-[#131722] dark:text-white placeholder:text-[#787B86] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-md text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Asset Class Filter Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-[#E0E3EB] dark:border-[#2A2E39] overflow-x-auto no-scrollbar">
          {FILTER_CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                cat === c.id
                  ? 'bg-[#2962FF] text-white'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
          {results.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#787B86]">
              No matching symbols found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <button
                  key={item.symbol}
                  type="button"
                  onClick={() => {
                    onSelectSymbol(item.symbol);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <TickerBadge
                      text={item.badgeText}
                      color={item.badgeColor}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#131722] dark:text-white">
                          {item.symbol}
                        </span>
                        <span className="text-xs text-[#787B86]">
                          {item.exchange} · {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] truncate">
                        {item.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums shrink-0">
                    <div className="text-sm font-semibold text-[#131722] dark:text-white">
                      {formatInstrumentPrice(
                        item.price,
                        item.decimals,
                        item.currency
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        isPos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {formatChangePercent(item.changePercent)}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
