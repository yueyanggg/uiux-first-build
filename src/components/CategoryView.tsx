import React, { useMemo, useState } from 'react';
import { ArrowUpDown, ArrowLeft, Star } from 'lucide-react';
import {
  ChartRange,
  ECONOMIC_EVENTS,
  MarketInstrument,
  MarketsNavTab,
  formatChange,
  formatChangePercent,
  formatInstrumentPrice,
  generateCandleSeries,
} from '../data/marketsData';
import { TickerBadge } from './TickerBadge';
import { Sparkline } from './Sparkline';
import { InteractiveChart } from './InteractiveChart';

interface CategoryViewProps {
  tab: Exclude<MarketsNavTab, 'overview'>;
  instruments: MarketInstrument[];
  watchlist: string[];
  onToggleWatch: (symbol: string) => void;
  onSelectSymbol: (symbol: string) => void;
  onBackOverview: () => void;
}

const TAB_DESCRIPTIONS: Record<Exclude<MarketsNavTab, 'overview'>, { title: string; subtitle: string }> = {
  indices: {
    title: 'World Equity Indices',
    subtitle: 'Major US, European, and Asia-Pacific benchmark stock market indices.',
  },
  stocks: {
    title: 'US & Global Stocks Screener',
    subtitle: 'Track leading large-cap equities, valuation multiples, and technical ratings.',
  },
  crypto: {
    title: 'Cryptocurrency Markets',
    subtitle: 'Real-time digital asset pricing, 24h volume, and Layer-1 market capitalization.',
  },
  futures: {
    title: 'Commodities & Futures',
    subtitle: 'Precious metals, energy contracts, and industrial commodities.',
  },
  forex: {
    title: 'Forex & Currencies',
    subtitle: 'Major G10 currency pairs and global dollar index benchmarks.',
  },
  bonds: {
    title: 'Government Bond Yields',
    subtitle: 'Sovereign 2-year and 10-year benchmark fixed-income yields.',
  },
  etfs: {
    title: 'Exchange-Traded Funds',
    subtitle: 'High-liquidity index, fixed income, commodity, and digital asset ETFs.',
  },
  economy: {
    title: 'Global Economic Calendar',
    subtitle: 'Upcoming central bank releases, inflation prints, and GDP estimates.',
  },
};

type SortKey = 'symbol' | 'price' | 'changePercent';

