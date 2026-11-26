import React, { useMemo, useState } from 'react';
import { X, Star, CandlestickChart, TrendingUp, Activity } from 'lucide-react';
import {
  ChartRange,
  MarketInstrument,
  formatChange,
  formatChangePercent,
  formatInstrumentPrice,
  generateCandleSeries,
} from '../data/marketsData';
import { TickerBadge } from './TickerBadge';
import { InteractiveChart } from './InteractiveChart';
import { TechnicalGauge } from './TechnicalGauge';

interface SymbolModalProps {
  instrument: MarketInstrument | null;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatch: (symbol: string) => void;
}

const RANGES: ChartRange[] = ['1D', '1M', '3M', '1Y', '5Y', 'All'];

export const SymbolModal: React.FC<SymbolModalProps> = ({
  instrument,
  onClose,
  isWatched,
  onToggleWatch,
}) => {
  const [range, setRange] = useState<ChartRange>('3M');
  const [chartType, setChartType] = useState<'area' | 'candles'>('candles');
  const [showMA, setShowMA] = useState<boolean>(true);

  const series = useMemo(() => {
    if (!instrument) return [];
    return generateCandleSeries(instrument, range);
  }, [instrument, range]);

  if (!instrument) return null;

  const isPositive = instrument.changePercent >= 0;
  const priceRangePct = Math.min(
    100,
    Math.max(
      0,
      ((instrument.price - instrument.low52w) /
        (instrument.high52w - instrument.low52w || 1)) *
        100
    )
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="symbol-modal-title"
    >
      <div
        className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-xl bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="flex items-center gap-3.5">
            <TickerBadge
              text={instrument.badgeText}
              color={instrument.badgeColor}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="symbol-modal-title"
                  className="text-lg font-bold text-[#131722] dark:text-white"
                >
                  {instrument.name}
                </h2>
                <span className="text-xs font-mono text-[#787B86]">
                  {instrument.exchange}:{instrument.symbol}
                </span>
              </div>
              <div className="flex items-baseline gap-2.5 mt-0.5 font-mono tabular-nums">
                <span className="text-2xl font-bold text-[#131722] dark:text-white">
                  {formatInstrumentPrice(
                    instrument.price,
                    instrument.decimals,
                    instrument.currency
                  )}
                </span>
                <span className="text-xs font-sans text-[#787B86]">
                  {instrument.currency}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {formatChange(instrument.change, instrument.decimals)} (
                  {formatChangePercent(instrument.changePercent)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleWatch(instrument.symbol)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                isWatched
                  ? 'bg-[#2962FF]/10 border-[#2962FF] text-[#2962FF]'
                  : 'border-[#E0E3EB] dark:border-[#2A2E39] text-[#131722] dark:text-[#D1D4DC] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isWatched ? 'fill-current' : ''}`} />
              {isWatched ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close symbol details"
              className="p-2 rounded-lg text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chart Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-[#E0E3EB] dark:border-[#2A2E39] bg-[#F8FAFD] dark:bg-[#131722]/40">
          <div className="flex items-center gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  range === r
                    ? 'bg-[#2962FF] text-white'
                    : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-[#E0E3EB]/60 dark:hover:bg-[#2A2E39]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChartType('candles')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                chartType === 'candles'
                  ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs border border-[#E0E3EB] dark:border-[#363A45]'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              <CandlestickChart className="w-3.5 h-3.5" />
              Candles
            </button>
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs border border-[#E0E3EB] dark:border-[#363A45]'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Area
            </button>
            <button
              type="button"
              onClick={() => setShowMA((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                showMA
                  ? 'border-[#2962FF]/50 bg-[#2962FF]/10 text-[#2962FF]'
                  : 'border-transparent text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              MA(7)
            </button>
          </div>
        </div>

        {/* Main Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <InteractiveChart
              instrument={instrument}
              data={series}
              range={range}
              chartType={chartType}
              showMA={showMA}
              height={340}
            />
            <p className="mt-4 text-sm text-[#6A6D78] dark:text-[#868993] leading-relaxed">
              {instrument.description}
            </p>
          </div>

          {/* Right Rail: Technical Gauge + Key Stats */}
          <div className="lg:col-span-4 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-[#E0E3EB] dark:border-[#2A2E39] pt-5 lg:pt-0 lg:pl-6">
            <div>
              <h3 className="text-xs font-semibold text-[#787B86] mb-3">
                Technicals Summary
              </h3>
              <TechnicalGauge rating={instrument.rating} symbol={instrument.symbol} />
            </div>

            <div className="border-t border-[#E0E3EB] dark:border-[#2A2E39] pt-4">
              <h3 className="text-xs font-semibold text-[#787B86] mb-3">
                Key Market Data
              </h3>
              <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <dt className="text-[#787B86]">Volume</dt>
                  <dd className="font-mono font-semibold text-[#131722] dark:text-white mt-0.5 tabular-nums">
                    {instrument.volume}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#787B86]">Sector</dt>
                  <dd className="font-semibold text-[#131722] dark:text-white mt-0.5">
                    {instrument.sector || 'Global'}
                  </dd>
                </div>
                {instrument.marketCap && (
                  <div>
                    <dt className="text-[#787B86]">Market Cap</dt>
                    <dd className="font-mono font-semibold text-[#131722] dark:text-white mt-0.5 tabular-nums">
                      ${instrument.marketCap}
                    </dd>
                  </div>
                )}
                {instrument.peRatio && (
                  <div>
                    <dt className="text-[#787B86]">P/E Ratio</dt>
                    <dd className="font-mono font-semibold text-[#131722] dark:text-white mt-0.5 tabular-nums">
                      {instrument.peRatio}
                    </dd>
                  </div>
                )}
                {instrument.yieldOrAum && (
                  <div>
                    <dt className="text-[#787B86]">Yield / AUM</dt>
                    <dd className="font-mono font-semibold text-[#131722] dark:text-white mt-0.5 tabular-nums">
                      {instrument.yieldOrAum}
                    </dd>
                  </div>
                )}
              </dl>

              {/* 52-Week Range Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-mono tabular-nums text-[#787B86] mb-1.5">
                  <span>52W Low: {instrument.low52w.toFixed(instrument.decimals)}</span>
                  <span>52W High: {instrument.high52w.toFixed(instrument.decimals)}</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-[#E0E3EB] dark:bg-[#2A2E39]">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#2962FF] border-2 border-white dark:border-[#1E222D]"
                    style={{ left: `calc(${priceRangePct}% - 5px)` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
