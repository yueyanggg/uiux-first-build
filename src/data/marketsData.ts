export type AssetCategory =
  | 'indices'
  | 'stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'bonds'
  | 'etfs';

export type MarketsNavTab = 'overview' | AssetCategory | 'economy';

export type ChartRange = '1D' | '1M' | '3M' | '1Y' | '5Y' | 'All';

export type TechnicalRating =
  | 'Strong buy'
  | 'Buy'
  | 'Neutral'
  | 'Sell'
  | 'Strong sell';

export interface MarketInstrument {
  symbol: string;
  name: string;
  exchange: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap?: string;
  sector?: string;
  rating: TechnicalRating;
  currency: string;
  decimals: number;
  high52w: number;
  low52w: number;
  peRatio?: string;
  yieldOrAum?: string;
  badgeColor: string;
  badgeText: string;
  sparkline: number[];
  description: string;
}

export interface HeatmapTile {
  symbol: string;
  name: string;
  sector: string;
  weight: number; // relative visual weight
  price: number;
  changePercent: number;
  marketCap: string;
}

export interface TradeIdea {
  id: string;
  symbol: string;
  title: string;
  summary: string;
  author: string;
  timeframe: string;
  direction: 'Long' | 'Short';
  publishedAt: string;
  likes: number;
  comments: number;
  chartPoints: number[];
}

