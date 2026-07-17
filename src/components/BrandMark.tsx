import React from 'react';
import logoSvg from '../Assets/logo.svg';

type BrandMarkProps = {
  compact?: boolean;
  inverse?: boolean;
};

export function BrandMark({
  compact = false,
  inverse = false
}: BrandMarkProps) {
  return (
    <div className="flex items-center gap-2.5" aria-label="FrameDock.V1">
      <img
        src={logoSvg}
        alt="FrameDock.V1"
        className={compact ? 'h-9 w-auto max-w-[140px] object-contain' : 'h-12 w-auto max-w-[220px] object-contain'}
      />
    </div>
  );
}