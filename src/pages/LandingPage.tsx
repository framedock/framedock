import React, { useEffect, useState, useRef, Fragment } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform } from
'framer-motion';
import {
  ActivityIcon,
  ArrowRightIcon,
  BoxesIcon,
  BracesIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CirclePlayIcon,
  FactoryIcon,
  Loader2Icon,
  MapPinIcon,
  PlugIcon,
  RadioIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  XIcon } from
'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { ParticleField } from '../components/ParticleField';

/* ---------------------------------------------------------------
   THEME TOKENS — white glassmorphism, indigo → cyan accent
   surface #f6f7fb · surface-alt #eef0fa · ink #10111f · ink-muted #656a80
   accent #4f46e5 · accent-2 #06b6d4 · deep (dark sections only) #0b0e1f
   ------------------------------------------------------------- */

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
const revealDown = {
  hidden: { opacity: 0, y: -30, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }
};

// sections the scroll-spy nav tracks — id must match a rendered section id
const NAV_SECTIONS = [
{ id: 'top', label: 'Home' },
{ id: 'product', label: 'Product' },
{ id: 'pipeline', label: 'Pipeline' },
{ id: 'process', label: 'Process' },
{ id: 'pricing', label: 'Pricing' },
{ id: 'faq', label: 'FAQ' },
{ id: 'contact', label: 'Contact' }];