export interface MarketNewsItem {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  category: string;
  relatedSymbol?: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  country: string;
  currency: string;
  event: string;
  impact: 1 | 2 | 3;
  actual: string;
  forecast: string;
  prior: string;
}

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const ALL_INSTRUMENTS: MarketInstrument[] = [
  // INDICES
  {
    symbol: 'SPX',
    name: 'S&P 500 Index',
    exchange: 'SP',
    category: 'indices',
    price: 5984.25,
    change: 28.6,
    changePercent: 0.48,
    volume: '2.41B',
    sector: 'US Large Cap',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 6049.88,
    low52w: 4512.3,
    badgeColor: '#F23645',
    badgeText: '500',
    sparkline: [5910, 5925, 5918, 5940, 5952, 5948, 5965, 5972, 5984.25],
    description: 'Benchmark index tracking 500 of the largest U.S. publicly traded companies across major sectors.',
  },
  {
    symbol: 'NDX',
    name: 'Nasdaq 100',
    exchange: 'NASDAQ',
    category: 'indices',
    price: 20892.1,
    change: 149.35,
    changePercent: 0.72,
    volume: '1.18B',
    sector: 'US Tech & Growth',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 21182.4,
    low52w: 15698.1,
    badgeColor: '#2962FF',
    badgeText: '100',
    sparkline: [20580, 20640, 20615, 20710, 20755, 20740, 20820, 20860, 20892.1],
    description: 'Index of the 100 largest non-financial companies listed on the Nasdaq Stock Market.',
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones Industrial',
    exchange: 'DJ',
    category: 'indices',
    price: 44218.5,
    change: 83.9,
    changePercent: 0.19,
    volume: '412M',
    sector: 'US Blue Chip',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 44500.12,
    low52w: 35210.4,
    badgeColor: '#089981',
    badgeText: '30',
    sparkline: [44090, 44120, 44080, 44140, 44175, 44160, 44195, 44205, 44218.5],
    description: 'Price-weighted index of 30 prominent blue-chip industrial and financial companies in the United States.',
  },
  {
    symbol: 'RUT',
    name: 'Russell 2000',
    exchange: 'RUSSELL',
    category: 'indices',
    price: 2341.8,
    change: -5.63,
    changePercent: -0.24,
    volume: '980M',
    sector: 'US Small Cap',
    rating: 'Neutral',
    currency: 'USD',
    decimals: 2,
    high52w: 2442.1,
    low52w: 1785.4,
    badgeColor: '#FF9800',
    badgeText: '2K',
    sparkline: [2358, 2354, 2360, 2351, 2348, 2350, 2344, 2343, 2341.8],
    description: 'Small-cap stock market index measuring the performance of approximately 2,000 small-cap U.S. equities.',
  },
  {
    symbol: 'VIX',
    name: 'CBOE Volatility Index',
    exchange: 'CBOE',
    category: 'indices',
    price: 14.32,
    change: -0.68,
    changePercent: -4.53,
    volume: '—',
    sector: 'Volatility',
    rating: 'Sell',
    currency: 'USD',
    decimals: 2,
    high52w: 38.57,
    low52w: 11.86,
    badgeColor: '#787B86',
    badgeText: 'VIX',
    sparkline: [15.4, 15.2, 15.35, 14.9, 14.8, 14.6, 14.45, 14.38, 14.32],
    description: 'Real-time market expectation of 30-day forward-looking volatility derived from S&P 500 index options.',
  },
  {
    symbol: 'DAX',
    name: 'DAX Performance Index',
    exchange: 'XETR',
    category: 'indices',
    price: 19412.6,
    change: 112.4,
    changePercent: 0.58,
    volume: '76.4M',
    sector: 'Europe',
    rating: 'Buy',
    currency: 'EUR',
    decimals: 2,
    high52w: 19674.2,
    low52w: 15890.0,
    badgeColor: '#1E53E5',
    badgeText: 'DE',
    sparkline: [19260, 19290, 19310, 19300, 19340, 19365, 19390, 19402, 19412.6],
    description: 'Blue-chip stock market index consisting of the 40 major German companies trading on the Frankfurt Stock Exchange.',
  },
  {
    symbol: 'NI225',
    name: 'Nikkei 225',
    exchange: 'TSE',
    category: 'indices',
    price: 38780.4,
    change: -142.1,
    changePercent: -0.37,
    volume: '1.05B',
    sector: 'Asia-Pacific',
    rating: 'Neutral',
    currency: 'JPY',
    decimals: 2,
    high52w: 42224.0,
    low52w: 31156.0,
    badgeColor: '#E91E63',
    badgeText: 'JP',
    sparkline: [38980, 38940, 38960, 38910, 38870, 38850, 38810, 38795, 38780.4],
    description: 'Price-weighted equity index for the Tokyo Stock Exchange tracking 225 top Japanese blue-chip companies.',
  },
  {
    symbol: 'UKX',
    name: 'FTSE 100 Index',
    exchange: 'LSE',
    category: 'indices',
    price: 8264.15,
    change: 24.8,
    changePercent: 0.3,
    volume: '684M',
    sector: 'Europe',
    rating: 'Buy',
    currency: 'GBP',
    decimals: 2,
    high52w: 8474.4,
    low52w: 7404.1,
    badgeColor: '#00897B',
    badgeText: 'UK',
    sparkline: [8220, 8228, 8235, 8231, 8242, 8250, 8256, 8260, 8264.15],
    description: 'Share index of the 100 companies listed on the London Stock Exchange with the highest market capitalization.',
  },

  // US STOCKS
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 146.84,
    change: 4.18,
    changePercent: 2.93,
    volume: '218.4M',
    marketCap: '3.60T',
    sector: 'Technology',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 152.89,
    low52w: 47.32,
    peRatio: '56.4',
    badgeColor: '#76B900',
    badgeText: 'NV',
    sparkline: [140.2, 141.5, 142.1, 141.8, 143.6, 144.9, 145.4, 146.1, 146.84],
    description: 'Global leader in accelerated computing, data center GPUs, and AI infrastructure platforms.',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 234.72,
    change: 1.54,
    changePercent: 0.66,
    volume: '42.8M',
    marketCap: '3.55T',
    sector: 'Technology',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 237.49,
    low52w: 164.08,
    peRatio: '35.8',
    badgeColor: '#131722',
    badgeText: 'AA',
    sparkline: [231.9, 232.4, 232.1, 233.0, 233.5, 233.8, 234.1, 234.4, 234.72],
    description: 'Designs, manufactures, and markets consumer hardware, software ecosystems, and digital services worldwide.',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 426.18,
    change: 3.12,
    changePercent: 0.74,
    volume: '19.6M',
    marketCap: '3.17T',
    sector: 'Technology',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 468.35,
    low52w: 366.5,
    peRatio: '34.9',
    badgeColor: '#00A4EF',
    badgeText: 'MS',
    sparkline: [421.4, 422.1, 422.8, 423.4, 424.0, 424.7, 425.2, 425.8, 426.18],
    description: 'Enterprise cloud infrastructure, productivity software, developer tools, and intelligent computing solutions.',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 209.45,
    change: 2.86,
    changePercent: 1.38,
    volume: '38.2M',
    marketCap: '2.20T',
    sector: 'Consumer Cyclical',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 215.9,
    low52w: 144.05,
    peRatio: '44.2',
    badgeColor: '#FF9900',
    badgeText: 'AM',
    sparkline: [205.2, 206.0, 206.4, 207.1, 207.8, 208.1, 208.6, 209.1, 209.45],
    description: 'Global e-commerce marketplace, AWS cloud computing services, and digital logistics network.',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 176.34,
    change: -1.12,
    changePercent: -0.63,
    volume: '24.5M',
    marketCap: '2.16T',
    sector: 'Communication',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 191.75,
    low52w: 130.67,
    peRatio: '23.1',
    badgeColor: '#4285F4',
    badgeText: 'GO',
    sparkline: [178.1, 177.9, 177.5, 177.6, 177.2, 176.9, 176.6, 176.4, 176.34],
    description: 'Search, digital advertising, YouTube media platform, Google Cloud, and frontier research.',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 591.2,
    change: 7.45,
    changePercent: 1.28,
    volume: '14.2M',
    marketCap: '1.49T',
    sector: 'Communication',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 602.95,
    low52w: 326.8,
    peRatio: '27.8',
    badgeColor: '#0668E1',
    badgeText: 'ME',
    sparkline: [581.0, 583.2, 584.5, 586.0, 587.4, 588.1, 589.5, 590.4, 591.2],
    description: 'Builds social connectivity platforms, digital advertising infrastructure, and open-weight AI systems.',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 342.68,
    change: 12.94,
    changePercent: 3.92,
    volume: '88.7M',
    marketCap: '1.10T',
    sector: 'Consumer Cyclical',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 358.64,
    low52w: 138.8,
    peRatio: '92.4',
    badgeColor: '#E31937',
    badgeText: 'TS',
    sparkline: [326.4, 329.0, 331.2, 333.8, 335.1, 337.9, 339.4, 341.0, 342.68],
    description: 'Electric vehicles, autonomous driving software, grid-scale battery storage, and solar energy systems.',
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 64.85,
    change: 3.74,
    changePercent: 6.12,
    volume: '79.3M',
    marketCap: '147.8B',
    sector: 'Technology',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 66.0,
    low52w: 15.66,
    peRatio: '218.5',
    badgeColor: '#2E3440',
    badgeText: 'PL',
    sparkline: [60.1, 60.8, 61.4, 62.0, 62.6, 63.2, 63.9, 64.3, 64.85],
    description: 'Enterprise data integration, ontology operating systems, and applied operational AI platforms.',
  },
  {
    symbol: 'SMCI',
    name: 'Super Micro Computer',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 31.42,
    change: -2.18,
    changePercent: -6.49,
    volume: '64.1M',
    marketCap: '18.4B',
    sector: 'Technology',
    rating: 'Sell',
    currency: 'USD',
    decimals: 2,
    high52w: 122.9,
    low52w: 17.25,
    peRatio: '14.6',
    badgeColor: '#0068B5',
    badgeText: 'SM',
    sparkline: [34.2, 33.8, 33.4, 33.1, 32.7, 32.3, 31.9, 31.6, 31.42],
    description: 'High-performance server and liquid-cooled rack-scale storage systems for enterprise data centers.',
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    exchange: 'NYSE',
    category: 'stocks',
    price: 245.16,
    change: 1.84,
    changePercent: 0.76,
    volume: '8.9M',
    marketCap: '692.4B',
    sector: 'Financial',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 248.0,
    low52w: 152.3,
    peRatio: '13.4',
    badgeColor: '#117ACA',
    badgeText: 'JP',
    sparkline: [242.4, 242.9, 243.2, 243.8, 244.1, 244.4, 244.8, 245.0, 245.16],
    description: 'Global financial services firm providing investment banking, commercial banking, and asset management.',
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    exchange: 'NYSE',
    category: 'stocks',
    price: 786.4,
    change: -14.2,
    changePercent: -1.77,
    volume: '4.1M',
    marketCap: '746.1B',
    sector: 'Healthcare',
    rating: 'Neutral',
    currency: 'USD',
    decimals: 2,
    high52w: 972.53,
    low52w: 562.4,
    peRatio: '82.1',
    badgeColor: '#D52B1E',
    badgeText: 'LL',
    sparkline: [804.0, 801.5, 798.2, 796.0, 793.8, 791.4, 789.2, 787.6, 786.4],
    description: 'Pharmaceutical company focused on metabolic, oncology, immunology, and neuroscience therapeutics.',
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    exchange: 'NYSE',
    category: 'stocks',
    price: 118.92,
    change: -0.94,
    changePercent: -0.78,
    volume: '13.4M',
    marketCap: '524.8B',
    sector: 'Energy',
    rating: 'Neutral',
    currency: 'USD',
    decimals: 2,
    high52w: 126.34,
    low52w: 95.77,
    peRatio: '14.8',
    badgeColor: '#EE2737',
    badgeText: 'XO',
    sparkline: [120.2, 120.0, 119.8, 119.5, 119.4, 119.2, 119.1, 119.0, 118.92],
    description: 'Integrated energy producer spanning upstream exploration, refining, petrochemicals, and low-carbon fuels.',
  },

  // CRYPTO
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    exchange: 'CRYPTO',
    category: 'crypto',
    price: 94820.0,
    change: 2140.0,
    changePercent: 2.31,
    volume: '54.2B',
    marketCap: '1.88T',
    sector: 'Layer 1',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 99588.0,
    low52w: 38505.0,
    badgeColor: '#F7931A',
    badgeText: '₿',
    sparkline: [91800, 92200, 92900, 92650, 93400, 93950, 94200, 94550, 94820],
    description: 'Decentralized digital currency and proof-of-work settlement network secured by cryptographic consensus.',
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum',
    exchange: 'CRYPTO',
    category: 'crypto',
    price: 3412.5,
    change: 98.4,
    changePercent: 2.97,
    volume: '26.8B',
    marketCap: '411.2B',
    sector: 'Smart Contracts',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 4092.0,
    low52w: 2116.0,
    badgeColor: '#627EEA',
    badgeText: 'Ξ',
    sparkline: [3290, 3310, 3335, 3328, 3360, 3378, 3392, 3404, 3412.5],
    description: 'Programmable blockchain platform powering smart contracts, decentralized finance, and Layer-2 rollups.',
  },
  {
    symbol: 'SOLUSD',
    name: 'Solana',
    exchange: 'CRYPTO',
    category: 'crypto',
    price: 238.64,
    change: 8.92,
    changePercent: 3.88,
    volume: '7.4B',
    marketCap: '113.1B',
    sector: 'Layer 1',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 264.39,
    low52w: 67.2,
    badgeColor: '#14F195',
    badgeText: 'SO',
    sparkline: [226.4, 228.1, 230.4, 229.8, 232.9, 235.1, 236.4, 237.8, 238.64],
    description: 'High-throughput proof-of-history blockchain optimized for low-latency consumer and institutional applications.',
  },
  {
    symbol: 'XRPUSD',
    name: 'XRP',
    exchange: 'CRYPTO',
    category: 'crypto',
    price: 1.428,
    change: -0.041,
    changePercent: -2.79,
    volume: '6.1B',
    marketCap: '81.4B',
    sector: 'Payments',
    rating: 'Buy',
    currency: 'USD',
    decimals: 3,
    high52w: 1.63,
    low52w: 0.43,
    badgeColor: '#23292F',
    badgeText: 'XR',
    sparkline: [1.48, 1.47, 1.465, 1.458, 1.45, 1.445, 1.44, 1.432, 1.428],
    description: 'Digital asset built on the XRP Ledger designed for fast, low-cost cross-border liquidity settlements.',
  },
  {
    symbol: 'BNBUSD',
    name: 'BNB',
    exchange: 'CRYPTO',
    category: 'crypto',
    price: 652.4,
    change: 11.2,
    changePercent: 1.75,
    volume: '2.1B',
    marketCap: '94.8B',
    sector: 'Exchange',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 721.8,
    low52w: 298.4,
    badgeColor: '#F3BA2F',
    badgeText: 'BN',
    sparkline: [638, 640, 643, 645, 647, 649, 650, 651, 652.4],
    description: 'Native utility token powering the BNB Smart Chain ecosystem and fee settlements.',
  },
  {
    symbol: 'ADAUSD',
    name: 'Cardano',
    exchange: 'CRYPTO',
    category: 'crypto',
    price: 0.984,
    change: 0.036,
    changePercent: 3.8,
    volume: '1.9B',
    marketCap: '34.5B',
    sector: 'Layer 1',
    rating: 'Buy',
    currency: 'USD',
    decimals: 3,
    high52w: 1.15,
    low52w: 0.31,
    badgeColor: '#0033AD',
    badgeText: 'AD',
    sparkline: [0.94, 0.948, 0.952, 0.96, 0.965, 0.971, 0.976, 0.98, 0.984],
    description: 'Peer-reviewed proof-of-stake blockchain platform focused on formal verification and governance.',
  },

  // FUTURES & COMMODITIES
  {
    symbol: 'GC1!',
    name: 'Gold Futures',
    exchange: 'COMEX',
    category: 'futures',
    price: 2634.8,
    change: 18.4,
    changePercent: 0.7,
    volume: '184K',
    sector: 'Precious Metals',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 2801.8,
    low52w: 1996.4,
    badgeColor: '#D4AF37',
    badgeText: 'AU',
    sparkline: [2610, 2614, 2618, 2621, 2624, 2627, 2630, 2632, 2634.8],
    description: 'COMEX benchmark 100 troy ounce gold futures contract for global precious metals hedging.',
  },
  {
    symbol: 'CL1!',
    name: 'Crude Oil WTI',
    exchange: 'NYMEX',
    category: 'futures',
    price: 69.12,
    change: -1.14,
    changePercent: -1.62,
    volume: '312K',
    sector: 'Energy',
    rating: 'Sell',
    currency: 'USD',
    decimals: 2,
    high52w: 87.67,
    low52w: 65.27,
    badgeColor: '#1E222D',
    badgeText: 'CL',
    sparkline: [70.6, 70.4, 70.1, 69.9, 69.7, 69.5, 69.3, 69.2, 69.12],
    description: 'West Texas Intermediate light sweet crude oil futures contract traded on NYMEX.',
  },
  {
    symbol: 'SI1!',
    name: 'Silver Futures',
    exchange: 'COMEX',
    category: 'futures',
    price: 30.84,
    change: 0.42,
    changePercent: 1.38,
    volume: '76K',
    sector: 'Precious Metals',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 35.07,
    low52w: 22.04,
    badgeColor: '#94A3B8',
    badgeText: 'AG',
    sparkline: [30.2, 30.35, 30.42, 30.5, 30.61, 30.68, 30.74, 30.8, 30.84],
    description: 'COMEX 5,000 troy ounce silver futures contract tracking industrial and monetary silver demand.',
  },
  {
    symbol: 'NG1!',
    name: 'Natural Gas',
    exchange: 'NYMEX',
    category: 'futures',
    price: 3.384,
    change: 0.112,
    changePercent: 3.42,
    volume: '142K',
    sector: 'Energy',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 3,
    high52w: 3.56,
    low52w: 1.52,
    badgeColor: '#0284C7',
    badgeText: 'NG',
    sparkline: [3.24, 3.26, 3.29, 3.31, 3.33, 3.35, 3.36, 3.37, 3.384],
    description: 'Henry Hub Natural Gas futures contract pricing North American pipeline natural gas.',
  },
  {
    symbol: 'HG1!',
    name: 'Copper Futures',
    exchange: 'COMEX',
    category: 'futures',
    price: 4.128,
    change: -0.024,
    changePercent: -0.58,
    volume: '61K',
    sector: 'Base Metals',
    rating: 'Neutral',
    currency: 'USD',
    decimals: 3,
    high52w: 5.199,
    low52w: 3.64,
    badgeColor: '#B45309',
    badgeText: 'CU',
    sparkline: [4.16, 4.155, 4.15, 4.145, 4.14, 4.136, 4.132, 4.13, 4.128],
    description: 'High-grade copper futures contract widely followed as a barometer of global industrial expansion.',
  },

  // FOREX
  {
    symbol: 'EURUSD',
    name: 'Euro / U.S. Dollar',
    exchange: 'FX',
    category: 'forex',
    price: 1.0492,
    change: 0.0024,
    changePercent: 0.23,
    volume: '—',
    sector: 'Major FX',
    rating: 'Neutral',
    currency: 'USD',
    decimals: 4,
    high52w: 1.1214,
    low52w: 1.0332,
    badgeColor: '#003399',
    badgeText: 'EU',
    sparkline: [1.046, 1.0468, 1.0472, 1.047, 1.0478, 1.0484, 1.0486, 1.049, 1.0492],
    description: 'Most liquid currency pair globally representing the exchange rate between the Euro and the US Dollar.',
  },
  {
    symbol: 'USDJPY',
    name: 'U.S. Dollar / Japanese Yen',
    exchange: 'FX',
    category: 'forex',
    price: 153.64,
    change: -0.82,
    changePercent: -0.53,
    volume: '—',
    sector: 'Major FX',
    rating: 'Sell',
    currency: 'JPY',
    decimals: 2,
    high52w: 161.95,
    low52w: 139.58,
    badgeColor: '#BC002D',
    badgeText: 'JY',
    sparkline: [154.6, 154.4, 154.3, 154.1, 154.0, 153.9, 153.8, 153.7, 153.64],
    description: 'Major G10 currency pair sensitive to US-Japan sovereign yield spreads and central bank policy.',
  },
  {
    symbol: 'GBPUSD',
    name: 'British Pound / U.S. Dollar',
    exchange: 'FX',
    category: 'forex',
    price: 1.2584,
    change: 0.0031,
    changePercent: 0.25,
    volume: '—',
    sector: 'Major FX',
    rating: 'Neutral',
    currency: 'USD',
    decimals: 4,
    high52w: 1.3434,
    low52w: 1.2301,
    badgeColor: '#012169',
    badgeText: 'GB',
    sparkline: [1.254, 1.255, 1.2556, 1.256, 1.2568, 1.2572, 1.2578, 1.2581, 1.2584],
    description: 'Cable currency pair measuring the British Pound Sterling against the United States Dollar.',
  },
  {
    symbol: 'DXY',
    name: 'U.S. Dollar Index',
    exchange: 'ICE',
    category: 'forex',
    price: 106.84,
    change: -0.32,
    changePercent: -0.3,
    volume: '—',
    sector: 'Currency Index',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 108.07,
    low52w: 100.16,
    badgeColor: '#089981',
    badgeText: 'DX',
    sparkline: [107.2, 107.15, 107.1, 107.04, 107.0, 106.95, 106.9, 106.88, 106.84],
    description: 'Index measuring the value of the US dollar relative to a basket of six major foreign currencies.',
  },
  {
    symbol: 'AUDUSD',
    name: 'Australian Dollar / U.S. Dollar',
    exchange: 'FX',
    category: 'forex',
    price: 0.6512,
    change: 0.0018,
    changePercent: 0.28,
    volume: '—',
    sector: 'Major FX',
    rating: 'Neutral',
    currency: 'USD',
    decimals: 4,
    high52w: 0.6942,
    low52w: 0.6348,
    badgeColor: '#00843D',
    badgeText: 'AU',
    sparkline: [0.648, 0.6486, 0.6491, 0.6495, 0.65, 0.6504, 0.6508, 0.651, 0.6512],
    description: 'Commodity-linked G10 currency pair influenced by metals demand and RBA monetary policy.',
  },

  // BONDS
  {
    symbol: 'US10Y',
    name: 'US 10-Year Treasury Yield',
    exchange: 'TVC',
    category: 'bonds',
    price: 4.268,
    change: -0.048,
    changePercent: -1.11,
    volume: '—',
    sector: 'Americas',
    rating: 'Neutral',
    currency: '%',
    decimals: 3,
    high52w: 4.739,
    low52w: 3.603,
    yieldOrAum: '4.268%',
    badgeColor: '#2962FF',
    badgeText: '10Y',
    sparkline: [4.33, 4.32, 4.315, 4.305, 4.298, 4.288, 4.28, 4.274, 4.268],
    description: 'Benchmark 10-year US government sovereign bond yield anchoring global fixed-income pricing.',
  },
  {
    symbol: 'US02Y',
    name: 'US 2-Year Treasury Yield',
    exchange: 'TVC',
    category: 'bonds',
    price: 4.215,
    change: -0.032,
    changePercent: -0.75,
    volume: '—',
    sector: 'Americas',
    rating: 'Buy',
    currency: '%',
    decimals: 3,
    high52w: 5.044,
    low52w: 3.495,
    yieldOrAum: '4.215%',
    badgeColor: '#3B82F6',
    badgeText: '02Y',
    sparkline: [4.26, 4.254, 4.248, 4.242, 4.236, 4.23, 4.224, 4.22, 4.215],
    description: 'Short-duration US Treasury yield closely tracking Federal Reserve policy rate expectations.',
  },
  {
    symbol: 'DE10Y',
    name: 'Germany 10-Year Bund Yield',
    exchange: 'TVC',
    category: 'bonds',
    price: 2.184,
    change: -0.026,
    changePercent: -1.18,
    volume: '—',
    sector: 'Europe',
    rating: 'Sell',
    currency: '%',
    decimals: 3,
    high52w: 2.707,
    low52w: 1.894,
    yieldOrAum: '2.184%',
    badgeColor: '#1E293B',
    badgeText: 'DE',
    sparkline: [2.22, 2.215, 2.21, 2.205, 2.2, 2.196, 2.192, 2.188, 2.184],
    description: 'Eurozone benchmark sovereign debt yield issued by the Federal Republic of Germany.',
  },
  {
    symbol: 'GB10Y',
    name: 'UK 10-Year Gilt Yield',
    exchange: 'TVC',
    category: 'bonds',
    price: 4.352,
    change: -0.019,
    changePercent: -0.43,
    volume: '—',
    sector: 'Europe',
    rating: 'Neutral',
    currency: '%',
    decimals: 3,
    high52w: 4.588,
    low52w: 3.44,
    yieldOrAum: '4.352%',
    badgeColor: '#4F46E5',
    badgeText: 'UK',
    sparkline: [4.38, 4.376, 4.372, 4.368, 4.364, 4.36, 4.358, 4.355, 4.352],
    description: 'United Kingdom 10-year sovereign gilt yield benchmark.',
  },
  {
    symbol: 'JP10Y',
    name: 'Japan 10-Year JGB Yield',
    exchange: 'TVC',
    category: 'bonds',
    price: 1.064,
    change: 0.012,
    changePercent: 1.14,
    volume: '—',
    sector: 'Asia',
    rating: 'Buy',
    currency: '%',
    decimals: 3,
    high52w: 1.102,
    low52w: 0.556,
    yieldOrAum: '1.064%',
    badgeColor: '#BE123C',
    badgeText: 'JP',
    sparkline: [1.045, 1.048, 1.05, 1.052, 1.055, 1.058, 1.06, 1.062, 1.064],
    description: 'Japanese 10-year Government Bond yield reflecting Bank of Japan monetary normalization.',
  },

  // ETFs
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    exchange: 'AMEX',
    category: 'etfs',
    price: 597.48,
    change: 2.86,
    changePercent: 0.48,
    volume: '48.2M',
    marketCap: '618.4B',
    sector: 'Broad Equity',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 603.85,
    low52w: 451.1,
    yieldOrAum: '$618.4B',
    badgeColor: '#089981',
    badgeText: 'SPY',
    sparkline: [592.1, 593.0, 593.6, 594.2, 595.0, 595.6, 596.3, 596.9, 597.48],
    description: 'World’s largest exchange-traded fund tracking the S&P 500 Index.',
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    exchange: 'NASDAQ',
    category: 'etfs',
    price: 506.92,
    change: 3.64,
    changePercent: 0.72,
    volume: '31.4M',
    marketCap: '308.2B',
    sector: 'Tech & Growth',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 515.44,
    low52w: 382.1,
    yieldOrAum: '$308.2B',
    badgeColor: '#2962FF',
    badgeText: 'QQQ',
    sparkline: [501.4, 502.2, 502.9, 503.6, 504.4, 505.0, 505.8, 506.4, 506.92],
    description: 'Exchange-traded fund tracking the Nasdaq-100 Index of top non-financial Nasdaq companies.',
  },
  {
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    exchange: 'AMEX',
    category: 'etfs',
    price: 243.18,
    change: 1.68,
    changePercent: 0.7,
    volume: '7.8M',
    marketCap: '74.2B',
    sector: 'Commodities',
    rating: 'Buy',
    currency: 'USD',
    decimals: 2,
    high52w: 257.71,
    low52w: 184.55,
    yieldOrAum: '$74.2B',
    badgeColor: '#D97706',
    badgeText: 'GLD',
    sparkline: [240.8, 241.2, 241.5, 241.9, 242.2, 242.4, 242.7, 243.0, 243.18],
    description: 'Physically backed gold bullion exchange-traded fund tracking spot gold prices.',
  },
  {
    symbol: 'TLT',
    name: 'iShares 20+ Year Treasury Bond ETF',
    exchange: 'NASDAQ',
    category: 'etfs',
    price: 92.84,
    change: 0.86,
    changePercent: 0.94,
    volume: '36.9M',
    marketCap: '61.5B',
    sector: 'Fixed Income',
    rating: 'Neutral',
    currency: 'USD',
    decimals: 2,
    high52w: 101.64,
    low52w: 85.08,
    yieldOrAum: '$61.5B',
    badgeColor: '#475569',
    badgeText: 'TLT',
    sparkline: [91.4, 91.6, 91.8, 92.0, 92.15, 92.35, 92.5, 92.7, 92.84],
    description: 'Tracks an index composed of US Treasury bonds with remaining maturities greater than 20 years.',
  },
  {
    symbol: 'IBIT',
    name: 'iShares Bitcoin Trust ETF',
    exchange: 'NASDAQ',
    category: 'etfs',
    price: 53.94,
    change: 1.24,
    changePercent: 2.35,
    volume: '41.2M',
    marketCap: '46.8B',
    sector: 'Digital Assets',
    rating: 'Strong buy',
    currency: 'USD',
    decimals: 2,
    high52w: 56.6,
    low52w: 22.02,
    yieldOrAum: '$46.8B',
    badgeColor: '#F7931A',
    badgeText: 'IB',
    sparkline: [52.1, 52.4, 52.7, 52.9, 53.1, 53.4, 53.6, 53.8, 53.94],
    description: 'Spot Bitcoin exchange-traded product providing institutional-grade access to Bitcoin performance.',
  },
];

