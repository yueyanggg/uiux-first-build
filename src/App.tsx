import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  Search,
  Star,
  Sun,
  Moon,
  CandlestickChart,
  TrendingUp,
  Maximize2,
  Heart,
  MessageSquare,
  Play,
  Pause,
} from 'lucide-react';
import {
  ALL_INSTRUMENTS,
  AssetCategory,
  ChartRange,
  ECONOMIC_EVENTS,
  MARKET_NEWS,
  MarketInstrument,
  MarketsNavTab,
  SUMMARY_GROUPS,
  TRADE_IDEAS,
  formatChange,
  formatChangePercent,
  formatInstrumentPrice,
  generateCandleSeries,
} from './data/marketsData';
import { TickerBadge } from './components/TickerBadge';
import { Sparkline } from './components/Sparkline';
import { InteractiveChart } from './components/InteractiveChart';
import { SectorHeatmap } from './components/SectorHeatmap';
import { SymbolModal } from './components/SymbolModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CategoryView } from './components/CategoryView';

const SUB_NAV_TABS: { id: MarketsNavTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures' },
  { id: 'forex', label: 'Forex' },
  { id: 'bonds', label: 'Bonds' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'economy', label: 'Economy' },
];

const SUMMARY_TABS: { id: AssetCategory; label: string }[] = [
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures' },
  { id: 'forex', label: 'Forex' },
  { id: 'bonds', label: 'Bonds' },
  { id: 'etfs', label: 'ETFs' },
];