export function LandingPage() {
  const [docsOpen, setDocsOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: pageProgress } = useScroll();

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0]);

  const goPipeline = () =>
  document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="w-full overflow-hidden bg-[#f6f7fb] text-[#10111f]">
      <motion.div
        style={{ scaleX: pageProgress }}
        className="fixed left-0 top-0 z-[70] h-[3px] w-full origin-left bg-gradient-to-r from-[#4f46e5] to-[#06b6d4]" />

      <SectionNav />

      <Navbar onDocs={() => setDocsOpen(true)} />
      <main>
        {/* ============================= HERO ============================= */}
        <section
          id="top"
          ref={heroRef}
          className="relative flex min-h-[880px] flex-col overflow-hidden px-5 pb-10 pt-28 sm:px-8 lg:min-h-[940px]">

          <motion.div
            style={{ y: bgY }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,1)_0%,rgba(238,240,250,1)_45%,rgba(226,229,247,1)_100%)]" />

          <motion.div style={{ y: glowY }} className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#4f46e5]/15 blur-[90px]" />
            <div className="absolute -right-16 top-56 h-80 w-80 rounded-full bg-[#06b6d4]/15 blur-[100px]" />
            <div className="absolute bottom-0 left-1/2 h-64 w-[40%] -translate-x-1/2 rounded-full bg-[#8b7ff5]/12 blur-[110px]" />
          </motion.div>

          <div className="relative z-10 mx-auto w-full max-w-7xl text-center">
            <motion.div initial="hidden" animate="visible" variants={revealDown} style={{ y: headingY }}>
              <p className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/50 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[.2em] text-[#4f46e5] backdrop-blur-md">
                <SparklesIcon size={12} /> Visual intelligence, without blind spots
              </p>
              <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[0.98] tracking-[-.065em] text-[#10111f] sm:text-6xl lg:text-7xl">
                The Video AI Processing Pipeline for Real-Time Visual Intelligence.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#656a80] sm:text-lg">
                Turn raw video streams into structured intelligence in real time —
                with a system engineered for certainty at enterprise scale.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#4338ca] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_15px_28px_rgba(79,70,229,.3)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]">
                  Launch Dashboard{' '}
                  <ArrowRightIcon size={16} className="transition group-hover:translate-x-1" />
                </Link>
                <button
                  onClick={goPipeline}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 bg-white/50 px-6 py-3.5 text-sm font-semibold text-[#10111f] backdrop-blur-md transition hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]">
                  <CirclePlayIcon size={17} /> See it in action
                </button>
              </div>
            </motion.div>
          </div>

          {/* reserved breathing room — kept empty on purpose */}
          <div className="relative z-10 flex-1" />
          <motion.div style={{ opacity: heroOpacity }} className="pointer-events-none absolute inset-0" />
        </section>

        {/* ============================= PROBLEM — bento grid ============================= */}
        <section className="relative bg-[#f6f7fb] px-5 py-24 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealLeft} className="mx-auto max-w-7xl">
            <p className="eyebrow">The operational gap</p>
            <h2 className="section-title max-w-2xl">
              Video is your richest source of truth. It's also your hardest data to use.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#656a80]">
              Six failure modes show up in almost every video operation we've studied — from a
              single retail site to a nationwide camera fleet. FrameDock was built to close all
              six at once, not one at a time.
            </p>

            <div className="mt-12 grid auto-rows-[170px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
              { t: 'Unprocessed video data sitting dormant', d: 'Petabytes recorded, almost none of it ever queried again.', span: 'lg:col-span-2 lg:row-span-2 sm:row-span-2' },
              { t: 'Manual monitoring that drains teams', d: 'Operators watching walls of feeds for the one moment that matters.', span: '' },
              { t: 'Events detected after they matter', d: 'Reviewed the next morning, not the moment it happened.', span: '' },
              { t: 'Infrastructure too complex to maintain', d: 'Bespoke scripts nobody wants to own.', span: '' },
              { t: 'Scale that breaks brittle systems', d: 'What worked for 10 cameras falls over at 500.', span: '' },
              { t: 'No unified source of visual truth', d: 'Every team queries a different copy of the same footage.', span: 'lg:col-span-2' }].
              map((item, i) =>
              <SpotlightCard key={item.t} delay={(i % 3) * 0.08} dir={i % 2 === 0 ? 'left' : 'right'} className={item.span}>
                <span className="font-mono text-xs text-[#4f46e5]">0{i + 1}</span>
                <h3 className="mt-6 text-lg font-semibold tracking-[-.03em]">{item.t}</h3>
                <p className="mt-2 text-sm leading-6 text-[#656a80]">{item.d}</p>
              </SpotlightCard>
              )}
            </div>
          </motion.div>
        </section>

        {/* ============================= COMPARISON ============================= */}
        <Comparison />

        {/* ============================= PRODUCT ============================= */}
        <section id="product" className="bg-[#eef0fa] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>
              <p className="eyebrow">One intelligent flow</p>
              <h2 className="section-title max-w-2xl">
                From every frame to the insight that moves your business.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#656a80]">
                Five layers, one continuous pipeline. Nothing hands off to a queue and waits —
                data keeps moving from ingestion to insight in the same live path.
              </p>
            </motion.div>
            <div className="mt-16 space-y-16">
              <Solution title="Video Ingestion Engine" body="Bring every camera, edge device, cloud archive, and live source into a single observability plane." dir="left" />
              <Solution flip title="AI Video Processing Layer" body="Run vision models where they make sense, with visual context preserved from frame to frame." dir="right" />
              <Solution title="Real-Time Event Detection" body="Surface the moments that matter, then route them to the people and systems that can act." dir="left" />
              <Solution flip title="Distributed Video Pipeline" body="Scale processing across workloads without forcing your team to operate a scattered stack." dir="right" />
              <Solution title="Video Intelligence Dashboard" body="Give operators a living view of streams, events, performance, and capacity." dir="left" dashboard />
            </div>
          </div>
        </section>

        {/* ============================= PIPELINE — scroll-drawn path ============================= */}
        <PipelineSection />

        {/* ============================= PROCESS — go live in 3 steps ============================= */}
        <ProcessSection />

        {/* ============================= USE CASES ============================= */}
        <section className="bg-[#f6f7fb] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealRight}>
              <p className="eyebrow">Built for the real world</p>
              <h2 className="section-title">Intelligence where visibility matters.</h2>
            </motion.div>
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
              [ShieldCheckIcon, 'Security'],
              [MapPinIcon, 'Smart cities'],
              [FactoryIcon, 'Manufacturing'],
              [TruckIcon, 'Transportation'],
              [CameraIcon, 'Retail'],
              [RadioIcon, 'Media'],
              [BoxesIcon, 'Logistics'],
              [BracesIcon, 'AI research']].
              map(([Icon, name]) =>
              <TiltCard key={name as string} Icon={Icon as typeof ShieldCheckIcon} name={name as string} />
              )}
            </div>
          </div>
        </section>

        <Metrics />
        <Testimonials />
        <Integrations />
        <Pricing />
        <FAQ />

        {/* ============================= DEVELOPER API ============================= */}
        <section className="bg-[#eef0fa] px-5 py-24 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealLeft}
            className="mx-auto flex max-w-5xl flex-col justify-between gap-8 rounded-3xl border border-white/80 bg-white/55 p-8 shadow-[0_22px_50px_rgba(16,17,31,.08)] backdrop-blur-xl md:flex-row md:items-center md:p-12">
            <div>
              <p className="eyebrow">Developer API</p>
              <h2 className="text-3xl font-bold tracking-[-.05em]">Build intelligence into every video workflow.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#656a80]">
                Detailed reference material and integration guides are almost ready.
              </p>
            </div>
            <button
              onClick={() => setDocsOpen(true)}
              className="shrink-0 rounded-xl border border-[#c7c9f7] bg-white/70 px-5 py-3 text-sm font-semibold text-[#4338ca] transition hover:bg-white">
              Docs coming soon
            </button>
          </motion.div>
        </section>

        <Contact />

        {/* ============================= FINAL CTA ============================= */}
        <section id="final-cta" className="relative overflow-hidden bg-[#0b0e1f] px-5 py-28 text-center text-white sm:px-8">
          <ParticleField dark />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealScale} className="relative mx-auto max-w-3xl">
            <p className="eyebrow !text-[#8b93ff]">See what your video knows</p>
            <h2 className="text-4xl font-bold tracking-[-.06em] sm:text-6xl">
              Give every frame a place in your decision-making.
            </h2>
            <MagneticButton />
          </motion.div>
        </section>
      </main>
      <Footer />
      <AnimatePresence>{docsOpen && <DocsModal onClose={() => setDocsOpen(false)} />}</AnimatePresence>
    </div>);

}

