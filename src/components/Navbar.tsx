import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon, ArrowUpRightIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandMark } from './BrandMark';
type NavbarProps = {
  onDocs?: () => void;
  ctaLabel?: string;
  ctaHref?: string;
};
export function Navbar({ onDocs, ctaLabel = 'Launch Dashboard', ctaHref = '/dashboard' }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('product');
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';

  const scroll = (id: string) => {
    setOpen(false);
    setActiveSection(id);
    if (isDashboard) {
      navigate(`/#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
    }
  }, [location.hash]);

  const navItems = [
  {
    id: 'product',
    label: 'Product',
    action: () => scroll('product')
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    action: () => scroll('pipeline')
  },
  {
    id: 'pricing',
    label: 'Pricing',
    action: () => scroll('pricing')
  },
  {
    id: 'contact',
    label: 'Contact Us',
    action: () => scroll('contact')
  }
];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-xl ${isDashboard ? 'border-white/10 bg-[#102827]/80 text-white' : 'border-white/70 bg-white/50 text-[#163437] shadow-[0_14px_40px_rgba(31,73,68,.08)]'}`}>
        
        <Link
          to="/"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20b896] rounded-lg">
          <BrandMark inverse={isDashboard} />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) =>
          <button
            key={item.label}
            onClick={item.action}
            className={`group flex items-center gap-1 text-sm font-medium transition-colors ${activeSection === item.id ? (isDashboard ? 'text-white' : 'text-[#0f7871]') : (isDashboard ? 'text-white/70 hover:text-white' : 'text-[#305253] hover:text-[#0f7871]')}`}>
            
              {item.label}
              {item.coming &&
            <span className="rounded-full border border-[#76cbb9]/60 bg-[#d9f8ed]/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[.08em] text-[#197f6f]">
                  Soon
                </span>
            }
            </button>
          )}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#173d3d] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(16,61,57,.22)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27b99d]">
            
            {ctaLabel} <ArrowUpRightIcon size={14} />
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/40 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27b99d]">
          
          {open ? <XIcon size={19} /> : <MenuIcon size={19} />}
        </button>
      </nav>
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
            scale: 0.98
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.98
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 28
          }}
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/80 bg-[#eef8f3]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
          
            {navItems.map((item, index) =>
          <motion.button
            key={item.label}
            initial={{
              opacity: 0,
              x: -8
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: index * 0.05
            }}
            onClick={item.action}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold ${activeSection === item.id ? 'bg-[#173d3d] text-white shadow-sm' : 'text-[#173d3d] hover:bg-white/70'}`}>
            
                {item.label}
                {item.coming &&
            <span className="text-xs text-[#138371]">Coming soon</span>
            }
              </motion.button>
          )}
            <Link
            onClick={() => setOpen(false)}
            to={ctaHref}
            className="mt-2 block rounded-xl bg-[#173d3d] px-4 py-3 text-center text-sm font-semibold text-white">
            
              {ctaLabel}
            </Link>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}