export const CategoryView: React.FC<CategoryViewProps> = ({
  tab,
  instruments,
  watchlist,
  onToggleWatch,
  onSelectSymbol,
  onBackOverview,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [impactFilter, setImpactFilter] = useState<'all' | 3>('all');
  const [range, setRange] = useState<ChartRange>('3M');

  const meta = TAB_DESCRIPTIONS[tab];

  const categoryItems = useMemo(() => {
    if (tab === 'economy') return [];
    const q = filterText.trim().toLowerCase();
    return instruments
      .filter((i) => i.category === tab)
      .filter((i) =>
        q
          ? i.symbol.toLowerCase().includes(q) ||
            i.name.toLowerCase().includes(q) ||
            (i.sector && i.sector.toLowerCase().includes(q))
          : true
      )
      .sort((a, b) => {
        const dir = sortAsc ? 1 : -1;
        if (sortKey === 'symbol') return a.symbol.localeCompare(b.symbol) * dir;
        if (sortKey === 'price') return (a.price - b.price) * dir;
        return (a.changePercent - b.changePercent) * dir;
      });
  }, [instruments, tab, filterText, sortKey, sortAsc]);

  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const featured = useMemo(() => {
    if (categoryItems.length === 0) return null;
    return (
      categoryItems.find((i) => i.symbol === selectedSymbol) || categoryItems[0]
    );
  }, [categoryItems, selectedSymbol]);

  const featuredSeries = useMemo(() => {
    if (!featured) return [];
    return generateCandleSeries(featured, range);
  }, [featured, range]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((p) => !p);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackOverview}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2962FF] hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Markets Overview
          </button>
          <h2 className="text-2xl font-bold text-[#131722] dark:text-white tracking-tight">
            {meta.title}
          </h2>
          <p className="text-sm text-[#787B86] mt-0.5">{meta.subtitle}</p>
        </div>

        {tab !== 'economy' ? (
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={`Filter ${tab}...`}
            className="w-full sm:w-64 px-3.5 py-2 text-sm rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] text-[#131722] dark:text-white placeholder:text-[#787B86] focus:outline-none focus:border-[#2962FF]"
          />
        ) : (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F0F3FA] dark:bg-[#1E222D]">
            <button
              type="button"
              onClick={() => setImpactFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                impactFilter === 'all'
                  ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                  : 'text-[#787B86]'
              }`}
            >
              All Releases
            </button>
            <button
              type="button"
              onClick={() => setImpactFilter(3)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                impactFilter === 3
                  ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                  : 'text-[#787B86]'
              }`}
            >
              High Impact Only
            </button>
          </div>
        )}
      </div>

      {tab === 'economy' ? (
        <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] overflow-hidden bg-white dark:bg-[#1E222D]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E0E3EB] dark:border-[#2A2E39] text-xs font-medium text-[#787B86] bg-[#F8FAFD] dark:bg-[#131722]/40">
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Country / Currency</th>
                  <th className="py-3 px-4">Release</th>
                  <th className="py-3 px-4">Impact</th>
                  <th className="py-3 px-4 text-right">Actual</th>
                  <th className="py-3 px-4 text-right">Forecast</th>
                  <th className="py-3 px-4 text-right">Prior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39] text-sm">
                {ECONOMIC_EVENTS.filter((ev) =>
                  impactFilter === 3 ? ev.impact === 3 : true
                ).map((ev) => (
                  <tr
                    key={ev.id}
                    className="hover:bg-[#F0F3FA]/60 dark:hover:bg-[#2A2E39]/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-[#787B86] whitespace-nowrap tabular-nums">
                      {ev.date} · {ev.time} EST
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[#131722] dark:text-white whitespace-nowrap">
                      {ev.currency} · {ev.country}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#131722] dark:text-white">
                      {ev.event}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-end gap-0.5 h-3.5" aria-label={`Impact ${ev.impact} of 3`}>
                        {[1, 2, 3].map((lvl) => (
                          <span
                            key={lvl}
                            className={`w-1 rounded-xs ${
                              lvl === 1 ? 'h-1.5' : lvl === 2 ? 'h-2.5' : 'h-3.5'
                            } ${
                              lvl <= ev.impact
                                ? ev.impact === 3
                                  ? 'bg-[#F23645]'
                                  : 'bg-[#FF9800]'
                                : 'bg-[#E0E3EB] dark:bg-[#2A2E39]'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#131722] dark:text-white tabular-nums">
                      {ev.actual}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#787B86] tabular-nums">
                      {ev.forecast}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#787B86] tabular-nums">
                      {ev.prior}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Interactive Chart for the Selected Asset */}
          {featured && (
            <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] p-5 bg-white dark:bg-[#1E222D]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <TickerBadge
                    text={featured.badgeText}
                    color={featured.badgeColor}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#131722] dark:text-white">
                        {featured.name}
                      </span>
                      <span className="text-xs font-mono text-[#787B86]">
                        {featured.symbol}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono tabular-nums text-sm">
                      <span className="font-bold text-[#131722] dark:text-white">
                        {formatInstrumentPrice(
                          featured.price,
                          featured.decimals,
                          featured.currency
                        )}
                      </span>
                      <span
                        className={
                          featured.changePercent >= 0
                            ? 'text-[#089981]'
                            : 'text-[#F23645]'
                        }
                      >
                        {formatChangePercent(featured.changePercent)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {(['1D', '1M', '3M', '1Y', '5Y', 'All'] as ChartRange[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        range === r
                          ? 'bg-[#2962FF] text-white'
                          : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <InteractiveChart
                instrument={featured}
                data={featuredSeries}
                range={range}
                chartType="area"
                height={260}
              />
            </div>
          )}

          {/* Screener Data Table */}
          <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] overflow-hidden bg-white dark:bg-[#1E222D]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E0E3EB] dark:border-[#2A2E39] text-xs font-medium text-[#787B86] bg-[#F8FAFD] dark:bg-[#131722]/40">
                    <th className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleSort('symbol')}
                        className="inline-flex items-center gap-1 hover:text-[#131722] dark:hover:text-white cursor-pointer"
                      >
                        Symbol
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSort('price')}
                        className="inline-flex items-center gap-1 hover:text-[#131722] dark:hover:text-white cursor-pointer"
                      >
                        Last
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-right">Change</th>
                    <th className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSort('changePercent')}
                        className="inline-flex items-center gap-1 hover:text-[#131722] dark:hover:text-white cursor-pointer"
                      >
                        Chg %
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-right hidden md:table-cell">
                      Volume
                    </th>
                    <th className="py-3 px-4 hidden lg:table-cell">Sector</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Trend</th>
                    <th className="py-3 px-4 text-right">Rating</th>
                    <th className="py-3 px-4 text-right">Watch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39] text-sm">
                  {categoryItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-[#787B86]">
                        No symbols match your filter.
                      </td>
                    </tr>
                  ) : (
                    categoryItems.map((item) => {
                      const isPos = item.changePercent >= 0;
                      const isWatched = watchlist.includes(item.symbol);
                      return (
                        <tr
                          key={item.symbol}
                          className="hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSymbol(item.symbol);
                                onSelectSymbol(item.symbol);
                              }}
                              className="flex items-center gap-3 text-left cursor-pointer group"
                            >
                              <TickerBadge
                                text={item.badgeText}
                                color={item.badgeColor}
                                size="sm"
                              />
                              <div>
                                <div className="font-semibold text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                                  {item.symbol}
                                </div>
                                <div className="text-xs text-[#787B86] truncate max-w-[180px]">
                                  {item.name}
                                </div>
                              </div>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-[#131722] dark:text-white tabular-nums">
                            {formatInstrumentPrice(
                              item.price,
                              item.decimals,
                              item.currency
                            )}
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-mono tabular-nums ${
                              isPos ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {formatChange(item.change, item.decimals)}
                          </td>
                          <td
                            className={`py-3 px-4 text-right font-mono font-semibold tabular-nums ${
                              isPos ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {formatChangePercent(item.changePercent)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-xs text-[#787B86] tabular-nums hidden md:table-cell">
                            {item.volume}
                          </td>
                          <td className="py-3 px-4 text-xs text-[#787B86] hidden lg:table-cell">
                            {item.sector || '—'}
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <Sparkline
                              data={item.sparkline}
                              isPositive={isPos}
                              width={72}
                              height={22}
                            />
                          </td>
                          <td
                            className={`py-3 px-4 text-right text-xs font-semibold whitespace-nowrap ${
                              item.rating.includes('buy') || item.rating === 'Buy'
                                ? 'text-[#089981]'
                                : item.rating.includes('sell') || item.rating === 'Sell'
                                  ? 'text-[#F23645]'
                                  : 'text-[#787B86]'
                            }`}
                          >
                            {item.rating}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onToggleWatch(item.symbol)}
                              aria-label={
                                isWatched
                                  ? `Remove ${item.symbol} from watchlist`
                                  : `Add ${item.symbol} to watchlist`
                              }
                              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                isWatched
                                  ? 'text-[#2962FF] bg-[#2962FF]/10'
                                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
                              }`}
                            >
                              <Star
                                className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`}
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
