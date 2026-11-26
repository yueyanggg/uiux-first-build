import React, { useState } from 'react';
import { HEATMAP_TILES, HeatmapTile, formatChangePercent } from '../data/marketsData';

interface SectorHeatmapProps {
  onSelectSymbol: (symbol: string) => void;
}

function getTileColor(changePercent: number): string {
  if (changePercent >= 3) return '#089981';
  if (changePercent >= 1) return '#0F8E78';
  if (changePercent > 0) return '#277F71';
  if (changePercent <= -3) return '#CC2936';
  if (changePercent <= -1) return '#D93442';
  return '#A8424B';
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({ onSelectSymbol }) => {
  const [hovered, setHovered] = useState<HeatmapTile | null>(null);

  const tech = HEATMAP_TILES.filter((t) => t.sector === 'Technology');
  const consumer = HEATMAP_TILES.filter((t) => t.sector === 'Consumer Cyclical');
  const comm = HEATMAP_TILES.filter((t) => t.sector === 'Communication');
  const others = HEATMAP_TILES.filter(
    (t) => !['Technology', 'Consumer Cyclical', 'Communication'].includes(t.sector)
  );

  const renderTile = (tile: HeatmapTile, className: string) => {
    const bg = getTileColor(tile.changePercent);
    return (
      <button
        key={tile.symbol}
        type="button"
        onClick={() => onSelectSymbol(tile.symbol)}
        onMouseEnter={() => setHovered(tile)}
        onMouseLeave={() => setHovered(null)}
        style={{ backgroundColor: bg }}
        className={`relative flex flex-col items-center justify-center p-2 text-white transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-[#2962FF] cursor-pointer overflow-hidden border border-white/20 dark:border-[#131722]/60 ${className}`}
      >
        <span className="font-bold text-xs sm:text-sm tracking-tight leading-tight">
          {tile.symbol}
        </span>
        <span className="font-mono text-[11px] tabular-nums opacity-95 mt-0.5">
          {formatChangePercent(tile.changePercent)}
        </span>
      </button>
    );
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#131722] dark:text-white">
            S&amp;P 500 Sector Map
          </h3>
          <p className="text-xs text-[#787B86]">
            Sized by market cap · Click any tile to open chart
          </p>
        </div>
        {hovered ? (
          <div className="text-xs font-mono tabular-nums text-[#131722] dark:text-[#D1D4DC]">
            <span className="font-semibold">{hovered.name}</span> ({hovered.symbol}) · $
            {hovered.price.toFixed(2)} ·{' '}
            <span
              className={
                hovered.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
              }
            >
              {formatChangePercent(hovered.changePercent)}
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#787B86] font-mono">
            <span>-3%</span>
            <span className="inline-flex h-2 w-20 rounded-sm overflow-hidden">
              <span className="flex-1 bg-[#CC2936]" />
              <span className="flex-1 bg-[#A8424B]" />
              <span className="flex-1 bg-[#277F71]" />
              <span className="flex-1 bg-[#089981]" />
            </span>
            <span>+3%</span>
          </div>
        )}
      </div>

      {/* Treemap Grid */}
      <div className="grid grid-cols-12 gap-1 flex-1 min-h-[270px] rounded-lg overflow-hidden border border-[#E0E3EB] dark:border-[#2A2E39] bg-[#E0E3EB] dark:bg-[#2A2E39]">
        {/* Technology Column (Left 7 cols) */}
        <div className="col-span-7 flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-1 flex-[2]">
            {renderTile(tech[0], 'min-h-[110px]')}
            {renderTile(tech[1], 'min-h-[110px]')}
          </div>
          <div className="grid grid-cols-12 gap-1 flex-1">
            {renderTile(tech[2], 'col-span-6 min-h-[82px]')}
            {renderTile(tech[3], 'col-span-4 min-h-[82px]')}
            {renderTile(tech[4], 'col-span-2 min-h-[82px]')}
          </div>
        </div>

        {/* Right 5 cols: Consumer Cyclical, Communication & Others */}
        <div className="col-span-5 flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-1 flex-1">
            {renderTile(consumer[0], 'min-h-[95px]')}
            {renderTile(consumer[1], 'min-h-[95px]')}
          </div>
          <div className="grid grid-cols-2 gap-1 flex-1">
            {renderTile(comm[0], 'min-h-[85px]')}
            {renderTile(comm[1], 'min-h-[85px]')}
          </div>
          <div className="grid grid-cols-3 gap-1 flex-[0.85]">
            {others.map((tile) => renderTile(tile, 'min-h-[68px]'))}
          </div>
        </div>
      </div>
    </div>
  );
};
