import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import sectionFourIllustration from '../Assets/4.svg';
import sectionSixIllustration from '../Assets/6.svg';
import { ShieldCheckIcon, TruckIcon, FactoryIcon, MapPinIcon, ArrowRightIcon, CheckIcon, SparklesIcon, ActivityIcon, RocketIcon } from 'lucide-react';

const revealUp = {
  hidden: { opacity: 0, y: 34, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }
};
const revealLeft = {
  hidden: { opacity: 0, x: -46, filter: 'blur(8px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};
const revealRight = {
  hidden: { opacity: 0, x: 46, filter: 'blur(8px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};
const revealScale = {
  hidden: { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export function ProductPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0]);

  return (
    <div className="w-full overflow-hidden bg-[#f8faf5] text-[#153335]">
      <Navbar ctaLabel="FrameDock.V1" ctaHref="/dashboard" />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative flex min-h-[700px] flex-col overflow-hidden px-5 pb-10 pt-28 sm:px-8 lg:min-h-[800px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,1)_0%,rgba(238,240,250,1)_45%,rgba(226,229,247,1)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl text-center">
          <motion.div initial="hidden" animate="visible" variants={revealUp} style={{ y: headingY }}>
            <p className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/50 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[.2em] text-[#20b896] backdrop-blur-md">
              <SparklesIcon size={12} /> Operational Intelligence, Without Blind Spots
            </p>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[0.98] tracking-[-.065em] text-[#153335] sm:text-6xl lg:text-7xl">
              FrameDock.V1: The Video Intelligence Platform for Enterprise Operations
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#5b5f75] sm:text-lg">
              Turn raw camera feeds into structured insights — detect incidents in milliseconds, route them to the right teams, and act on visual data at enterprise scale.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="https://framedock.one/#/dashboard"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#20b896] to-[#198a75] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_15px_28px_rgba(32,184,150,.3)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20b896]"
              >
                Launch FrameDock.V1{' '}
                <ArrowRightIcon size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 bg-white/50 px-6 py-3.5 text-sm font-semibold text-[#153335] backdrop-blur-md transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20b896]"
              >
                View pricing
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex-1" />
      </section>

      {/* PROBLEM — BUILT FOR OPERATIONAL OUTCOMES */}
      <section className="relative overflow-hidden bg-[#f8faf5] px-5 py-24 sm:px-8">
        <img src={sectionFourIllustration} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-30" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealLeft} className="relative z-10 mx-auto max-w-7xl">
          <p className="eyebrow">The Operational Gap</p>
          <h2 className="section-title max-w-2xl">
            Video is your richest source of operational truth. It's also the hardest to use.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#5b5f75]">
            Across logistics hubs, factory floors, and city infrastructure, we see six recurring failure modes. FrameDock was built to close them all at once.
          </p>

          <div className="mt-12 grid auto-rows-[minmax(170px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Delayed incident response', d: 'Issues discovered in review, not the moment they unfold.', span: 'lg:col-span-2 lg:row-span-2 sm:row-span-2' },
              { t: 'Manual monitoring costs', d: 'Teams watching walls of feeds for the one critical moment.', span: '' },
              { t: 'No unified video layer', d: 'Every team stores and queries a different copy of footage.', span: '' },
              { t: 'Scale breaks brittle scripts', d: 'Proof-of-concept pipelines collapse at enterprise volume.', span: '' },
              { t: 'Missed business signals', d: 'Patterns in your video never surface to decision-makers.', span: '' },
              { t: 'Blind spots in safety protocols', d: 'Security incidents missed because nobody was watching.', span: 'lg:col-span-2' }
            ].map((item, i) => (
              <SpotlightCard key={item.t} delay={(i % 3) * 0.08} dir={i % 2 === 0 ? 'left' : 'right'} className={item.span}>
                <span className="font-mono text-xs text-[#20b896]">0{i + 1}</span>
                <h3 className="mt-6 text-lg font-semibold tracking-[-.03em]">{item.t}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5b5f75]">{item.d}</p>
              </SpotlightCard>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SOLUTION — FOUR CORE CAPABILITIES */}
      <section className="relative overflow-hidden bg-[#eef0fa] px-5 py-24 sm:px-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>
            <p className="eyebrow">One intelligent flow</p>
            <h2 className="section-title max-w-2xl">
              From every frame to the insight that moves your business.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#5b5f75]">
              Five layers, one continuous pipeline. Nothing hands off to a queue and waits — data keeps moving from ingestion to insight in the same live path.
            </p>
            <div className="mt-12">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <SolutionCard
                  title="Video Ingestion Engine"
                  body="Connect RTSP, ONVIF, cloud archives, and live sources into a single observability plane — no agents to install at the edge."
                  fact="Processes 2.4M frames per hour with hardware-accelerated decoding via NVIDIA Video Codec SDK."
                />
                <SolutionCard
                  title="Smart Video Processing Layer"
                  body="Run vision models where they make sense, scaled across your infrastructure with automatic load balancing."
                  fact="Real-time analytics powered by NVIDIA DeepStream SDK keep latency under 82ms end-to-end."
                />
                <SolutionCard
                  title="Real-Time Event Detection"
                  body="Surface critical moments the moment they happen, then route them to Slack, webhooks, or your data warehouse."
                  fact="98.7% detection accuracy with NVIDIA CV-CUDA-accelerated preprocessing."
                />
                <SolutionCard
                  title="Domain-Specific Customization"
                  body="Train models on your specific environments — warehouse layouts, production line variants, traffic patterns."
                  fact="Built on NVIDIA TAO Toolkit — adapt to your unique operational context without ML expertise."
                />
              </div>
              <Link to="https://framedock.one/#/dashboard" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#20b896] to-[#198a75] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_15px_28px_rgba(32,184,150,.3)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20b896]">
                Launch FrameDock.V1{' '}
                <ArrowRightIcon size={16} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* USE CASES — OPERATIONAL OUTCOMES */}
      <section className="relative overflow-hidden bg-[#f8faf5] px-5 py-24 sm:px-8">
        <img src={sectionSixIllustration} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-25" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealRight}>
            <p className="eyebrow">Built for Operations Leaders</p>
            <h2 className="section-title">Intelligence where operational impact matters.</h2>
          </motion.div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              [ShieldCheckIcon, 'Security', 'Safety incidents detected in milliseconds, keeping teams informed across all sites.'],
              [TruckIcon, 'Logistics', 'Delivery delays and route deviations flagged instantly for proactive dispatch.'],
              [FactoryIcon, 'Manufacturing', 'Equipment anomalies caught before downtime, not after costly failures.'],
              [MapPinIcon, 'Smart Cities', 'Traffic patterns analyzed live for smarter urban mobility decisions.']
            ].map(([Icon, name, desc], i) => (
              <TiltCard key={name as string} Icon={Icon as typeof ShieldCheckIcon} name={name as string} desc={desc as string} />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS — WHY TEAMS SWITCH */}
      <section className="bg-[#eef0fa] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp} className="text-center">
            <p className="eyebrow">Operational Velocity</p>
            <h2 className="section-title !text-[#153335]">
              Why operations teams choose FrameDock over manual processes.
            </h2>
          </motion.div>

          <div className="mt-14 overflow-hidden rounded-3xl border border-white/80 bg-white/50 backdrop-blur-xl">
            <div className="grid grid-cols-3 bg-white/70 px-6 py-4 text-xs font-semibold uppercase tracking-[.1em] text-[#5b5f75] sm:px-8">
              <span>What changes</span>
              <span className="text-center">Traditional</span>
              <span className="text-center text-[#20b896]">FrameDock</span>
            </div>
            {[
              ['Time to detect incidents', 'Hours — reviewed after the fact', 'Milliseconds — routed live'],
              ['Scaling to new cameras', 'New script per site', 'Same pipeline, add a source'],
              ['Who watches the feeds', 'A rotating shift of operators', 'The pipeline, always on'],
              ['Where footage lives', 'Scattered across NVRs and drives', 'One structured, queryable layer']
            ].map((row, i) => (
              <motion.div
                key={row[0]}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={i % 2 === 0 ? revealLeft : revealRight}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-3 items-center border-t border-white/60 px-6 py-5 text-sm sm:px-8"
              >
                <span className="font-medium text-[#153335]">{row[0]}</span>
                <span className="flex items-center justify-center gap-2 text-center text-[#5b5f75]">
                  <span className="h-2 w-2 rounded-full bg-[#d3d6f5]" /> {row[1]}
                </span>
                <span className="flex items-center justify-center gap-2 text-center text-[#153335]">
                  <CheckIcon size={14} className="shrink-0 text-[#20b896]" /> {row[2]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#10111f] px-5 py-28 text-center text-white sm:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealScale} className="relative mx-auto max-w-3xl">
          <p className="eyebrow !text-[#67e7c3]">Give your video a purpose</p>
          <h2 className="text-4xl font-bold tracking-[-.06em] sm:text-6xl">
            Every frame holds an insight. Make it actionable.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="https://framedock.one/#/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#20b896] to-[#198a75] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_15px_28px_rgba(32,184,150,.3)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20b896]"
            >
              Launch FrameDock.V1{' '}
              <ArrowRightIcon size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

function SpotlightCard({
  children,
  delay = 0,
  dir = 'left',
  className = ''
}: { children: React.ReactNode; delay?: number; dir?: 'left' | 'right'; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  return (
    <motion.article
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={dir === 'left' ? revealLeft : revealRight}
      transition={{ delay }}
      onMouseMove={(e) => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        setPos({ x: (e.clientX - box.left) / box.width * 100, y: (e.clientY - box.top) / box.height * 100 });
      }}
      style={{
        background: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, rgba(32,184,150,.12), transparent 65%), rgba(255,255,255,.55)`
      }}
      className={`glass-card relative flex flex-col overflow-hidden p-6 ${className}`}>
      {children}
    </motion.article>
  );
}

function SolutionCard({
  title,
  body,
  fact
}: { title: string; body: string; fact: string }) {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={revealUp}
      className={`glass-card grid items-center gap-6 rounded-2xl p-8 transition-transform-gpu`}
    >
      <div>
        <h3 className="mt-4 text-2xl font-bold tracking-[-.05em] text-[#153335]">{title}</h3>
        <p className="mt-4 max-w-md text-[15px] leading-7 text-[#5b5f75]">{body}</p>
        <p className="mt-4 max-w-md text-[13px] leading-6 text-[#20b896] font-medium">{fact}</p>
      </div>
    </motion.article>
  );
}

function TiltCard({
  Icon,
  name,
  desc
}: { Icon: typeof ShieldCheckIcon; name: string; desc: string }) {
  const [r, setR] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      onPointerMove={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        setR({ x: (e.clientY - box.top - box.height / 2) / 10, y: -(e.clientX - box.left - box.width / 2) / 10 });
      }}
      onPointerLeave={() => setR({ x: 0, y: 0 })}
      animate={{ rotateX: r.x, rotateY: r.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 19 }}
      style={{ transformStyle: 'preserve-3d' }}
      className="glass-card min-h-[160px] p-6"
    >
      <Icon className="text-[#20b896]" size={22} />
      <p className="mt-3 font-semibold tracking-[-.03em] text-[#153335]">{name}</p>
      <p className="mt-2 text-xs leading-5 text-[#5b5f75]">{desc}</p>
    </motion.div>
  );
}