/* ---------------------------------------------------------------
   SectionNav — fixed scroll-spy dot navigation, active section
   is tracked live via IntersectionObserver and highlighted.
   ------------------------------------------------------------- */
function SectionNav() {
  const [active, setActive] = useState('top');

  useEffect(() => {
    const els = NAV_SECTIONS.
    map((s) => document.getElementById(s.id)).
    filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 z-[65] hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
      {NAV_SECTIONS.map((s) =>
      <a
        key={s.id}
        href={`#${s.id}`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="group flex items-center gap-2">

        <span
          className={`whitespace-nowrap rounded-full border border-white/70 bg-white/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.1em] text-[#4338ca] opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 ${active === s.id ? 'opacity-100' : ''}`}>
          {s.label}
        </span>
        <motion.span
          animate={{
            scale: active === s.id ? 1.35 : 1,
            backgroundColor: active === s.id ? '#4f46e5' : 'rgba(16,17,31,.22)'
          }}
          transition={{ duration: 0.25 }}
          className="h-2.5 w-2.5 rounded-full" />

      </a>
      )}
    </nav>);

}

/* ---------------------------------------------------------------
   SpotlightCard — glassmorphic card with a cursor-follow highlight.
   ------------------------------------------------------------- */
function SpotlightCard({
  children,
  delay = 0,
  dir = 'left',
  className = ''




}: {children: React.ReactNode;delay?: number;dir?: 'left' | 'right';className?: string;}) {
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
        background: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, rgba(79,70,229,.12), transparent 65%), rgba(255,255,255,.55)`
      }}
      className={`glass-card relative flex flex-col overflow-hidden p-6 ${className}`}>
      {children}
    </motion.article>);

}

function Solution({
  title,
  body,
  flip,
  dashboard,
  dir



}: {title: string;body: string;flip?: boolean;dashboard?: boolean;dir: 'left' | 'right';}) {
  const variant = dir === 'left' ? revealLeft : revealRight;
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={variant}
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div>
        <p className="font-mono text-xs uppercase tracking-[.18em] text-[#4f46e5]">FrameDock layer</p>
        <h3 className="mt-4 text-3xl font-bold tracking-[-.05em]">{title}</h3>
        <p className="mt-4 max-w-md text-[15px] leading-7 text-[#656a80]">{body}</p>
        {dashboard &&
        <Link to="/dashboard" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[#4338ca] hover:gap-2">
          Open the dashboard <ChevronRightIcon size={16} />
        </Link>
        }
      </div>
      <div className="glass-card min-h-[220px] w-full rounded-2xl border border-dashed border-[#d3d6f5] bg-white/30" />
    </motion.article>);

}

function TiltCard({
  Icon,
  name



}: {Icon: typeof ShieldCheckIcon;name: string;}) {
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
      className="glass-card min-h-[145px] p-5">
      <Icon className="text-[#4f46e5]" size={21} />
      <p className="mt-10 font-semibold tracking-[-.03em]">{name}</p>
      <span className="mt-2 block font-mono text-[10px] text-[#8a8fa3]">VISUAL OPS</span>
    </motion.div>);

}

/* ============================= COMPARISON ============================= */
function Comparison() {
  const rows = [
  ['Time to detect an event', 'Hours — reviewed after the fact', 'Milliseconds — routed live'],
  ['Scaling to new cameras', 'New script per site', 'Same pipeline, add a source'],
  ['Who watches the feeds', 'A rotating shift of operators', 'The pipeline, always on'],
  ['Where footage lives', 'Scattered across NVRs and drives', 'One structured, queryable layer']];

  return (
    <section className="bg-[#0b0e1f] px-5 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp} className="text-center">
          <p className="eyebrow !text-[#8b93ff]">Why teams switch</p>
          <h2 className="section-title mx-auto !text-white">Manual monitoring versus a live pipeline.</h2>
        </motion.div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10">
          <div className="grid grid-cols-3 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-[.1em] text-white/50 sm:px-8">
            <span>What changes</span>
            <span className="text-center">Manual monitoring</span>
            <span className="text-center text-[#8b93ff]">FrameDock</span>
          </div>
          {rows.map((row, i) =>
          <motion.div
            key={row[0]}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={i % 2 === 0 ? revealLeft : revealRight}
            transition={{ delay: i * 0.06 }}
            className="grid grid-cols-3 items-center border-t border-white/10 px-6 py-5 text-sm sm:px-8">
            <span className="font-medium">{row[0]}</span>
            <span className="flex items-center justify-center gap-2 text-center text-white/50">
              <XIcon size={14} className="shrink-0 text-white/30" /> {row[1]}
            </span>
            <span className="flex items-center justify-center gap-2 text-center text-white">
              <CheckIcon size={14} className="shrink-0 text-[#06b6d4]" /> {row[2]}
            </span>
          </motion.div>
          )}
        </div>
      </div>
    </section>);

}

/* ============================= PIPELINE — scroll-drawn connecting path ============================= */
function PipelineSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.35'] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  const stages = ['Raw Streams', 'Frame Extraction', 'Computer Vision Inference', 'Event Detection', 'Structured Insights'];

  return (
    <section id="pipeline" ref={ref} className="relative overflow-hidden bg-[#0b0e1f] px-5 py-28 text-white sm:px-8">
      <ParticleField dark />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealScale}
          className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow !text-[#8b93ff]">System architecture</p>
            <h2 className="section-title max-w-xl !text-white">A live pipeline, not a handoff queue.</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-white/50">
              Scroll to trace a frame's actual path — the same route it takes in production,
              start to finish, with nothing queued in between.
            </p>
          </div>
          <span className="w-fit rounded-full border border-[#4f46e5]/40 bg-[#4f46e5]/10 px-3 py-1.5 font-mono text-[11px] text-[#b3b8ff]">
            Powered by NVIDIA SDK
          </span>
        </motion.div>

        <div className="relative mt-20">
          <svg viewBox="0 0 1000 2" className="absolute left-0 right-0 top-[26px] hidden w-full md:block" preserveAspectRatio="none">
            <path d="M0,1 L1000,1" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
            <motion.path d="M0,1 L1000,1" stroke="url(#pipe-grad)" strokeWidth="2" style={{ pathLength }} />
            <defs>
              <linearGradient id="pipe-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative grid gap-5 md:grid-cols-5">
            {stages.map((stage, i) =>
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <span className="font-mono text-[10px] text-[#8b93ff]">0{i + 1}</span>
              <p className="mt-7 text-sm font-semibold">{stage}</p>
              <span className="mt-3 block h-1.5 w-1.5 rounded-full bg-[#06b6d4] shadow-[0_0_12px_#06b6d4]" />
            </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

/* ============================= PROCESS — go live in 3 steps ============================= */
function ProcessSection() {
  const steps = [
  { Icon: PlugIcon, title: 'Connect your sources', body: 'Point RTSP, ONVIF, or a cloud archive at FrameDock. No agents to install on camera hardware.' },
  { Icon: ActivityIcon, title: 'Tune detection live', body: 'Watch events surface in the dashboard as you adjust models and thresholds in real time.' },
  { Icon: RocketIcon, title: 'Route and ship', body: 'Send structured events to Slack, a webhook, or your own data warehouse — same day.' }];

  return (
    <section id="process" className="bg-[#eef0fa] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealLeft}>
          <p className="eyebrow">Time to value</p>
          <h2 className="section-title max-w-2xl">Go from raw feed to routed event the same day.</h2>
        </motion.div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-[#d3d6f5] md:block" />
          {steps.map((s, i) =>
          <motion.div
            key={s.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={revealScale}
            transition={{ delay: i * 0.15 }}
            className="relative">
            <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#06b6d4] text-white shadow-[0_16px_30px_rgba(79,70,229,.3)]">
              <s.Icon size={24} />
            </div>
            <span className="absolute -top-2 left-11 z-10 grid h-6 w-6 place-items-center rounded-full border border-[#d3d6f5] bg-white font-mono text-[10px] font-bold text-[#4f46e5]">
              {i + 1}
            </span>
            <h3 className="mt-6 text-xl font-bold tracking-[-.03em]">{s.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[#656a80]">{s.body}</p>
          </motion.div>
          )}
        </div>
      </div>
    </section>);

}

function Metrics() {
  const section = useRef(null);
  const inView = useInView(section, { once: true });
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const glowX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const values = [
  ['Active streams', '164'],
  ['Frame processing', '2.4M / hr'],
  ['Detection accuracy', '98.7%'],
  ['GPU utilization', '71%'],
  ['Stream latency', '82 ms']];

  return (
    <section ref={section} className="relative overflow-hidden bg-[#eef0fa] px-5 py-20 sm:px-8">
      <motion.div style={{ x: glowX }} className="pointer-events-none absolute -top-10 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-[#4f46e5]/10 blur-[100px]" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealUp}
        className="relative mx-auto max-w-7xl rounded-3xl border border-white/80 bg-white/55 p-7 shadow-xl backdrop-blur-xl sm:p-10">
        <p className="eyebrow">Live infrastructure readout</p>
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-5">
          {values.map(([label, value], i) =>
          <div key={label}>
            <p className="font-mono text-[10px] uppercase tracking-[.12em] text-[#8a8fa3]">{label}</p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="mt-2 text-2xl font-bold tracking-[-.06em]">
              {value}
            </motion.p>
            <motion.div
              animate={{ scaleX: [0.4, 0.9, 0.6, 1, 0.45] }}
              transition={{ duration: 4 + i, repeat: Infinity }}
              className="mt-4 h-1 origin-left rounded-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4]" />
          </div>
          )}
        </div>
      </motion.div>
    </section>);

}

/* ============================= TESTIMONIALS ============================= */
function Testimonials() {
  const quotes = [
  { name: 'Head of Ops', org: 'Logistics network', text: 'Event detection moved from a daily report to a live signal our team actually reacts to.' },
  { name: 'VP Engineering', org: 'Retail platform', text: 'We replaced four brittle scripts with one pipeline. Onboarding a new camera feed now takes minutes.' },
  { name: 'Security Director', org: 'Smart city program', text: 'The dashboard gives our operators one place to trust, across every site we run.' }];

  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % quotes.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-[#f6f7fb] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>
          <p className="eyebrow">Trusted in production</p>
          <h2 className="section-title">Teams running video at scale rely on FrameDock.</h2>
        </motion.div>
        <div className="relative mt-14 min-h-[190px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card mx-auto max-w-2xl p-8">
              <p className="text-lg leading-8 text-[#10111f]">"{quotes[active].text}"</p>
              <footer className="mt-5 font-mono text-xs uppercase tracking-[.14em] text-[#8a8fa3]">
                {quotes[active].name} · {quotes[active].org}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {quotes.map((_, i) =>
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Show testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-[#4f46e5]' : 'w-1.5 bg-[#d3d6f5]'}`} />
          )}
        </div>
      </div>
    </section>);

}

