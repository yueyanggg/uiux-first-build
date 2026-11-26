import React, { useMemo, useState, useId } from 'react';
import {
  CandlePoint,
  ChartRange,
  MarketInstrument,
  formatInstrumentPrice,
} from '../data/marketsData';

interface InteractiveChartProps {
  instrument: MarketInstrument;
  data: CandlePoint[];
  range: ChartRange;
  chartType: 'area' | 'candles';
  showMA?: boolean;
  height?: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  instrument,
  data,
  chartType,
  showMA = false,
  height = 320,
}) => {
  const gradId = useId();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 900;
  const padLeft = 10;
  const padRight = 72;
  const padTop = 18;
  const padBottom = 28;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const { minVal, maxVal, maSeries } = useMemo(() => {
    if (data.length === 0) {
      return { minVal: 0, maxVal: 1, maSeries: [] as number[] };
    }
    let min = Infinity;
    let max = -Infinity;
    for (const d of data) {
      const lo = chartType === 'candles' ? d.low : d.close;
      const hi = chartType === 'candles' ? d.high : d.close;
      if (lo < min) min = lo;
      if (hi > max) max = hi;
    }
    const padding = (max - min) * 0.08 || max * 0.01 || 1;
    const ma: number[] = [];
    const windowSize = 7;
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const slice = data.slice(start, i + 1);
      const avg = slice.reduce((sum, p) => sum + p.close, 0) / slice.length;
      ma.push(avg);
    }
    return {
      minVal: min - padding,
      maxVal: max + padding,
      maSeries: ma,
    };
  }, [data, chartType]);

  if (data.length === 0) return null;

  const valueSpan = maxVal - minVal || 1;
  const xForIndex = (i: number) =>
    padLeft + (i / Math.max(1, data.length - 1)) * plotW;
  const yForValue = (v: number) =>
    padTop + ((maxVal - v) / valueSpan) * plotH;

  const isPositive = data[data.length - 1].close >= data[0].open;
  const accentColor = isPositive ? '#089981' : '#F23645';

  // Grid ticks (5 horizontal price lines)
  const yTicks = Array.from({ length: 5 }, (_, idx) => {
    const ratio = idx / 4;
    const val = maxVal - ratio * valueSpan;
    const y = padTop + ratio * plotH;
    return { val, y };
  });

  // X-axis label indices
  const xTickCount = 6;
  const xTicks = Array.from({ length: xTickCount }, (_, idx) => {
    const i = Math.round((idx / (xTickCount - 1)) * (data.length - 1));
    return { i, label: data[i].time, x: xForIndex(i) };
  });

  // Area path
  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i).toFixed(1)} ${yForValue(d.close).toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${xForIndex(data.length - 1).toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${xForIndex(0).toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  // MA line path
  const maPath = maSeries
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i).toFixed(1)} ${yForValue(v).toFixed(1)}`)
    .join(' ');

  const activePoint = hoverIdx !== null ? data[hoverIdx] : data[data.length - 1];
  const activeX = hoverIdx !== null ? xForIndex(hoverIdx) : null;
  const activeY = hoverIdx !== null ? yForValue(activePoint.close) : null;

  const candleWidth = Math.max(3, Math.min(11, (plotW / data.length) * 0.62));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    if (relX < padLeft || relX > padLeft + plotW) {
      setHoverIdx(null);
      return;
    }
    const idx = Math.round(((relX - padLeft) / plotW) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <div className="relative w-full select-none">
      {/* Live / Hovered OHLCV Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 text-xs font-mono tabular-nums text-[#787B86]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-[#131722] dark:text-[#D1D4DC]">
            {instrument.symbol}
          </span>
          <span>
            O{' '}
            <span className="text-[#131722] dark:text-[#D1D4DC]">
              {activePoint.open.toFixed(instrument.decimals)}
            </span>
          </span>
          <span>
            H{' '}
            <span className="text-[#089981]">
              {activePoint.high.toFixed(instrument.decimals)}
            </span>
          </span>
          <span>
            L{' '}
            <span className="text-[#F23645]">
              {activePoint.low.toFixed(instrument.decimals)}
            </span>
          </span>
          <span>
            C{' '}
            <span className="text-[#131722] dark:text-[#D1D4DC]">
              {activePoint.close.toFixed(instrument.decimals)}
            </span>
          </span>
          <span className="hidden sm:inline">{activePoint.time}</span>
        </div>
        {showMA && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#2962FF]">
            <span className="inline-block w-3 h-0.5 bg-[#2962FF]" />
            <span>MA(7)</span>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto block cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
        role="img"
        aria-label={`${instrument.name} price chart`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.24" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines & Right Price Axis */}
        {yTicks.map((tick, idx) => (
          <g key={idx}>
            <line
              x1={padLeft}
              y1={tick.y}
              x2={padLeft + plotW}
              y2={tick.y}
              stroke="currentColor"
              strokeDasharray="2 3"
              className="text-[#E0E3EB] dark:text-[#2A2E39]"
            />
            <text
              x={padLeft + plotW + 8}
              y={tick.y + 3.5}
              fontSize="11"
              className="fill-[#787B86] font-mono tabular-nums"
            >
              {formatInstrumentPrice(tick.val, instrument.decimals, instrument.currency)}
            </text>
          </g>
        ))}

        {/* Bottom Time Axis */}
        {xTicks.map((t, idx) => (
          <text
            key={idx}
            x={t.x}
            y={height - 6}
            textAnchor={idx === 0 ? 'start' : idx === xTicks.length - 1 ? 'end' : 'middle'}
            fontSize="11"
            className="fill-[#787B86] font-mono"
          >
            {t.label}
          </text>
        ))}

        {/* Series: Area or Candles */}
        {chartType === 'area' ? (
          <>
            <path d={areaPath} fill={`url(#${gradId})`} />
            <path
              d={linePath}
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        ) : (
          <g>
            {data.map((d, i) => {
              const cx = xForIndex(i);
              const isBull = d.close >= d.open;
              const col = isBull ? '#089981' : '#F23645';
              const yHigh = yForValue(d.high);
              const yLow = yForValue(d.low);
              const yOpen = yForValue(d.open);
              const yClose = yForValue(d.close);
              const rectY = Math.min(yOpen, yClose);
              const rectH = Math.max(1.5, Math.abs(yClose - yOpen));
              return (
                <g key={i}>
                  <line
                    x1={cx}
                    y1={yHigh}
                    x2={cx}
                    y2={yLow}
                    stroke={col}
                    strokeWidth="1.2"
                  />
                  <rect
                    x={cx - candleWidth / 2}
                    y={rectY}
                    width={candleWidth}
                    height={rectH}
                    fill={col}
                    rx="0.5"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Optional Moving Average Line */}
        {showMA && (
          <path
            d={maPath}
            fill="none"
            stroke="#2962FF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        )}

        {/* Latest Price Marker Tag on Right Axis */}
        {(() => {
          const lastY = yForValue(data[data.length - 1].close);
          return (
            <g>
              <line
                x1={padLeft}
                y1={lastY}
                x2={padLeft + plotW}
                y2={lastY}
                stroke={accentColor}
                strokeDasharray="3 3"
                strokeOpacity="0.6"
              />
              <rect
                x={padLeft + plotW + 2}
                y={lastY - 10}
                width={66}
                height={20}
                rx="3"
                fill={accentColor}
              />
              <text
                x={padLeft + plotW + 35}
                y={lastY + 3.5}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="600"
                className="fill-white font-mono tabular-nums"
              >
                {data[data.length - 1].close.toFixed(instrument.decimals)}
              </text>
            </g>
          );
        })()}

        {/* Crosshair */}
        {activeX !== null && activeY !== null && (
          <g>
            <line
              x1={activeX}
              y1={padTop}
              x2={activeX}
              y2={padTop + plotH}
              stroke="#787B86"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <line
              x1={padLeft}
              y1={activeY}
              x2={padLeft + plotW}
              y2={activeY}
              stroke="#787B86"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <circle
              cx={activeX}
              cy={activeY}
              r="4.5"
              fill={accentColor}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {/* Crosshair Price Pill on Right Axis */}
            <rect
              x={padLeft + plotW + 2}
              y={activeY - 10}
              width={66}
              height={20}
              rx="3"
              fill="#131722"
            />
            <text
              x={padLeft + plotW + 35}
              y={activeY + 3.5}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="600"
              className="fill-white font-mono tabular-nums"
            >
              {activePoint.close.toFixed(instrument.decimals)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
