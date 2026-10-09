import React, { useMemo } from 'react';
import { PageSettings } from '../types';
import { PAPER_DIMENSIONS } from '../types/defaults';

interface RulerProps {
  pageSettings: PageSettings;
  zoom: number;
}

export const Ruler: React.FC<RulerProps> = ({ pageSettings, zoom }) => {
  const paper = PAPER_DIMENSIONS[pageSettings.size as import('../types').PaperSize] || PAPER_DIMENSIONS.A4;
  const isLandscape = pageSettings.orientation === 'landscape';
  const widthMm = isLandscape ? paper.height : paper.width;

  // Generate tick marks across width (every 10mm = 1cm)
  const ticks = useMemo(() => {
    const list: { posMm: number; label?: number }[] = [];
    const count = Math.floor(widthMm / 10);
    for (let i = 0; i <= count; i++) {
      list.push({
        posMm: i * 10,
        label: i > 0 ? i : undefined,
      });
    }
    return list;
  }, [widthMm]);

  const leftMarginPercent = (pageSettings.margins.left / widthMm) * 100;
  const rightMarginPercent = ((widthMm - pageSettings.margins.right) / widthMm) * 100;

  return (
    <div className="wordlite-ruler-bar">
      <div
        className="wordlite-ruler-track"
        style={{
          width: `${widthMm}mm`,
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Margin Shaded Regions */}
        <div
          className="ruler-margin-shade left-shade"
          style={{ width: `${leftMarginPercent}%` }}
        />
        <div
          className="ruler-white-area"
          style={{
            left: `${leftMarginPercent}%`,
            width: `${rightMarginPercent - leftMarginPercent}%`,
          }}
        />
        <div
          className="ruler-margin-shade right-shade"
          style={{ left: `${rightMarginPercent}%`, right: 0 }}
        />

        {/* Margin Pointers */}
        <div
          className="ruler-marker left-marker"
          style={{ left: `${leftMarginPercent}%` }}
          title={`Left margin: ${pageSettings.margins.left} mm`}
        />
        <div
          className="ruler-marker right-marker"
          style={{ left: `${rightMarginPercent}%` }}
          title={`Right margin: ${pageSettings.margins.right} mm`}
        />

        {/* Ticks */}
        {ticks.map((t) => (
          <div
            key={t.posMm}
            className="ruler-tick"
            style={{ left: `${(t.posMm / widthMm) * 100}%` }}
          >
            {t.label !== undefined && <span className="ruler-tick-label">{t.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