type StockMoverTab = 'largest' | 'gainers' | 'losers' | 'active';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [instruments, setInstruments] = useState<MarketInstrument[]>(ALL_INSTRUMENTS);
  const [liveTicks, setLiveTicks] = useState(true);

  const [activeNavTab, setActiveNavTab] = useState<MarketsNavTab>('overview');
  const [summaryCategory, setSummaryCategory] = useState<AssetCategory>('indices');
  const [selectedSummarySymbol, setSelectedSummarySymbol] = useState<string>('SPX');
  const [summaryRange, setSummaryRange] = useState<ChartRange>('1D');
  const [summaryChartType, setSummaryChartType] = useState<'area' | 'candles'>('area');

  const [stockMoverTab, setStockMoverTab] = useState<StockMoverTab>('largest');
  const [modalSymbol, setModalSymbol] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(['SPX', 'NVDA', 'AAPL', 'BTCUSD', 'EURUSD', 'US10Y']);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [likedIdeas, setLikedIdeas] = useState<Record<string, boolean>>({});

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setModalSymbol(null);
        setWatchlistOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Gentle realistic simulated live quote ticks when enabled
  useEffect(() => {
    if (!liveTicks) return;
    const timer = window.setInterval(() => {
      setInstruments((prev) =>
        prev.map((item, idx) => {
          // Update a rotating subset each tick for natural market rhythm
          if ((Math.floor(Date.now() / 1000) + idx) % 3 !== 0) return item;
          const jitter = (Math.random() - 0.495) * 0.0014;
          const delta = item.price * jitter;
          const nextPrice = Number(
            Math.max(0.0001, item.price + delta).toFixed(item.decimals)
          );
          const nextChange = Number((item.change + delta).toFixed(item.decimals));
          const basePrice = nextPrice - nextChange;
          const nextPct =
            basePrice > 0
              ? Number(((nextChange / basePrice) * 100).toFixed(2))
              : item.changePercent;
          return {
            ...item,
            price: nextPrice,
            change: nextChange,
            changePercent: nextPct,
          };
        })
      );
    }, 2600);
    return () => window.clearInterval(timer);
  }, [liveTicks]);

  const bySymbol = useMemo(() => {
    const map = new Map<string, MarketInstrument>();
    for (const item of instruments) map.set(item.symbol, item);
    return map;
  }, [instruments]);

  const summaryCards = useMemo(() => {
    const symbols = SUMMARY_GROUPS[summaryCategory];
    return symbols
      .map((sym) => bySymbol.get(sym))
      .filter((x): x is MarketInstrument => Boolean(x));
  }, [summaryCategory, bySymbol]);

  const activeSummaryInstrument = useMemo(() => {
    const found = bySymbol.get(selectedSummarySymbol);
    if (found && SUMMARY_GROUPS[summaryCategory].includes(found.symbol)) {
      return found;
    }
    return summaryCards[0] || instruments[0];
  }, [bySymbol, selectedSummarySymbol, summaryCategory, summaryCards, instruments]);

  const summarySeries = useMemo(() => {
    return generateCandleSeries(activeSummaryInstrument, summaryRange);
  }, [activeSummaryInstrument, summaryRange]);

  const stockMovers = useMemo(() => {
    const stocks = instruments.filter((i) => i.category === 'stocks');
    if (stockMoverTab === 'gainers') {
      return [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 6);
    }
    if (stockMoverTab === 'losers') {
      return [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 6);
    }
    if (stockMoverTab === 'active') {
      return [...stocks].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)).slice(0, 6);
    }
    return stocks.slice(0, 6);
  }, [instruments, stockMoverTab]);

  const cryptoList = useMemo(
    () => instruments.filter((i) => i.category === 'crypto'),
    [instruments]
  );
  const forexList = useMemo(
    () => instruments.filter((i) => i.category === 'forex'),
    [instruments]
  );
  const futuresList = useMemo(
    () => instruments.filter((i) => i.category === 'futures'),
    [instruments]
  );
  const bondsList = useMemo(
    () => instruments.filter((i) => i.category === 'bonds'),
    [instruments]
  );
  const etfsList = useMemo(
    () => instruments.filter((i) => i.category === 'etfs'),
    [instruments]
  );

  const watchlistInstruments = useMemo(
    () =>
      watchlist
        .map((sym) => bySymbol.get(sym))
        .filter((x): x is MarketInstrument => Boolean(x)),
    [watchlist, bySymbol]
  );

  const activeModalInstrument = modalSymbol ? bySymbol.get(modalSymbol) || null : null;

  const toggleWatch = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleSummaryCategoryChange = (cat: AssetCategory) => {
    setSummaryCategory(cat);
    const firstSym = SUMMARY_GROUPS[cat][0];
    if (firstSym) setSelectedSummarySymbol(firstSym);
  };

  const scrollToSection = (id: string) => {
    setActiveNavTab('overview');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#131722] text-[#131722] dark:text-[#D1D4DC] transition-colors">
      {/* Top Bar Contract: 3 clean zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md border-b border-[#E0E3EB] dark:border-[#2A2E39]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Brand mark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveNavTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#131722] dark:text-white whitespace-nowrap shrink-0"
          >
            <svg
              width="28"
              height="18"
              viewBox="0 0 36 22"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M0 0H14V6H8V22H2V6H0V0Z" fill="currentColor" />
              <circle cx="20" cy="4.5" r="3.5" fill="currentColor" />
              <path d="M25.5 0H32.5L23.5 22H16.5L25.5 0Z" fill="#2962FF" />
            </svg>
            <span>TradingView</span>
          </a>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6A6D78] dark:text-[#9598A1]"
            aria-label="Primary navigation"
          >
            <button
              type="button"
              onClick={() => setModalSymbol(activeSummaryInstrument.symbol)}
              className="hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Supercharts
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('trade-ideas-section')}
              className="hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Community
            </button>
            <button
              type="button"
              onClick={() => setActiveNavTab('overview')}
              className="text-[#131722] dark:text-white font-semibold border-b-2 border-[#2962FF] py-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Markets
            </button>
            <button
              type="button"
              onClick={() => setActiveNavTab('stocks')}
              className="hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Screeners
            </button>
            <button
              type="button"
              onClick={() => setActiveNavTab('economy')}
              className="hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Calendar
            </button>
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setModalSymbol('SPX')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#2962FF] hover:bg-[#1E53E5] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Launch Chart
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* Markets Page Hero Header & Workspace Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div>
            <div className="text-xs font-medium text-[#787B86] mb-2">
              Markets · Global Financial Overview
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#131722] dark:text-white leading-tight [text-wrap:balance]">
              Markets
            </h1>
            <p className="text-sm sm:text-base text-[#6A6D78] dark:text-[#868993] mt-1.5">
              Track global equities, indices, cryptocurrencies, futures, currencies, and yields.
            </p>
          </div>

          {/* Workspace Toolbar: Search, Live Ticks, Watchlist, Theme */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center justify-between gap-6 px-3.5 py-2 text-sm text-[#787B86] bg-[#F0F3FA] dark:bg-[#1E222D] hover:bg-[#E0E3EB]/70 dark:hover:bg-[#2A2E39] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-lg transition-colors min-w-[210px] cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Search markets</span>
              </span>
              <kbd className="hidden sm:inline-block text-[11px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#131722] border border-[#E0E3EB] dark:border-[#2A2E39]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setWatchlistOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] text-[#131722] dark:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Star className="w-4 h-4 text-[#2962FF]" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setLiveTicks((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] text-[#131722] dark:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Toggle simulated market price ticks"
            >
              {liveTicks ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#089981]" />
                  <span>Live Quotes</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#787B86]" />
                  <span>Paused</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] text-[#131722] dark:text-white transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Markets Sub-Navigation Strip */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-[#E0E3EB] dark:border-[#2A2E39] mb-8">
          {SUB_NAV_TABS.map((tab) => {
            const isActive = activeNavTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveNavTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#2962FF] text-[#2962FF] font-semibold'
                    : 'border-transparent text-[#6A6D78] dark:text-[#868993] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeNavTab !== 'overview' ? (
          <CategoryView
            tab={activeNavTab}
            instruments={instruments}
            watchlist={watchlist}
            onToggleWatch={toggleWatch}
            onSelectSymbol={(sym) => setModalSymbol(sym)}
            onBackOverview={() => setActiveNavTab('overview')}
          />
        ) : (
          <div className="space-y-14">
            {/* SECTION 1: MARKET SUMMARY */}
            <section aria-labelledby="market-summary-heading">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <button
                  type="button"
                  onClick={() => setActiveNavTab(summaryCategory)}
                  className="inline-flex items-center gap-1 text-xl sm:text-2xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] transition-colors cursor-pointer"
                >
                  <span id="market-summary-heading">Market summary</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Category Filter Segmented Strip */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 rounded-lg bg-[#F0F3FA] dark:bg-[#1E222D]">
                  {SUMMARY_TABS.map((t) => {
                    const active = summaryCategory === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSummaryCategoryChange(t.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                          active
                            ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                            : 'text-[#6A6D78] dark:text-[#868993] hover:text-[#131722] dark:hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4-Card Ticker Summary Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {summaryCards.map((card) => {
                  const isSelected = activeSummaryInstrument.symbol === card.symbol;
                  const isPos = card.changePercent >= 0;
                  return (
                    <div
                      key={card.symbol}
                      className={`group relative rounded-xl border p-4 transition-colors ${
                        isSelected
                          ? 'bg-[#F0F3FA]/80 dark:bg-[#1E222D] border-[#2962FF]'
                          : 'bg-white dark:bg-[#1E222D]/60 border-[#E0E3EB] dark:border-[#2A2E39] hover:border-[#B2B5BE] dark:hover:border-[#434651]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedSummarySymbol(card.symbol)}
                        className="w-full text-left cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <TickerBadge
                              text={card.badgeText}
                              color={card.badgeColor}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-[#131722] dark:text-white truncate">
                                {card.name}
                              </div>
                              <div className="text-xs text-[#787B86] font-mono">
                                {card.symbol}
                              </div>
                            </div>
                          </div>
                          <Sparkline
                            data={card.sparkline}
                            isPositive={isPos}
                            width={58}
                            height={22}
                          />
                        </div>

                        <div className="flex items-baseline justify-between gap-2 font-mono tabular-nums">
                          <span className="text-lg font-bold text-[#131722] dark:text-white">
                            {formatInstrumentPrice(
                              card.price,
                              card.decimals,
                              card.currency
                            )}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              isPos ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {formatChangePercent(card.changePercent)}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalSymbol(card.symbol)}
                        aria-label={`Open full chart for ${card.name}`}
                        title="Open full chart"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-md bg-white/90 dark:bg-[#2A2E39] text-[#787B86] hover:text-[#2962FF] border border-[#E0E3EB] dark:border-[#363A45] transition-opacity cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Hero Interactive Chart Card */}
              <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <TickerBadge
                      text={activeSummaryInstrument.badgeText}
                      color={activeSummaryInstrument.badgeColor}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-[#131722] dark:text-white">
                          {activeSummaryInstrument.name}
                        </span>
                        <span className="text-xs font-mono text-[#787B86]">
                          {activeSummaryInstrument.exchange}:
                          {activeSummaryInstrument.symbol}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2.5 font-mono tabular-nums text-sm mt-0.5">
                        <span className="text-lg font-bold text-[#131722] dark:text-white">
                          {formatInstrumentPrice(
                            activeSummaryInstrument.price,
                            activeSummaryInstrument.decimals,
                            activeSummaryInstrument.currency
                          )}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            activeSummaryInstrument.changePercent >= 0
                              ? 'text-[#089981]'
                              : 'text-[#F23645]'
                          }`}
                        >
                          {formatChange(
                            activeSummaryInstrument.change,
                            activeSummaryInstrument.decimals
                          )}{' '}
                          ({formatChangePercent(activeSummaryInstrument.changePercent)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1">
                      {(['1D', '1M', '3M', '1Y', '5Y', 'All'] as ChartRange[]).map(
                        (r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setSummaryRange(r)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                              summaryRange === r
                                ? 'bg-[#2962FF] text-white'
                                : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39]'
                            }`}
                          >
                            {r}
                          </button>
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#F0F3FA] dark:bg-[#131722]">
                      <button
                        type="button"
                        onClick={() => setSummaryChartType('area')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          summaryChartType === 'area'
                            ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                            : 'text-[#787B86]'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        Area
                      </button>
                      <button
                        type="button"
                        onClick={() => setSummaryChartType('candles')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          summaryChartType === 'candles'
                            ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                            : 'text-[#787B86]'
                        }`}
                      >
                        <CandlestickChart className="w-3.5 h-3.5" />
                        Candles
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalSymbol(activeSummaryInstrument.symbol)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2962FF] hover:bg-[#2962FF]/10 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      See full chart
                    </button>
                  </div>
                </div>

                <InteractiveChart
                  instrument={activeSummaryInstrument}
                  data={summarySeries}
                  range={summaryRange}
                  chartType={summaryChartType}
                  height={310}
                />
              </div>
            </section>

            {/* SECTION 2: US STOCKS MOVERS & S&P 500 HEATMAP */}
            <section aria-labelledby="us-stocks-heading">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <button
                  type="button"
                  onClick={() => setActiveNavTab('stocks')}
                  className="inline-flex items-center gap-1 text-xl sm:text-2xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] transition-colors cursor-pointer"
                >
                  <span id="us-stocks-heading">US stocks</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left 7 Cols: Movers List */}
                <div className="lg:col-span-7 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] p-5 flex flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F0F3FA] dark:bg-[#131722]">
                      {(
                        [
                          { id: 'largest', label: 'Largest' },
                          { id: 'gainers', label: 'Top Gainers' },
                          { id: 'losers', label: 'Top Losers' },
                          { id: 'active', label: 'Most Active' },
                        ] as { id: StockMoverTab; label: string }[]
                      ).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setStockMoverTab(t.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                            stockMoverTab === t.id
                              ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                              : 'text-[#6A6D78] dark:text-[#868993] hover:text-[#131722] dark:hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNavTab('stocks')}
                      className="text-xs font-semibold text-[#2962FF] hover:underline cursor-pointer"
                    >
                      All US stocks
                    </button>
                  </div>

                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#E0E3EB] dark:border-[#2A2E39] text-xs font-medium text-[#787B86]">
                          <th className="py-2.5 pr-3">Ticker</th>
                          <th className="py-2.5 px-3 text-right">Price</th>
                          <th className="py-2.5 px-3 text-right">Change %</th>
                          <th className="py-2.5 px-3 text-right hidden sm:table-cell">
                            Mkt Cap
                          </th>
                          <th className="py-2.5 pl-3 text-right hidden md:table-cell">
                            Trend
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39] text-sm">
                        {stockMovers.map((stock) => {
                          const isPos = stock.changePercent >= 0;
                          return (
                            <tr
                              key={stock.symbol}
                              onClick={() => setModalSymbol(stock.symbol)}
                              className="hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/50 transition-colors cursor-pointer"
                            >
                              <td className="py-3 pr-3">
                                <div className="flex items-center gap-2.5">
                                  <TickerBadge
                                    text={stock.badgeText}
                                    color={stock.badgeColor}
                                    size="sm"
                                  />
                                  <div>
                                    <div className="font-semibold text-[#131722] dark:text-white">
                                      {stock.symbol}
                                    </div>
                                    <div className="text-xs text-[#787B86] truncate max-w-[140px]">
                                      {stock.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-semibold text-[#131722] dark:text-white tabular-nums">
                                ${stock.price.toFixed(2)}
                              </td>
                              <td
                                className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                                  isPos ? 'text-[#089981]' : 'text-[#F23645]'
                                }`}
                              >
                                {formatChangePercent(stock.changePercent)}
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-xs text-[#787B86] tabular-nums hidden sm:table-cell">
                                {stock.marketCap}
                              </td>
                              <td className="py-3 pl-3 hidden md:table-cell">
                                <div className="flex justify-end">
                                  <Sparkline
                                    data={stock.sparkline}
                                    isPositive={isPos}
                                    width={68}
                                    height={22}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right 5 Cols: Sector Heatmap */}
                <div className="lg:col-span-5 rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] p-5 flex flex-col">
                  <SectorHeatmap onSelectSymbol={(sym) => setModalSymbol(sym)} />
                </div>
              </div>
            </section>

            {/* SECTION 3: TRADE IDEAS & MARKET NEWS */}
            <section id="trade-ideas-section" aria-labelledby="ideas-news-heading">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Trade Ideas (7 cols) */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between mb-5">
                    <h2
                      id="ideas-news-heading"
                      className="text-xl sm:text-2xl font-bold text-[#131722] dark:text-white"
                    >
                      Community trade ideas
                    </h2>
                    <span className="text-xs text-[#787B86]">
                      Curated technical setups
                    </span>
                  </div>

                  <div className="space-y-4">
                    {TRADE_IDEAS.map((idea) => {
                      const isLong = idea.direction === 'Long';
                      const liked = Boolean(likedIdeas[idea.id]);
                      const inst = bySymbol.get(idea.symbol);
                      return (
                        <article
                          key={idea.id}
                          className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] p-4 sm:p-5 hover:border-[#B2B5BE] dark:hover:border-[#434651] transition-colors"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-4 rounded-lg bg-[#F8FAFD] dark:bg-[#131722] border border-[#E0E3EB] dark:border-[#2A2E39] p-3 flex flex-col justify-between h-28">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-semibold text-[#131722] dark:text-white">
                                  {idea.symbol}
                                </span>
                                <span
                                  className={`font-semibold ${
                                    isLong ? 'text-[#089981]' : 'text-[#F23645]'
                                  }`}
                                >
                                  {idea.direction}
                                </span>
                              </div>
                              <Sparkline
                                data={idea.chartPoints}
                                isPositive={isLong}
                                width={180}
                                height={56}
                              />
                            </div>

                            <div className="sm:col-span-8 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-2 text-xs text-[#787B86] mb-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setModalSymbol(idea.symbol)}
                                    className="font-semibold text-[#2962FF] hover:underline cursor-pointer"
                                  >
                                    {inst ? inst.name : idea.symbol}
                                  </button>
                                  <span aria-hidden="true">·</span>
                                  <span>{idea.timeframe}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{idea.publishedAt}</span>
                                </div>
                                <h3 className="text-base font-bold text-[#131722] dark:text-white leading-snug">
                                  <button
                                    type="button"
                                    onClick={() => setModalSymbol(idea.symbol)}
                                    className="text-left hover:text-[#2962FF] transition-colors cursor-pointer"
                                  >
                                    {idea.title}
                                  </button>
                                </h3>
                                <p className="text-xs sm:text-sm text-[#6A6D78] dark:text-[#868993] mt-1.5 line-clamp-2">
                                  {idea.summary}
                                </p>
                              </div>

                              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E0E3EB] dark:border-[#2A2E39] text-xs text-[#787B86]">
                                <span>by {idea.author}</span>
                                <div className="flex items-center gap-4 font-mono tabular-nums">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setLikedIdeas((prev) => ({
                                        ...prev,
                                        [idea.id]: !prev[idea.id],
                                      }))
                                    }
                                    className={`inline-flex items-center gap-1 transition-colors cursor-pointer ${
                                      liked
                                        ? 'text-[#F23645] font-semibold'
                                        : 'hover:text-[#131722] dark:hover:text-white'
                                    }`}
                                  >
                                    <Heart
                                      className={`w-3.5 h-3.5 ${
                                        liked ? 'fill-current' : ''
                                      }`}
                                    />
                                    {idea.likes + (liked ? 1 : 0)}
                                  </button>
                                  <span className="inline-flex items-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    {idea.comments}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>

                {/* Market News (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#131722] dark:text-white">
                      Market news
                    </h2>
                    <span className="text-xs text-[#787B86]">Latest headlines</span>
                  </div>

                  <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
                    {MARKET_NEWS.map((news) => (
                      <div key={news.id} className="p-4 hover:bg-[#F0F3FA]/60 dark:hover:bg-[#2A2E39]/40 transition-colors">
                        <div className="flex items-center gap-2 text-xs text-[#787B86] mb-1">
                          <span className="font-medium text-[#131722] dark:text-[#D1D4DC]">
                            {news.source}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{news.timeAgo}</span>
                          <span aria-hidden="true">·</span>
                          <span>{news.category}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            news.relatedSymbol && setModalSymbol(news.relatedSymbol)
                          }
                          className="text-left text-sm font-semibold text-[#131722] dark:text-white hover:text-[#2962FF] leading-snug transition-colors cursor-pointer"
                        >
                          {news.headline}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: CRYPTOCURRENCIES */}
            <section aria-labelledby="crypto-heading">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <button
                  type="button"
                  onClick={() => setActiveNavTab('crypto')}
                  className="inline-flex items-center gap-1 text-xl sm:text-2xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] transition-colors cursor-pointer"
                >
                  <span id="crypto-heading">Crypto</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-[#787B86]">
                  <span>
                    Total Cap:{' '}
                    <strong className="text-[#131722] dark:text-white">$3.24T</strong>
                  </span>
                  <span>
                    BTC Dominance:{' '}
                    <strong className="text-[#131722] dark:text-white">58.0%</strong>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cryptoList.map((coin) => {
                  const isPos = coin.changePercent >= 0;
                  return (
                    <button
                      key={coin.symbol}
                      type="button"
                      onClick={() => setModalSymbol(coin.symbol)}
                      className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] p-4 text-left hover:border-[#2962FF] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <TickerBadge
                            text={coin.badgeText}
                            color={coin.badgeColor}
                            size="md"
                          />
                          <div>
                            <div className="font-semibold text-sm text-[#131722] dark:text-white">
                              {coin.name}
                            </div>
                            <div className="text-xs font-mono text-[#787B86]">
                              {coin.symbol} · Cap ${coin.marketCap}
                            </div>
                          </div>
                        </div>
                        <Sparkline
                          data={coin.sparkline}
                          isPositive={isPos}
                          width={72}
                          height={24}
                        />
                      </div>
                      <div className="flex items-baseline justify-between font-mono tabular-nums">
                        <span className="text-base font-bold text-[#131722] dark:text-white">
                          ${formatInstrumentPrice(coin.price, coin.decimals, coin.currency)}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isPos ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          {formatChangePercent(coin.changePercent)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* SECTION 5: FOREX & FUTURES (2-COLUMN SPLIT) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Forex */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('forex')}
                    className="inline-flex items-center gap-1 text-xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] transition-colors cursor-pointer"
                  >
                    <span>Currencies</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-[#787B86]">Major pairs</span>
                </div>
                <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
                  {forexList.map((fx) => {
                    const isPos = fx.changePercent >= 0;
                    return (
                      <button
                        key={fx.symbol}
                        type="button"
                        onClick={() => setModalSymbol(fx.symbol)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <TickerBadge
                            text={fx.badgeText}
                            color={fx.badgeColor}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#131722] dark:text-white">
                              {fx.symbol}
                            </div>
                            <div className="text-xs text-[#787B86] truncate">
                              {fx.name}
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <Sparkline
                            data={fx.sparkline}
                            isPositive={isPos}
                            width={64}
                            height={20}
                          />
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <div className="text-sm font-semibold text-[#131722] dark:text-white">
                            {fx.price.toFixed(fx.decimals)}
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              isPos ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {formatChangePercent(fx.changePercent)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Futures & Commodities */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('futures')}
                    className="inline-flex items-center gap-1 text-xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] transition-colors cursor-pointer"
                  >
                    <span>Futures &amp; Commodities</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-[#787B86]">Front-month</span>
                </div>
                <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
                  {futuresList.map((fut) => {
                    const isPos = fut.changePercent >= 0;
                    return (
                      <button
                        key={fut.symbol}
                        type="button"
                        onClick={() => setModalSymbol(fut.symbol)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <TickerBadge
                            text={fut.badgeText}
                            color={fut.badgeColor}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#131722] dark:text-white">
                              {fut.name}
                            </div>
                            <div className="text-xs text-[#787B86] font-mono">
                              {fut.symbol} · {fut.exchange}
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <Sparkline
                            data={fut.sparkline}
                            isPositive={isPos}
                            width={64}
                            height={20}
                          />
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <div className="text-sm font-semibold text-[#131722] dark:text-white">
                            ${fut.price.toFixed(fut.decimals)}
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              isPos ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {formatChangePercent(fut.changePercent)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 6: BONDS & ETFs (2-COLUMN SPLIT) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Government Bonds */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('bonds')}
                    className="inline-flex items-center gap-1 text-xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] transition-colors cursor-pointer"
                  >
                    <span>Government bonds</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-[#787B86]">Sovereign yields</span>
                </div>
                <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
                  {bondsList.map((bond) => {
                    const isPos = bond.changePercent >= 0;
                    return (
                      <button
                        key={bond.symbol}
                        type="button"
                        onClick={() => setModalSymbol(bond.symbol)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <TickerBadge
                            text={bond.badgeText}
                            color={bond.badgeColor}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#131722] dark:text-white truncate">
                              {bond.name}
                            </div>
                            <div className="text-xs text-[#787B86] font-mono">
                              {bond.symbol} · {bond.sector}
                            </div>
                          </div>
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <div className="text-sm font-semibold text-[#131722] dark:text-white">
                            {bond.price.toFixed(bond.decimals)}%
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              isPos ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {formatChangePercent(bond.changePercent)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Global ETFs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('etfs')}
                    className="inline-flex items-center gap-1 text-xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] transition-colors cursor-pointer"
                  >
                    <span>ETFs</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-[#787B86]">Highest liquidity</span>
                </div>
                <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
                  {etfsList.map((etf) => {
                    const isPos = etf.changePercent >= 0;
                    return (
                      <button
                        key={etf.symbol}
                        type="button"
                        onClick={() => setModalSymbol(etf.symbol)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#F0F3FA]/70 dark:hover:bg-[#2A2E39]/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <TickerBadge
                            text={etf.badgeText}
                            color={etf.badgeColor}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#131722] dark:text-white">
                              {etf.symbol}
                            </div>
                            <div className="text-xs text-[#787B86] truncate">
                              {etf.name}
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:block text-xs font-mono text-[#787B86]">
                          AUM {etf.yieldOrAum}
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <div className="text-sm font-semibold text-[#131722] dark:text-white">
                            ${etf.price.toFixed(etf.decimals)}
                          </div>
                          <div
                            className={`text-xs font-medium ${
                              isPos ? 'text-[#089981]' : 'text-[#F23645]'
                            }`}
                          >
                            {formatChangePercent(etf.changePercent)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 7: ECONOMIC CALENDAR PREVIEW */}
            <section aria-labelledby="eco-heading">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setActiveNavTab('economy')}
                  className="inline-flex items-center gap-1 text-xl sm:text-2xl font-bold text-[#131722] dark:text-white hover:text-[#2962FF] transition-colors cursor-pointer"
                >
                  <span id="eco-heading">Economic calendar</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNavTab('economy')}
                  className="text-xs font-semibold text-[#2962FF] hover:underline cursor-pointer"
                >
                  Full calendar
                </button>
              </div>

              <div className="rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#1E222D] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E0E3EB] dark:border-[#2A2E39] text-xs font-medium text-[#787B86] bg-[#F8FAFD] dark:bg-[#131722]/40">
                        <th className="py-2.5 px-4">Time</th>
                        <th className="py-2.5 px-4">Currency</th>
                        <th className="py-2.5 px-4">Event</th>
                        <th className="py-2.5 px-4 text-right">Actual</th>
                        <th className="py-2.5 px-4 text-right">Forecast</th>
                        <th className="py-2.5 px-4 text-right">Prior</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39] text-sm">
                      {ECONOMIC_EVENTS.slice(0, 4).map((ev) => (
                        <tr
                          key={ev.id}
                          className="hover:bg-[#F0F3FA]/60 dark:hover:bg-[#2A2E39]/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-xs text-[#787B86] whitespace-nowrap tabular-nums">
                            {ev.date} · {ev.time}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs font-semibold text-[#131722] dark:text-white">
                            {ev.currency}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#131722] dark:text-white">
                            {ev.event}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-[#131722] dark:text-white tabular-nums">
                            {ev.actual}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-[#787B86] tabular-nums">
                            {ev.forecast}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-[#787B86] tabular-nums">
                            {ev.prior}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[#E0E3EB] dark:border-[#2A2E39] bg-[#F8FAFD] dark:bg-[#0F131D]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-8 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
            <div>
              <h3 className="text-xs font-bold text-[#131722] dark:text-white mb-3">
                Markets
              </h3>
              <ul className="space-y-2 text-xs text-[#6A6D78] dark:text-[#868993]">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('indices')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    World Indices
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('stocks')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    US Stocks
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('crypto')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Cryptocurrencies
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('forex')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Forex Pairs
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#131722] dark:text-white mb-3">
                Tools
              </h3>
              <ul className="space-y-2 text-xs text-[#6A6D78] dark:text-[#868993]">
                <li>
                  <button
                    type="button"
                    onClick={() => setModalSymbol('SPX')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Supercharts
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Symbol Search
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setWatchlistOpen(true)}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Watchlist
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('economy')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Economic Calendar
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#131722] dark:text-white mb-3">
                Asset Classes
              </h3>
              <ul className="space-y-2 text-xs text-[#6A6D78] dark:text-[#868993]">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('futures')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Commodities &amp; Futures
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('bonds')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Government Bonds
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('etfs')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Global ETFs
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#131722] dark:text-white mb-3">
                Community
              </h3>
              <ul className="space-y-2 text-xs text-[#6A6D78] dark:text-[#868993]">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('trade-ideas-section')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Trade Ideas
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('trade-ideas-section')}
                    className="hover:text-[#2962FF] cursor-pointer"
                  >
                    Market News
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#787B86]">
            <span>TradingView Markets UI · Simulated market quotes for interactive demonstration</span>
            <span>© 2026 Markets Overview</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SymbolModal
        instrument={activeModalInstrument}
        onClose={() => setModalSymbol(null)}
        isWatched={
          activeModalInstrument
            ? watchlist.includes(activeModalInstrument.symbol)
            : false
        }
        onToggleWatch={toggleWatch}
      />

      <WatchlistDrawer
        open={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        instruments={watchlistInstruments}
        onSelectSymbol={(sym) => setModalSymbol(sym)}
        onRemoveSymbol={toggleWatch}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectSymbol={(sym) => setModalSymbol(sym)}
      />
    </div>
  );
}
