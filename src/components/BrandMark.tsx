import React from 'react';
type BrandMarkProps = {
  compact?: boolean;
  inverse?: boolean;
};
export function BrandMark({
  compact = false,
  inverse = false
}: BrandMarkProps) {
  return (
    <div className="flex items-center gap-2.5" aria-label="FrameDock">
      <div className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-[10px] border border-white/70 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_8px_20px_rgba(21,79,72,.12)]">
        <span className="absolute h-3.5 w-3.5 rounded-[4px] border-[3px] border-[#173a3b] rotate-45" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-[#37d8b4]" />
      </div>
      {!compact &&
      <span
        className={`text-[17px] font-bold tracking-[-0.06em] ${inverse ? 'text-white' : 'text-[#122e31]'}`}>
        
          FrameDock
        </span>
      }
    </div>);

}