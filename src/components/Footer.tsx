import React from 'react';
import { ArrowUpRightIcon } from 'lucide-react';
import { BrandMark } from './BrandMark';
export function Footer() {
  const columns = [
  ['Product', 'Platform', 'Pipeline', 'Dashboard'],
  ['Developers', 'API Reference', 'Changelog', 'Status'],
  ['Company', 'About', 'Contact', 'Careers'],
  ['Legal', 'Privacy', 'Terms', 'Security']];

  return (
    <footer className="bg-[#123536] px-5 pb-6 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.45fr_2fr]">
          <div>
            <BrandMark inverse />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              FrameDock transforms raw video streams into real-time structured
              intelligence through distributed AI pipelines — built for
              enterprises that can't afford to leave video data unused.
            </p>
            <p className="mt-6 font-mono text-xs text-[#86d9c5]">
              Los Angeles, CA · founded 2024
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map(([heading, ...links]) =>
            <div key={heading}>
                <h2 className="mb-4 text-sm font-semibold">{heading}</h2>
                {links.map((link) =>
              <button
                onClick={() => alert(`${link} is being prepared.`)}
                key={link}
                className="mb-2 block text-left text-sm text-white/55 transition hover:text-[#92ebd4]">
                
                    {link}
                    <ArrowUpRightIcon className="ml-1 inline" size={11} />
                  </button>
              )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row">
          <p>© 2026 FrameDock AI Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#55e3ae] shadow-[0_0_10px_#55e3ae] animate-pulse" />{' '}
            All systems operational
          </p>
        </div>
      </div>
    </footer>);

}