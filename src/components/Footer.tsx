import React from 'react';
import { ArrowUpRightIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrandMark } from './BrandMark';

type SocialLink = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const LinkedInIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.5h2.88V18H5.5zM10.5 9.5h2.76v1.16h.04c.38-.72 1.32-1.48 2.71-1.48 2.9 0 3.43 1.91 3.43 4.39V18h-2.88v-7.47c0-1.78-.03-4.07-2.48-4.07-2.49 0-2.87 1.94-2.87 3.94V18H10.5z" />
  </svg>
);

const XIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.9 2H22l-6.7 7.7L23.5 22h-6.1l-4.8-6.3L6.8 22H3.7l7.2-8.2L.5 2h6.2l4.4 5.8L18.9 2Zm-1.1 18h1.2L6.3 4H5L17.8 20Z" />
  </svg>
);

const FacebookIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 22v-9h3l.5-3.5h-3.5V4.8c0-1 .3-1.7 1.7-1.7h1.8V.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.7V9.5H6.5V13h3v9h4Z" />
  </svg>
);

const YouTubeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.7 12 4.7 12 4.7s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2A29.5 29.5 0 0 0 2 12a29.5 29.5 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2A29.5 29.5 0 0 0 22 12a29.5 29.5 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
  </svg>
);

const MediumIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7 6h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm1 2v8h8V8H8Zm1 1h6v6H9V9Zm1 1v4h4v-4h-4Z" />
  </svg>
);

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const columns = [
    ['Product', 'Platform', 'Pipeline', 'Pricing'],
    ['Company', 'About', 'Contact', 'Careers'],
    ['Legal', 'Privacy', 'Terms']
  ];

  const socialLinks: SocialLink[] = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/framedock/', icon: LinkedInIcon },
    { label: 'X', href: 'https://x.com/FrameDock_AI', icon: XIcon },
    { label: 'Facebook', href: 'https://www.facebook.com/framedockAI/', icon: FacebookIcon },
    { label: 'YouTube', href: 'https://www.youtube.com/@FrameDock-AI', icon: YouTubeIcon },
    { label: 'Medium', href: 'https://medium.com/@FrameDock', icon: MediumIcon }
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }

    return false;
  };

  const handleLinkClick = (label: string) => {
    if (label === 'Privacy') {
      navigate('/privacy');
      return;
    }

    if (label === 'Terms') {
      navigate('/terms');
      return;
    }

    if (label === 'Platform') {
      if (location.pathname === '/') {
        scrollToSection('product');
      } else {
        navigate('/');
        setTimeout(() => {
          scrollToSection('product');
        }, 150);
      }
      return;
    }

    if (label === 'Pipeline') {
      if (location.pathname === '/') {
        scrollToSection('pipeline');
      } else {
        navigate('/');
        setTimeout(() => {
          scrollToSection('pipeline');
        }, 150);
      }
      return;
    }

    if (label === 'Pricing') {
      if (location.pathname === '/') {
        scrollToSection('pricing');
      } else {
        navigate('/');
        setTimeout(() => {
          scrollToSection('pricing');
        }, 150);
      }
      return;
    }

    if (label === 'About' || label === 'Contact' || label === 'Careers') {
      if (location.pathname === '/') {
        scrollToSection('contact');
      } else {
        navigate('/');
        setTimeout(() => {
          scrollToSection('contact');
        }, 150);
      }
      return;
    }

    alert(`${label} is being prepared.`);
  };

  return (
    <footer className="bg-[#123536] px-5 pb-6 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.45fr_2fr]">
          <div>
            <BrandMark inverse />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              FrameDock transforms raw video streams into real time structured intelligence through distributed intelligence pipelines, built for enterprises that can't afford to leave video data unused.
            </p>
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Follow us
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#92ebd4] hover:bg-[#92ebd4]/10 hover:text-[#92ebd4]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <p className="mt-6 font-mono text-xs text-[#86d9c5]">
              Los Angeles, CA · founded 2024
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map(([heading, ...links]) => (
              <div key={heading}>
                <h2 className="mb-4 text-sm font-semibold">{heading}</h2>
                {links.map((link) => (
                  <button
                    onClick={() => handleLinkClick(link)}
                    key={link}
                    className="mb-2 block text-left text-sm text-white/55 transition hover:text-[#92ebd4]"
                  >
                    {link}
                    <ArrowUpRightIcon className="ml-1 inline" size={11} />
                  </button>
                ))}
              </div>
            ))}
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
    </footer>
  );
}