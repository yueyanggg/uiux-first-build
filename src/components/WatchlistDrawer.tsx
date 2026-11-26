import React from 'react';
import { X, Trash2, ArrowUpRight } from 'lucide-react';
import {
  MarketInstrument,
  formatChangePercent,
  formatInstrumentPrice,
} from '../data/marketsData';
import { TickerBadge } from './TickerBadge';
import { Sparkline } from './Sparkline';

interface WatchlistDrawerProps {
  open: boolean;
  onClose: () => void;
  instruments: MarketInstrument[];
  onSelectSymbol: (symbol: string) => void;
  onRemoveSymbol: (symbol: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  open,
  onClose,
  instruments,
  onSelectSymbol,
  onRemoveSymbol,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Watchlist drawer"
    >
      <aside
        className="w-full max-w-md h-full bg-white dark:bg-[#1E222D] border-l border-[#E0E3EB] dark:border-[#2A2E39] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div>
            <h2 className="text-base font-bold text-[#131722] dark:text-white">
              Watchlist
            </h2>
            <p className="text-xs text-[#787B86] mt-0.5">
              {instruments.length} tracked symbols
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close watchlist"
            className="p-2 rounded-lg text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
          {instruments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-[#131722] dark:text-white">
                Your watchlist is empty
              </p>
              <p className="text-xs text-[#787B86] mt-1">
                Click any market symbol to inspect its chart and pin it here.
              </p>
            </div>
          ) : (
            instruments.map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSymbol(item.symbol);
                      onClose();
                    }}
                    className="flex items-center gap-3 text-left min-w-0 flex-1 cursor-pointer"
                  >
                    <TickerBadge
                      text={item.badgeText}
                      color={item.badgeColor}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[#131722] dark:text-white">
                          {item.symbol}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-[#787B86]" />
                      </div>
                      <div className="text-xs text-[#787B86] truncate">
                        {item.name}
                      </div>
                    </div>
                  </button>

                  <div className="hidden sm:block">
                    <Sparkline
                      data={item.sparkline}
                      isPositive={isPos}
                      width={64}
                      height={22}
                    />
                  </div>

                  <div className="text-right font-mono tabular-nums">
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

                  <button
                    type="button"
                    onClick={() => onRemoveSymbol(item.symbol)}
                    aria-label={`Remove ${item.symbol} from watchlist`}
                    className="p-1.5 rounded text-[#787B86] hover:text-[#F23645] hover:bg-[#F23645]/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
};