export const SUMMARY_GROUPS: Record<AssetCategory, string[]> = {
  indices: ['SPX', 'NDX', 'DJI', 'RUT'],
  stocks: ['NVDA', 'AAPL', 'MSFT', 'TSLA'],
  crypto: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'XRPUSD'],
  futures: ['GC1!', 'CL1!', 'SI1!', 'NG1!'],
  forex: ['EURUSD', 'USDJPY', 'GBPUSD', 'DXY'],
  bonds: ['US10Y', 'US02Y', 'DE10Y', 'JP10Y'],
  etfs: ['SPY', 'QQQ', 'GLD', 'TLT'],
};

export const HEATMAP_TILES: HeatmapTile[] = [
  { symbol: 'NVDA', name: 'NVIDIA', sector: 'Technology', weight: 30, price: 146.84, changePercent: 2.93, marketCap: '$3.60T' },
  { symbol: 'AAPL', name: 'Apple', sector: 'Technology', weight: 29, price: 234.72, changePercent: 0.66, marketCap: '$3.55T' },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Technology', weight: 26, price: 426.18, changePercent: 0.74, marketCap: '$3.17T' },
  { symbol: 'PLTR', name: 'Palantir', sector: 'Technology', weight: 10, price: 64.85, changePercent: 6.12, marketCap: '$147.8B' },
  { symbol: 'SMCI', name: 'Super Micro', sector: 'Technology', weight: 7, price: 31.42, changePercent: -6.49, marketCap: '$18.4B' },

  { symbol: 'AMZN', name: 'Amazon', sector: 'Consumer Cyclical', weight: 22, price: 209.45, changePercent: 1.38, marketCap: '$2.20T' },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Consumer Cyclical', weight: 16, price: 342.68, changePercent: 3.92, marketCap: '$1.10T' },

  { symbol: 'GOOGL', name: 'Alphabet', sector: 'Communication', weight: 20, price: 176.34, changePercent: -0.63, marketCap: '$2.16T' },
  { symbol: 'META', name: 'Meta', sector: 'Communication', weight: 16, price: 591.2, changePercent: 1.28, marketCap: '$1.49T' },

  { symbol: 'JPM', name: 'JPMorgan', sector: 'Financial', weight: 14, price: 245.16, changePercent: 0.76, marketCap: '$692.4B' },
  { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', weight: 14, price: 786.4, changePercent: -1.77, marketCap: '$746.1B' },
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', weight: 12, price: 118.92, changePercent: -0.78, marketCap: '$524.8B' },
];

export const TRADE_IDEAS: TradeIdea[] = [
  {
    id: 'idea-1',
    symbol: 'SPX',
    title: 'S&P 500 Ascending Channel Breakout — Watching 6,050 Liquidity Zone',
    summary:
      'Index continues respecting the 20-day EMA trendline support after consolidating above 5,920. Momentum oscillators confirm steady institutional accumulation into year-end.',
    author: 'QuantMacroLab',
    timeframe: '4H',
    direction: 'Long',
    publishedAt: '2 hours ago',
    likes: 348,
    comments: 42,
    chartPoints: [5860, 5885, 5872, 5905, 5920, 5912, 5944, 5960, 5954, 5984],
  },
  {
    id: 'idea-2',
    symbol: 'BTCUSD',
    title: 'Bitcoin Reclaims $94K Range Midpoint Ahead of $100K Psychological Test',
    summary:
      'Higher lows on the 4-hour structure with declining exchange reserves. A clean daily close above $96,200 opens room for price discovery above six figures.',
    author: 'AtlasOrderflow',
    timeframe: '1D',
    direction: 'Long',
    publishedAt: '4 hours ago',
    likes: 612,
    comments: 89,
    chartPoints: [87200, 88400, 89100, 88700, 90500, 91800, 92400, 93200, 94100, 94820],
  },
  {
    id: 'idea-3',
    symbol: 'CL1!',
    title: 'WTI Crude Oil Facing Supply Resistance Near $71.50 Trendline',
    summary:
      'Crude remains capped under its descending 50-day moving average as global inventory builds offset seasonal demand. Watching $67.80 support shelf.',
    author: 'EnergyDeskFX',
    timeframe: '1D',
    direction: 'Short',
    publishedAt: '6 hours ago',
    likes: 184,
    comments: 27,
    chartPoints: [72.4, 71.9, 72.1, 71.3, 70.8, 70.5, 70.1, 69.8, 69.4, 69.12],
  },
];

export const MARKET_NEWS: MarketNewsItem[] = [
  {
    id: 'news-1',
    headline: 'S&P 500 and Nasdaq push higher as semiconductor leaders extend weekly gains',
    source: 'Reuters Markets',
    timeAgo: '18m ago',
    category: 'US Equities',
    relatedSymbol: 'SPX',
  },
  {
    id: 'news-2',
    headline: 'Treasury 10-year yield slips below 4.27% following steady core PCE inflation print',
    source: 'Bloomberg',
    timeAgo: '44m ago',
    category: 'Rates & Bonds',
    relatedSymbol: 'US10Y',
  },
  {
    id: 'news-3',
    headline: 'Bitcoin spot ETF inflows top $640M in single session as BTC holds above $94,500',
    source: 'CoinDesk',
    timeAgo: '1h ago',
    category: 'Crypto',
    relatedSymbol: 'BTCUSD',
  },
  {
    id: 'news-4',
    headline: 'Gold climbs 0.7% to $2,634/oz on softer US dollar index and central bank demand',
    source: 'MarketWatch',
    timeAgo: '2h ago',
    category: 'Commodities',
    relatedSymbol: 'GC1!',
  },
  {
    id: 'news-5',
    headline: 'USD/JPY eases toward 153.60 as Tokyo CPI surprises modestly above consensus',
    source: 'FXStreet',
    timeAgo: '3h ago',
    category: 'Currencies',
    relatedSymbol: 'USDJPY',
  },
  {
    id: 'news-6',
    headline: 'European equities trade firmer led by German industrials and software exporters',
    source: 'Financial Times',
    timeAgo: '5h ago',
    category: 'Global Indices',
    relatedSymbol: 'DAX',
  },
];

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'eco-1',
    time: '08:30',
    date: 'Today',
    country: 'United States',
    currency: 'USD',
    event: 'Core PCE Price Index (MoM)',
    impact: 3,
    actual: '0.3%',
    forecast: '0.3%',
    prior: '0.3%',
  },
  {
    id: 'eco-2',
    time: '08:30',
    date: 'Today',
    country: 'United States',
    currency: 'USD',
    event: 'GDP Growth Rate QoQ (2nd Est)',
    impact: 3,
    actual: '2.8%',
    forecast: '2.8%',
    prior: '3.0%',
  },
  {
    id: 'eco-3',
    time: '10:00',
    date: 'Today',
    country: 'United States',
    currency: 'USD',
    event: 'Pending Home Sales (MoM)',
    impact: 2,
    actual: '2.0%',
    forecast: '-0.8%',
    prior: '7.4%',
  },
  {
    id: 'eco-4',
    time: '05:00',
    date: 'Tomorrow',
    country: 'Euro Area',
    currency: 'EUR',
    event: 'Harmonized CPI Flash (YoY)',
    impact: 3,
    actual: '—',
    forecast: '2.3%',
    prior: '2.0%',
  },
  {
    id: 'eco-5',
    time: '08:30',
    date: 'Fri',
    country: 'Canada',
    currency: 'CAD',
    event: 'GDP Annualized (QoQ)',
    impact: 2,
    actual: '—',
    forecast: '1.1%',
    prior: '2.1%',
  },
  {
    id: 'eco-6',
    time: '19:30',
    date: 'Fri',
    country: 'Japan',
    currency: 'JPY',
    event: 'Tokyo Core CPI (YoY)',
    impact: 3,
    actual: '—',
    forecast: '2.1%',
    prior: '1.8%',
  },
];