/* ============================= INTEGRATIONS MARQUEE ============================= */
function Integrations() {
  const names = ['AWS', 'GCP', 'Azure', 'NVIDIA', 'Snowflake', 'Kafka', 'S3', 'Kubernetes', 'Datadog', 'PagerDuty'];
  const row = [...names, ...names];
  return (
    <section className="overflow-hidden bg-[#eef0fa] py-20">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp} className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="eyebrow text-center">Works with your stack</p>
        <h2 className="section-title text-center">Plug into the infrastructure you already run.</h2>
      </motion.div>
      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#eef0fa] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#eef0fa] to-transparent" />
        <div className="marquee flex w-max gap-4">
          {row.map((n, i) =>
          <span key={i} className="glass-card flex items-center gap-2 whitespace-nowrap px-6 py-3 text-sm font-semibold text-[#10111f]">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4]" /> {n}
          </span>
          )}
        </div>
      </div>
      <style>{`
        .marquee { animation: fd-marquee 26s linear infinite; }
        @keyframes fd-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>);

}

/* ============================= PRICING ============================= */
function Pricing() {
  const [yearly, setYearly] = useState(true);
  const tiers = [
  { name: 'Starter', monthly: 39, yearly: 372, tag: 'For evaluation', features: ['Up to 5 streams', 'Standard event detection', 'Community support'] },
  { name: 'Growth', monthly: 89, yearly: 852, tag: 'Most teams', features: ['Up to 100 streams', 'Real-time event routing', 'Priority support', 'API access'], featured: true },
  { name: 'Enterprise', monthly: null, yearly: null, tag: 'Custom scale', features: ['Unlimited streams', 'Dedicated GPU allocation', 'SLA + onboarding', 'Custom models'] }];

  const getCheckoutHref = (tierName: string) => {
    if (tierName === 'Starter') {
      return yearly
        ? 'https://buy.stripe.com/test_8x27sKaCRaFDgTV1AubEA01'
        : 'https://buy.stripe.com/test_28EfZg7qF8xv8npbb4bEA00';
    }

    if (tierName === 'Growth') {
      return yearly
        ? 'https://buy.stripe.com/test_aFacN426l8xvavxfrkbEA03'
        : 'https://buy.stripe.com/test_4gM7sK6mB297gTV1AubEA02';
    }

    return undefined;
  };

  return (
    <section id="pricing" className="bg-[#f6f7fb] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp} className="text-center">
          <p className="eyebrow">Pricing</p>
          <h2 className="section-title mx-auto">Simple plans that scale with your streams.</h2>
          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/55 p-1.5 backdrop-blur-md">
            <button onClick={() => setYearly(false)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${!yearly ? 'bg-[#10111f] text-white' : 'text-[#656a80]'}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${yearly ? 'bg-[#10111f] text-white' : 'text-[#656a80]'}`}>Yearly · save 20%</button>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) =>
          <motion.div
            key={t.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={revealScale}
            transition={{ delay: i * 0.1 }}
            className={`glass-card relative flex flex-col p-7 ${t.featured ? 'border-[#4f46e5]/40 shadow-[0_25px_50px_rgba(79,70,229,.18)] md:-translate-y-3' : ''}`}>
            {t.featured &&
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Most popular
            </span>
            }
            <p className="font-mono text-xs uppercase tracking-[.14em] text-[#4f46e5]">{t.tag}</p>
            <h3 className="mt-2 text-2xl font-bold tracking-[-.03em]">{t.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              {t.monthly === null ?
              <span className="text-3xl font-bold tracking-[-.03em]">Talk to us</span> :

              <>
                  <AnimatePresence mode="wait">
                    <motion.span
                    key={yearly ? 'y' : 'm'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-4xl font-bold tracking-[-.03em]">

                      ${yearly ? t.yearly : t.monthly}
                    </motion.span>
                  </AnimatePresence>
                  <span className="pb-1 text-sm text-[#8a8fa3]">/ mo</span>
                </>
              }
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {t.features.map((f) =>
              <li key={f} className="flex items-start gap-2 text-sm text-[#656a80]">
                <CheckIcon size={16} className="mt-0.5 shrink-0 text-[#4f46e5]" /> {f}
              </li>
              )}
            </ul>
<div className="mt-8">
              {t.monthly === null ? (
                <a
                  href="mailto:hello@framedock.one"
                  className="flex w-full items-center justify-center rounded-xl border border-[#4f46e5]/30 bg-white/60 px-4 py-3 text-sm font-semibold text-[#4338ca] transition hover:bg-white">
                  Contact us
                </a>
              ) : (
                <a
                  href={getCheckoutHref(t.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${t.featured ? 'bg-gradient-to-r from-[#4f46e5] to-[#4338ca] text-white hover:-translate-y-0.5' : 'border border-[#d3d6f5] bg-white/60 text-[#10111f] hover:bg-white'}`}>
                  Checkout
                </a>
              )}
            </div>
          </motion.div>
          )}
        </div>
      </div>
    </section>);

}

/* ============================= FAQ ============================= */
function FAQ() {
  const items = [
  { q: 'How fast can we connect our existing camera feeds?', a: 'Most teams connect their first stream in under an hour using our ingestion adapters for RTSP, ONVIF, and common cloud archives.' },
  { q: 'Where does inference run?', a: 'You can run inference on our managed GPU fleet, on your own edge hardware, or a mix of both — the pipeline routes automatically.' },
  { q: 'Can we bring our own detection models?', a: 'Yes. Enterprise plans support custom model upload alongside our built-in detection library.' },
  { q: 'What happens if a stream drops?', a: 'The pipeline buffers and retries automatically, and the dashboard surfaces stream health in real time so nothing fails silently.' },
  { q: 'How is FrameDock priced at scale?', a: 'Growth and Enterprise plans price per active stream, not per camera purchased — idle hardware never counts against you.' }];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#eef0fa] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealLeft}>
          <p className="eyebrow">Questions</p>
          <h2 className="section-title">Everything you need to know before you connect a stream.</h2>
        </motion.div>
        <div className="mt-10 space-y-3">
          {items.map((item, i) =>
          <motion.div
            key={item.q}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={revealUp}
            transition={{ delay: i * 0.06 }}
            className="glass-card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
              <span className="font-semibold tracking-[-.01em]">{item.q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDownIcon size={18} className="text-[#4f46e5]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i &&
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-7 text-[#656a80]">{item.a}</p>
              </motion.div>
              }
            </AnimatePresence>
          </motion.div>
          )}
        </div>
      </div>
    </section>);

}

/* ============================= CONTACT ============================= */
function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [focused, setFocused] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xdaqkrde', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (status !== 'sent') return;

    const timer = window.setTimeout(() => {
      setStatus('idle');
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [status]);

  const fieldClass = (name: string) =>
  `w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-[#10111f] outline-none transition placeholder:text-[#8a8fa3] ${
  focused === name ? 'border-[#4f46e5] shadow-[0_0_0_4px_rgba(79,70,229,.12)]' : 'border-[#e1e3f5]'}`;


  return (
    <section id="contact" className="bg-[#f6f7fb] px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealLeft}>
          <p className="eyebrow">Get in touch</p>
          <h2 className="section-title max-w-md">Tell us about your streams. We'll help you map the pipeline.</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#656a80]">
            Whether you're evaluating FrameDock for one site or rolling out across a fleet, our team will reply within one business day.
          </p>
          <div className="mt-8 space-y-4 text-sm text-[#656a80]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-[#4f46e5]"><BracesIcon size={16} /></span>
              connect@framedock.one
            </div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-[#4f46e5]"><MapPinIcon size={16} /></span>
              633 W 5th Street,Los Angeles, CA 90012, USA
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealRight}
          className="glass-card space-y-4 p-7">
          <AnimatePresence mode="wait">
            {status === 'sent' ?
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] text-white">
                <CheckIcon size={22} />
              </span>
              <p className="text-lg font-semibold">Message sent.</p>
              <p className="text-sm text-[#656a80]">We'll be in touch shortly.</p>
            </motion.div> :

            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} className={fieldClass('name')} />
                <input required type="email" placeholder="Work email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} className={fieldClass('email')} />
              </div>
              <input placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} onFocus={() => setFocused('company')} onBlur={() => setFocused(null)} className={fieldClass('company')} />
              <textarea required rows={4} placeholder="What are you looking to build?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} className={fieldClass('message')} />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-70">
                {status === 'sending' ? <><Loader2Icon size={16} className="animate-spin" /> Sending…</> : <>Send message <ArrowRightIcon size={16} /></>}
              </button>
            </motion.div>
            }
          </AnimatePresence>
        </motion.form>
      </div>
    </section>);

}

/* ---------------------------------------------------------------
   MagneticButton — pulls toward the cursor within a small radius.
   ------------------------------------------------------------- */
function MagneticButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 15 });
  const sy = useSpring(my, { stiffness: 200, damping: 15 });

  return (
    <motion.div
      onMouseMove={(e) => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        mx.set((e.clientX - box.left - box.width / 2) * 0.35);
        my.set((e.clientY - box.top - box.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="mt-8 inline-block">
      <motion.div style={{ x: sx, y: sy }}>
        <Link
          ref={ref}
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_36px_rgba(79,70,229,.35)]">
          Launch Dashboard <ArrowRightIcon size={16} />
        </Link>
      </motion.div>
    </motion.div>);

}

function DocsModal({ onClose }: {onClose: () => void;}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-title"
      className="fixed inset-0 z-[60] grid place-items-center bg-[#10111f]/35 p-5 backdrop-blur-sm"
      onMouseDown={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-white/80 bg-white/85 p-7 shadow-2xl backdrop-blur-2xl">
        <div className="flex justify-between">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eceeff] text-[#4338ca]">
            <BracesIcon size={20} />
          </div>
          <button onClick={onClose} aria-label="Close modal" className="rounded-lg p-1 hover:bg-white">
            <XIcon />
          </button>
        </div>
        <p className="mt-7 font-mono text-xs text-[#4f46e5]">DEVELOPER API</p>
        <h2 id="docs-title" className="mt-2 text-3xl font-bold tracking-[-.05em]">Documentation is on its way.</h2>
        <p className="mt-4 text-sm leading-6 text-[#656a80]">
          We're putting the final details into guides, examples, and the reference portal. Check back soon.
        </p>
        <button onClick={onClose} className="mt-7 w-full rounded-xl bg-[#10111f] py-3 text-sm font-semibold text-white">
          Got it
        </button>
      </motion.div>
    </motion.div>);

}