// Deterministic pseudo-random generator for reproducible OHLCV series per symbol + range
function seededRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function generateCandleSeries(
  instrument: MarketInstrument,
  range: ChartRange
): CandlePoint[] {
  const countMap: Record<ChartRange, number> = {
    '1D': 48,
    '1M': 30,
    '3M': 45,
    '1Y': 52,
    '5Y': 60,
    All: 64,
  };

  const volScaleMap: Record<ChartRange, number> = {
    '1D': 0.0028,
    '1M': 0.009,
    '3M': 0.015,
    '1Y': 0.025,
    '5Y': 0.045,
    All: 0.06,
  };

  const count = countMap[range];
  const stepVol = volScaleMap[range];
  const seedBase =
    instrument.symbol.split('').reduce((acc, ch) => acc + ch.charCodeAt(0) * 31, 0) +
    range.charCodeAt(0) * 97;
  const rand = seededRandom(seedBase);

  const endPrice = instrument.price;
  const targetChangePct =
    range === '1D'
      ? instrument.changePercent / 100
      : (instrument.changePercent >= 0 ? 1 : -1) *
        (range === '1M'
          ? 0.038
          : range === '3M'
            ? 0.095
            : range === '1Y'
              ? 0.24
              : range === '5Y'
                ? 0.72
                : 1.35);

  const startPrice = endPrice / (1 + targetChangePct);
  const points: CandlePoint[] = [];

  // Build random walk that smoothly anchors to startPrice -> endPrice
  const rawCloses: number[] = [];
  let cursor = startPrice;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const drift = (endPrice - cursor) / Math.max(1, count - i);
    const noise = (rand() - 0.48) * cursor * stepVol;
    cursor = Math.max(0.0001, cursor + drift * 0.65 + noise * (1 - t * 0.45));
    rawCloses.push(cursor);
  }
  rawCloses[0] = startPrice;
  rawCloses[count - 1] = endPrice;

  for (let i = 0; i < count; i++) {
    const close = rawCloses[i];
    const prevClose = i === 0 ? startPrice * (1 - (rand() - 0.5) * 0.005) : rawCloses[i - 1];
    const open = prevClose;
    const wickSpread = Math.abs(close - open) + close * stepVol * (0.35 + rand() * 0.5);
    const high = Math.max(open, close) + wickSpread * (0.3 + rand() * 0.4);
    const low = Math.max(0.0001, Math.min(open, close) - wickSpread * (0.3 + rand() * 0.4));

    let label = '';
    if (range === '1D') {
      const totalMins = 9 * 60 + 30 + Math.round((i / (count - 1)) * 390);
      const hh = Math.floor(totalMins / 60);
      const mm = totalMins % 60;
      label = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    } else if (range === '1M') {
      const day = Math.max(1, 28 - (count - 1 - i));
      label = `Nov ${day}`;
    } else if (range === '3M') {
      const months = ['Sep', 'Oct', 'Nov'];
      const mIdx = Math.min(2, Math.floor((i / count) * 3));
      const d = ((i * 2) % 28) + 1;
      label = `${months[mIdx]} ${d}`;
    } else if (range === '1Y') {
      const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
      const mIdx = Math.min(11, Math.floor((i / count) * 12));
      label = `${months[mIdx]} '${mIdx === 0 ? '25' : '26'}`;
    } else if (range === '5Y') {
      const year = 2022 + Math.floor((i / count) * 5);
      label = `Q${(i % 4) + 1} ${year}`;
    } else {
      const year = 2016 + Math.floor((i / count) * 11);
      label = `${year}`;
    }

    points.push({
      time: label,
      open: Number(open.toFixed(instrument.decimals)),
      high: Number(high.toFixed(instrument.decimals)),
      low: Number(low.toFixed(instrument.decimals)),
      close: Number(close.toFixed(instrument.decimals)),
      volume: Math.round((0.6 + rand() * 1.4) * 1000000),
    });
  }

  return points;
}

export function formatInstrumentPrice(val: number, decimals: number, currency: string): string {
  const formatted = val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return currency === '%' ? `${formatted}%` : formatted;
}

export function formatChange(change: number, decimals: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(decimals)}`;
}

export function formatChangePercent(pct: number): string {
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}
