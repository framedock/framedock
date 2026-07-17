import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase';

/* =========================================================================
   FRAMEDOCK — AI Video Intelligence Command Center
   Single-file React/TSX dashboard. Drop into any React + Vite/TS project.
   Frontend only. All data is mocked, all forms are local state (no API calls).
   Theme tokens live in <style> below (indigo/cyan glass, matches the
   framedock.one landing page). Change --brand / --predict etc. to re-skin.
   Wire `handleSignOut` in <Sidebar> to your real auth provider.
   ========================================================================= */

type SectionId =
  | "command" | "streams" | "detection" | "forecast"
  | "pipeline" | "infra" | "events" | "integrations"
  | "reports" | "api" | "account";

/* ---------------------------- utils --------------------------------- */

function genSeries(n: number, base: number, vol: number): number[] {
  const arr = [base];
  for (let i = 1; i < n; i++) arr.push(Math.max(4, arr[i - 1] + (Math.random() - 0.48) * vol));
  return arr;
}

function sparkPath(points: number[], w = 100, h = 28, pad = 2): string {
  const max = Math.max(...points);
  const step = w / (points.length - 1);
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - pad - (p / max) * (h - pad * 2)).toFixed(1)}`)
    .join(" ");
}

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ---------------------------- icon set -------------------------------- */

const ICONS: Record<string, string> = {
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-6 3 3 5-8"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  root: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8 6h7.5M8 6l8 12M6 8.5V18"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3"/>',
  camera: '<rect x="3" y="7" width="14" height="12" rx="2"/><path d="M17 10l4-2v10l-4-2"/><circle cx="10" cy="13" r="3"/>',
  bell: '<path d="M17 7a5 5 0 0 0-10 0c0 5-3 6-3 6h16s-3-1-3-6"/><path d="M10.5 20a1.5 1.5 0 0 0 3 0"/>',
  grid2: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  api: '<path d="m18 16 4-4-4-4M6 8l-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  down: '<path d="M12 5v14M5 12l7 7 7-7"/>',
  check: '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ingest: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  pulse2: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="3"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 15V3M7 10l5 5 5-5"/><path d="M3 17v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m10.5 12.5 8-8M16 9l3 3M13 6l3 3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  map: '<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/>',
  filter: '<path d="M4 4h16l-6 8v6l-4 2v-8L4 4Z"/>',
  moon: '<path d="M20.8 14.5A9 9 0 1 1 9.5 3.2a7 7 0 0 0 11.3 11.3Z"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
};

function Ic({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }} />
  );
}

/* ---------------------------- app context (nav / toasts / theme) -------- */

type AppCtxType = {
  navigate: (s: SectionId) => void;
  toast: (text: string) => void;
  theme: "light" | "dark";
};
const AppCtx = React.createContext<AppCtxType>({ navigate: () => {}, toast: () => {}, theme: "light" });
function useApp() { return React.useContext(AppCtx); }

let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const push = (text: string) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  };
  return { toasts, push };
}
function ToastStack({ toasts }: { toasts: { id: number; text: string }[] }) {
  return (
    <div className="fd-toaststack">
      {toasts.map((t) => <div className="fd-toast" key={t.id}><Ic name="check" size={14} />{t.text}</div>)}
    </div>
  );
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------------------- atoms ------------------------------------ */

function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`fd-card ${className}`} style={style}>{children}</div>;
}

function SectionHead({ eyebrow, title, sub, actions }: { eyebrow?: string; title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="fd-pagehead">
      <div>
        {eyebrow && <div className="fd-eyebrow"><span className="fd-dot" />{eyebrow}</div>}
        <h1 className="fd-title">{title}</h1>
        {sub && <p className="fd-sub">{sub}</p>}
      </div>
      {actions && <div className="fd-actions">{actions}</div>}
    </div>
  );
}

function CardHead({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode }) {
  return (
    <div className="fd-cardhead">
      <div>
        <div className="fd-cardtitle">{title}</div>
        {desc && <div className="fd-carddesc">{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function Delta({ dir, children }: { dir: "up" | "down" | "flat"; children: React.ReactNode }) {
  return (
    <span className={`fd-delta fd-${dir}`}>
      {dir !== "flat" && <Ic name={dir} size={10} />}
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: "healthy" | "watch" | "critical" }) {
  const label = status[0].toUpperCase() + status.slice(1);
  return <span className={`fd-status fd-${status}`}><span className="fd-sdot" />{label}</span>;
}

function Gauge({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const dash = 148 - (pct / 100) * 148;
  return (
    <div className="fd-gauge">
      <svg width="110" height="70" viewBox="0 0 110 65">
        <path d="M8 60 A47 47 0 0 1 102 60" fill="none" stroke="var(--surface-2)" strokeWidth="9" strokeLinecap="round" />
        <path d="M8 60 A47 47 0 0 1 102 60" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray="148" strokeDashoffset={dash} />
      </svg>
      <div className="fd-gaugeval">{value}</div>
      <div className="fd-gaugelabel">{label}</div>
    </div>
  );
}

function Spark({ seed, color = "var(--brand)" }: { seed: number; color?: string }) {
  const pts = useMemo(() => genSeries(14, 20 + seed, 8), [seed]);
  return (
    <svg className="fd-spark" viewBox="0 0 100 28">
      <path d={sparkPath(pts)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------- video frame preview ----------------------- */

type FrameBox = { label: string; x: number; y: number; w: number; h: number; color: string };

function FrameTile({
  seed = 0,
  boxes = [],
  live = true,
  res = "1080p",
  fps = "30 fps",
  compact = false,
}: { seed?: number; boxes?: FrameBox[]; live?: boolean; res?: string; fps?: string; compact?: boolean }) {
  const hue = (seed * 47) % 360;
  return (
    <div className={`fd-frametile ${compact ? "compact" : ""}`}>
      <div
        className="fd-framefootage"
        style={{
          background: `linear-gradient(${125 + (seed * 17) % 40}deg, hsl(${hue} 35% 14%), hsl(${(hue + 40) % 360} 30% 22%) 45%, hsl(${(hue + 200) % 360} 25% 10%))`,
        }}
      >
        <div className="fd-framegrid" />
        <div className="fd-framescan" />
        {boxes.map((b, i) => (
          <div key={i} className="fd-box" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, borderColor: b.color }}>
            <span className="fd-boxlabel" style={{ background: b.color }}>{b.label}</span>
          </div>
        ))}
      </div>
      <div className="fd-frametop">
        {live && <span className="fd-livepill"><span className="fd-livedotsm" />LIVE</span>}
        <span className="fd-frameres mono">{res} · {fps}</span>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={`fd-toggle ${checked ? "on" : ""}`} onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span className="fd-toggle-knob" />
    </button>
  );
}

/* ================================================================
   SECTION: Command Center
   ================================================================ */

function PulseChart() {
  const [metric, setMetric] = useState<"framerate" | "confidence" | "gpu">("framerate");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, []);

  const { d, f, band, gridY } = useMemo(() => {
    const W = 760, H = 260, PAD = 28;
    const past = genSeries(22, 60, 22);
    const maxObs = Math.max(...past);
    const future = genSeries(8, past[past.length - 1], 18);
    const maxV = Math.max(maxObs, ...future) * 1.15;
    const innerW = W - PAD * 2, innerH = H - PAD * 1.6;
    const stepPast = (innerW * 0.72) / (past.length - 1);
    const stepFuture = (innerW * 0.28) / (future.length - 1);

    let d = "";
    past.forEach((p, i) => {
      const x = PAD + i * stepPast, y = PAD * 0.4 + innerH - (p / maxV) * innerH;
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    });
    const lastX = PAD + (past.length - 1) * stepPast;
    const lastY = PAD * 0.4 + innerH - (past[past.length - 1] / maxV) * innerH;
    let f = "M " + lastX.toFixed(1) + " " + lastY.toFixed(1) + " ";
    let band = "M " + lastX.toFixed(1) + " " + (lastY - 14).toFixed(1) + " ";
    future.forEach((p, i) => {
      const x = lastX + (i + 1) * stepFuture, y = PAD * 0.4 + innerH - (p / maxV) * innerH;
      f += "L " + x.toFixed(1) + " " + y.toFixed(1) + " ";
      band += "L " + x.toFixed(1) + " " + (y - 14 - i * 1.6).toFixed(1) + " ";
    });
    for (let i = future.length - 1; i >= 0; i--) {
      const x = lastX + (i + 1) * stepFuture, y = PAD * 0.4 + innerH - (future[i] / maxV) * innerH;
      band += "L " + x.toFixed(1) + " " + (y + 14 + i * 1.6).toFixed(1) + " ";
    }
    band += "L " + lastX.toFixed(1) + " " + (lastY + 14).toFixed(1) + " Z";
    return { d, f, band, gridY: [0.25, 0.5, 0.75].map((g) => PAD * 0.4 + innerH * g), lastX, lastY };
  }, [metric, tick]);

  return (
    <Card className="fd-pad">
      <CardHead
        title="Pipeline Pulse"
        desc="Live stream signal blended with FrameDock's forecast band"
        right={
          <div className="fd-tabset">
            {(["framerate", "confidence", "gpu"] as const).map((m) => (
              <span key={m} className={`fd-tab ${metric === m ? "active" : ""}`} onClick={() => setMetric(m)}>
                {m === "framerate" ? "Frame rate" : m === "confidence" ? "Detection confidence" : "GPU load"}
              </span>
            ))}
          </div>
        }
      />
      <svg viewBox="0 0 760 260" style={{ width: "100%", height: 260, overflow: "visible" }}>
        <defs>
          <linearGradient id="fdFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridY.map((y, i) => <line key={i} x1={28} y1={y} x2={732} y2={y} stroke="var(--border-soft)" strokeWidth={1} />)}
        <path d={d + "L 546.6 250.4 L 28 250.4 Z"} fill="url(#fdFill)" />
        <path d={band} fill="var(--predict)" opacity={0.14} />
        <path d={d} fill="none" stroke="var(--brand)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d={f} fill="none" stroke="var(--predict)" strokeWidth={2.2} strokeLinecap="round" strokeDasharray="6 5" />
      </svg>
      <div className="fd-legend">
        <div className="fd-legenditem"><span className="fd-swatch" style={{ background: "var(--brand)" }} />Observed signal</div>
        <div className="fd-legenditem"><span className="fd-swatch dashed" />AI forecast</div>
        <div className="fd-legenditem"><span className="fd-swatch" style={{ background: "var(--predict-dim)", border: "1px solid var(--predict)" }} />Confidence band</div>
      </div>
    </Card>
  );
}

const INSIGHTS = [
  { t: "Congestion pattern predicted", time: "2m ago", body: "traffic-junction-9 trending toward a queue-length threshold breach in ~30min based on inflow rate.", kind: "predict" },
  { t: "Stream auto-recovered", time: "11m ago", body: "perimeter-north dropped to 11fps after a decode stall and self-corrected once the GPU queue drained.", kind: "good" },
  { t: "New correlation mapped", time: "29m ago", body: "Correlation engine linked loading-dock-03 PPE alerts to a shift-change time window.", kind: "signal" },
  { t: "Capacity forecast updated", time: "1h ago", body: "Ingest volume expected to cross provisioned GPU capacity by Thursday 03:00 UTC.", kind: "warn" },
  { t: "Event correlation", time: "2h ago", body: "3 detections across 2 streams grouped into a single root event, reducing alert noise by 68%.", kind: "signal" },
  { t: "Accuracy improved", time: "3h ago", body: "Detection accuracy up 1.4pp this week after retraining the loitering classifier.", kind: "good" },
] as const;

const KIND_STYLE: Record<string, { bg: string; fg: string; icon: string }> = {
  predict: { bg: "var(--predict-dim)", fg: "var(--predict)", icon: "bolt" },
  good: { bg: "var(--good-dim)", fg: "var(--good)", icon: "check" },
  signal: { bg: "var(--brand-dim)", fg: "var(--brand)", icon: "root" },
  warn: { bg: "var(--warn-dim)", fg: "var(--warn)", icon: "target" },
};

function InsightsFeed() {
  return (
    <Card className="fd-pad">
      <CardHead title="Live AI Insights" desc="Co-intelligence commentary, updated continuously" />
      <div className="fd-feed">
        {INSIGHTS.map((i, idx) => {
          const k = KIND_STYLE[i.kind];
          return (
            <div className="fd-feeditem" key={idx}>
              <div className="fd-feedic" style={{ background: k.bg, color: k.fg }}><Ic name={k.icon} size={14} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="fd-feedtitle"><span>{i.t}</span><span className="fd-feedtime mono">{i.time}</span></div>
                <div className="fd-feedbody">{i.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Pipeline() {
  const steps = [
    { icon: "ingest", label: "Video ingestion engine" },
    { icon: "layers", label: "Frame extraction" },
    { icon: "cpu", label: "Computer vision inference" },
    { icon: "target", label: "Event detection" },
    { icon: "pulse2", label: "Real-time analytics" },
  ];
  return (
    <Card className="fd-pad">
      <CardHead title="Video AI Pipeline" desc="How raw streams become explained, routed intelligence" />
      <div className="fd-pipeline">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="fd-pipestep">
              <div className="fd-pipeic"><Ic name={s.icon} size={19} /></div>
              <div className="fd-pipelabel">{s.label}</div>
            </div>
            {i < steps.length - 1 && <div className="fd-pipeconnector" />}
          </React.Fragment>
        ))}
      </div>
      <span className="fd-nvidia"><Ic name="layers" size={12} />Powered by NVIDIA SDK</span>
    </Card>
  );
}

function InfraGauges() {
  return (
    <Card className="fd-pad">
      <CardHead title="Infrastructure Health" desc="GPU cluster utilization, live" />
      <div className="fd-gaugegrid">
        <Gauge pct={71} color="var(--brand)" value="71%" label="GPU utilization" />
        <Gauge pct={54} color="var(--predict)" value="54%" label="VRAM" />
        <Gauge pct={82} color="var(--warn)" value="82%" label="Ingest throughput" />
        <Gauge pct={38} color="var(--good)" value="38%" label="Storage" />
      </div>
    </Card>
  );
}

const STREAMS = [
  { name: "perimeter-north", location: "Distribution Center · Gate 4", status: "critical", res: "1080p", fps: "11 fps", det: "41 /min", score: 88 },
  { name: "traffic-junction-9", location: "Smart City Grid · Sector B", status: "watch", res: "4K", fps: "24 fps", det: "22 /min", score: 52 },
  { name: "loading-dock-03", location: "Warehouse A · Zone 3", status: "watch", res: "1080p", fps: "28 fps", det: "14 /min", score: 58 },
  { name: "front-entrance-01", location: "Retail HQ · Lobby", status: "healthy", res: "4K", fps: "30 fps", det: "3 /min", score: 9 },
  { name: "checkout-lane-02", location: "Retail Store #12", status: "healthy", res: "1080p", fps: "30 fps", det: "6 /min", score: 15 },
  { name: "yard-camera-05", location: "Logistics Yard B", status: "healthy", res: "1080p", fps: "29 fps", det: "2 /min", score: 6 },
] as const;

const STREAM_BOXES: FrameBox[][] = [
  [{ label: "person 97%", x: 56, y: 24, w: 20, h: 52, color: "var(--crit)" }],
  [{ label: "vehicle 91%", x: 16, y: 42, w: 28, h: 26, color: "var(--warn)" }, { label: "vehicle 86%", x: 58, y: 30, w: 24, h: 24, color: "var(--warn)" }],
  [{ label: "forklift 89%", x: 34, y: 38, w: 30, h: 32, color: "var(--warn)" }],
  [{ label: "person 95%", x: 44, y: 30, w: 16, h: 42, color: "var(--predict)" }],
  [{ label: "person 92%", x: 28, y: 26, w: 16, h: 44, color: "var(--predict)" }],
  [{ label: "vehicle 88%", x: 48, y: 36, w: 26, h: 26, color: "var(--predict)" }],
];

function LiveViewGrid() {
  return (
    <Card className="fd-pad" style={{ marginBottom: 16 }}>
      <CardHead title="Live View" desc="Real-time computer vision inference overlaid on every connected stream" />
      <div className="fd-framegridwrap">
        {STREAMS.map((s, i) => (
          <div key={s.name}>
            <FrameTile seed={i} boxes={STREAM_BOXES[i]} res={s.res} fps={s.fps} />
            <div className="fd-frametilemeta">
              <span className="fd-svcname" style={{ fontSize: 12.5 }}>{s.name}</span>
              <StatusPill status={s.status as any} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StreamTable() {
  const { navigate } = useApp();
  return (
    <Card className="fd-pad" style={{ marginBottom: 16 }}>
      <CardHead title="Stream Fleet" desc="Live status, throughput & anomaly score per connected source"
        right={<button className="fd-btn fd-btnsm" onClick={() => navigate("streams")}>View all <Ic name="chevron" size={13} /></button>} />
      <div className="fd-tablewrap">
        <table className="fd-table">
          <thead><tr><th>Preview</th><th>Stream</th><th>Status</th><th>Trend</th><th>Frame rate</th><th>Detections</th><th>Anomaly score</th></tr></thead>
          <tbody>
            {STREAMS.map((s, idx) => {
              const scoreColor = s.score > 70 ? "var(--crit)" : s.score > 35 ? "var(--warn)" : "var(--good)";
              return (
                <tr className="fd-row" key={s.name}>
                  <td><FrameTile seed={idx} boxes={STREAM_BOXES[idx]} res={s.res} fps={s.fps} compact /></td>
                  <td><div className="fd-svcname">{s.name}</div><div className="fd-svcsub mono">{s.location}</div></td>
                  <td><StatusPill status={s.status as any} /></td>
                  <td><Spark seed={idx * 3} /></td>
                  <td className="mono">{s.fps}</td>
                  <td className="mono">{s.det}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="fd-scorebar"><div style={{ width: `${s.score}%`, background: scoreColor }} /></div>
                      <span className="mono" style={{ fontSize: 11 }}>{s.score}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Heatmap() {
  const cells = useMemo(() => Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => Math.random())), []);
  return (
    <Card className="fd-pad">
      <CardHead title="Event Heatmap" desc="Detected events by hour, last 7 days" />
      <div className="fd-heatdaylabels">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="fd-heatrowwrap">
        <div className="fd-heathours">{["00", "04", "08", "12", "16", "20"].map((h) => <span key={h}>{h}</span>)}</div>
        <div className="fd-heatmap">
          {cells.map((col, d) => (
            <div className="fd-heatcol" key={d}>
              {col.map((v, h) => {
                let bg = "var(--surface-2)";
                if (v > 0.93) bg = "var(--crit)"; else if (v > 0.8) bg = "var(--warn)"; else if (v > 0.6) bg = "var(--brand-dim)";
                return <div className="fd-heatcell" style={{ background: bg }} key={h} title={`Day ${d + 1}, ${h}:00`} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

const EVENTS_MINI = [
  { sev: "crit", title: "Unauthorized entry — perimeter-north", meta: ["EVT-4821", "4m open", "1 stream"], tag: "Critical" },
  { sev: "warn", title: "Vehicle congestion — traffic-junction-9", meta: ["EVT-4819", "19m open", "1 stream"], tag: "Watching" },
  { sev: "warn", title: "PPE violation — loading-dock-03", meta: ["EVT-4814", "44m open", "1 stream"], tag: "Watching" },
] as const;

function EventsMini() {
  return (
    <Card className="fd-pad">
      <CardHead title="Active Events" desc="Auto-correlated across streams" />
      <div>
        {EVENTS_MINI.map((i, idx) => {
          const color = i.sev === "crit" ? "var(--crit)" : "var(--warn)";
          const bg = i.sev === "crit" ? "var(--crit-dim)" : "var(--warn-dim)";
          return (
            <div className="fd-incident" key={idx}>
              <div className="fd-incsev" style={{ background: color }} />
              <div style={{ flex: 1 }}>
                <div className="fd-inctitle"><span>{i.title}</span><span className="fd-inctag" style={{ background: bg, color }}>{i.tag}</span></div>
                <div className="fd-incmeta mono">{i.meta.map((m, j) => <span key={j}>{m}</span>)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function KpiStrip() {
  const items = [
    { label: "Active streams", val: "164", icon: "camera", bg: "var(--brand-dim)", fg: "var(--brand)", delta: <Delta dir="up">+12 today</Delta> },
    { label: "Frame processing", val: "2.4M / hr", icon: "chart", bg: "var(--predict-dim)", fg: "var(--predict)", delta: <Delta dir="up">+6.1%</Delta> },
    { label: "Detection accuracy", val: "98.7%", icon: "target", bg: "var(--good-dim)", fg: "var(--good)", delta: <Delta dir="up">+0.4%</Delta> },
    { label: "GPU utilization", val: "71%", icon: "cpu", bg: "var(--warn-dim)", fg: "var(--warn)", delta: <Delta dir="flat">Nominal load</Delta> },
    { label: "Stream latency", val: "82 ms", icon: "clock", bg: "var(--brand-dim)", fg: "var(--brand)", delta: <Delta dir="down">−9ms vs. yday</Delta> },
    { label: "System throughput", val: "4.8x", icon: "shield", bg: "var(--good-dim)", fg: "var(--good)", delta: <Delta dir="up">Best in class</Delta> },
  ];
  return (
    <div className="fd-kpigrid">
      {items.map((it, i) => (
        <Card className="fd-kpi" key={i}>
          <div className="fd-kpitop">
            <span className="fd-kpilabel">{it.label}</span>
            <div className="fd-kpiicon" style={{ background: it.bg, color: it.fg }}><Ic name={it.icon} size={15} /></div>
          </div>
          <div className="fd-kpival mono">{it.val}</div>
          {it.delta}
        </Card>
      ))}
    </div>
  );
}

function CommandCenter() {
  const { navigate, toast } = useApp();
  return (
    <>
      <SectionHead
        eyebrow="Live: all pipelines reporting"
        title="Command Center"
        sub="Real-time video intelligence across every stream, correlated and explained by FrameDock's AI pipeline."
        actions={<>
          <button className="fd-btn" onClick={() => {
            const rows = STREAMS.map((s) => `${s.name},${s.location},${s.status},${s.fps},${s.det},${s.score}`).join("\n");
            downloadTextFile("framedock-command-center-report.csv", "stream,location,status,frame_rate,detections,anomaly_score\n" + rows);
            toast("Report exported.");
          }}><Ic name="download" size={15} />Export report</button>
          <button className="fd-btn fd-btnprimary" onClick={() => { navigate("integrations"); toast("Choose a source to connect."); }}><Ic name="plus" size={15} />Connect source</button>
        </>}
      />
      <KpiStrip />
      <LiveViewGrid />
      <div className="fd-gridmain"><PulseChart /><InsightsFeed /></div>
      <div className="fd-gridmain"><Pipeline /><InfraGauges /></div>
      <StreamTable />
      <div className="fd-gridbottom"><Heatmap /><EventsMini /></div>
    </>
  );
}

/* ================================================================
   SECTION: Stream Explorer
   ================================================================ */

function StreamExplorer() {
  const { toast } = useApp();
  const [stream, setStream] = useState("All streams");
  const [range, setRange] = useState("24h");
  const [tag, setTag] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [region, setRegion] = useState("all regions");
  const [tier, setTier] = useState("all tiers");
  const [runCount, setRunCount] = useState(0);
  const chart = useMemo(() => genSeries(40, 50, 14), [stream, range, runCount]);
  const chart2 = useMemo(() => genSeries(40, 30, 10), [stream, range, runCount]);
  return (
    <>
      <SectionHead eyebrow="Explore" title="Stream Explorer" sub="Query, compare and break down any stream metric across your fleet." />
      <Card className="fd-pad" style={{ marginBottom: 16 }}>
        <div className="fd-filterbar">
          <select className="fd-select" value={stream} onChange={(e) => setStream(e.target.value)}>
            {["All streams", "perimeter-north", "traffic-junction-9", "loading-dock-03", "front-entrance-01"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="fd-select" value={range} onChange={(e) => setRange(e.target.value)}>
            {["1h", "6h", "24h", "7d", "30d"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <input className="fd-select" style={{ flex: 1, minWidth: 160 }} placeholder="Filter by tag: site:warehouse-a" value={tag} onChange={(e) => setTag(e.target.value)} />
          <button className="fd-btn fd-btnsm" onClick={() => setShowMore((s) => !s)}><Ic name="filter" size={13} />{showMore ? "Fewer filters" : "More filters"}</button>
        </div>
        {showMore && (
          <div className="fd-filterbar" style={{ marginTop: 10 }}>
            <select className="fd-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              {["all regions", "ap-south-1", "us-east-1", "eu-west-1"].map((r) => <option key={r}>{r}</option>)}
            </select>
            <select className="fd-select" value={tier} onChange={(e) => setTier(e.target.value)}>
              {["all tiers", "tier-1 (critical site)", "tier-2", "tier-3"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <button className="fd-btn fd-btnsm fd-btnprimary" onClick={() => { setRunCount((c) => c + 1); toast(`Filtered to ${region} · ${tier}.`); }}>Apply</button>
          </div>
        )}
      </Card>
      <div className="fd-gridmain">
        <Card className="fd-pad">
          <CardHead title="Frame rate" desc={`${stream} · last ${range}`} />
          <MiniLineChart data={chart} color="var(--brand)" />
        </Card>
        <Card className="fd-pad">
          <CardHead title="Ingest bitrate" desc={`${stream} · last ${range}`} />
          <MiniLineChart data={chart2} color="var(--predict)" />
        </Card>
      </div>
      <div className="fd-gridmain">
        <Card className="fd-pad">
          <CardHead title="Saved queries" desc="Reusable stream expressions" />
          <div className="fd-listrows">
            {["avg(fps) by stream", "sum(detections) / sum(frames)", "p95(decode_latency)", "rate(dropped_frames_total)"].map((q) => (
              <div className="fd-listrow" key={q}>
                <span className="mono">{q}</span>
                <button className="fd-btn fd-btnsm" onClick={() => { setRunCount((c) => c + 1); toast(`Query executed: ${q}`); }}>Run</button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="fd-pad">
          <CardHead title="Top movers" desc="Largest change vs. previous period" />
          <div className="fd-listrows">
            {[
              { n: "perimeter-north frame rate", d: "-61%", bad: true },
              { n: "front-entrance-01 uptime", d: "+2.1%", bad: false },
              { n: "traffic-junction-9 detections", d: "+88%", bad: true },
              { n: "yard-camera-05 dropped frames", d: "-24%", bad: false },
            ].map((m) => (
              <div className="fd-listrow" key={m.n}>
                <span>{m.n}</span>
                <Delta dir={m.bad ? "down" : "up"}>{m.d}</Delta>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const W = 660, H = 200;
  const step = W / (data.length - 1);
  const d = data.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(H - (p / max) * H * 0.85).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 200 }}>
      {[0.25, 0.5, 0.75].map((g, i) => <line key={i} x1={0} y1={H * g} x2={W} y2={H * g} stroke="var(--border-soft)" strokeWidth={1} />)}
      <path d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ================================================================
   SECTION: Event Detection
   ================================================================ */

const DETECTED_EVENTS = [
  { stream: "perimeter-north", cls: "unauthorized_entry", conf: "97.4%", sev: "critical", detected: "4m ago", status: "Open" },
  { stream: "traffic-junction-9", cls: "vehicle_congestion", conf: "88.1%", sev: "watch", detected: "19m ago", status: "Investigating" },
  { stream: "loading-dock-03", cls: "ppe_violation", conf: "81.6%", sev: "watch", detected: "44m ago", status: "Investigating" },
  { stream: "checkout-lane-02", cls: "queue_buildup", conf: "76.2%", sev: "healthy", detected: "2h ago", status: "Resolved" },
  { stream: "front-entrance-01", cls: "loitering", conf: "69.9%", sev: "healthy", detected: "3h ago", status: "Resolved" },
  { stream: "yard-camera-05", cls: "object_left_behind", conf: "74.0%", sev: "healthy", detected: "5h ago", status: "Resolved" },
] as const;

const EVENT_BOXES: FrameBox[] = [
  { label: "person 97%", x: 54, y: 22, w: 20, h: 54, color: "var(--crit)" },
  { label: "vehicle 88%", x: 18, y: 40, w: 30, h: 28, color: "var(--warn)" },
  { label: "no-vest 82%", x: 36, y: 34, w: 24, h: 40, color: "var(--warn)" },
];

function DetectionSnapshots() {
  return (
    <Card className="fd-pad" style={{ marginBottom: 16 }}>
      <CardHead title="Recent detections" desc="Latest frames flagged by the pipeline, with the model's own bounding boxes" />
      <div className="fd-framegridwrap">
        {DETECTED_EVENTS.slice(0, 3).map((e, i) => (
          <div key={e.stream}>
            <FrameTile seed={i + 2} boxes={[EVENT_BOXES[i]]} res="1080p" fps="frame @ detection" />
            <div className="fd-frametilemeta">
              <span className="fd-svcname" style={{ fontSize: 12.5 }}>{e.cls}</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{e.conf}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EventDetection() {
  const [sensitivity, setSensitivity] = useState(72);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const rows = DETECTED_EVENTS.filter((a) => filter === "all" || (filter === "open" ? a.status !== "Resolved" : a.status === "Resolved"));
  return (
    <>
      <SectionHead eyebrow="Detection" title="Event Detection" sub="Computer-vision models watching every frame for the moments that matter." />
      <div className="fd-gridmain" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 16 }}>
        <Card className="fd-kpi"><div className="fd-kpilabel">Detectors active</div><div className="fd-kpival mono">312</div><Delta dir="up">+4 this week</Delta></Card>
        <Card className="fd-kpi"><div className="fd-kpilabel">Open events</div><div className="fd-kpival mono">6</div><Delta dir="down">−2 vs. yday</Delta></Card>
        <Card className="fd-kpi"><div className="fd-kpilabel">False-positive rate</div><div className="fd-kpival mono">3.1%</div><Delta dir="up">−1.2%</Delta></Card>
      </div>
      <DetectionSnapshots />
      <Card className="fd-pad" style={{ marginBottom: 16 }}>
        <CardHead title="Detection sensitivity" desc="Higher sensitivity surfaces smaller deviations sooner, at the cost of more noise." />
        <div className="fd-sliderrow">
          <input type="range" min={0} max={100} value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className="fd-slider" />
          <span className="mono fd-sliderval">{sensitivity}%</span>
        </div>
      </Card>
      <Card className="fd-pad">
        <CardHead title="Detected events" desc="AI-scored events across the fleet"
          right={
            <div className="fd-tabset">
              {(["all", "open", "resolved"] as const).map((f) => (
                <span key={f} className={`fd-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</span>
              ))}
            </div>
          } />
        <div className="fd-tablewrap">
          <table className="fd-table">
            <thead><tr><th>Stream</th><th>Event class</th><th>Confidence</th><th>Severity</th><th>Detected</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((a, i) => (
                <tr className="fd-row" key={i}>
                  <td className="fd-svcname">{a.stream}</td>
                  <td className="mono">{a.cls}</td>
                  <td className="mono">{a.conf}</td>
                  <td><StatusPill status={a.sev as any} /></td>
                  <td className="mono">{a.detected}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Capacity Forecast
   ================================================================ */

function CapacityForecast() {
  return (
    <>
      <SectionHead eyebrow="Forecast" title="Capacity Forecast" sub="Where your ingest and GPU capacity are headed, before you get paged." />
      <div className="fd-gridmain">
        <Card className="fd-pad">
          <CardHead title="Ingest capacity forecast" desc="Projected stream volume vs. provisioned GPU capacity" />
          <ForecastChart />
          <div className="fd-legend">
            <div className="fd-legenditem"><span className="fd-swatch" style={{ background: "var(--brand)" }} />Actual</div>
            <div className="fd-legenditem"><span className="fd-swatch dashed" />Forecast</div>
            <div className="fd-legenditem"><span className="fd-swatch" style={{ background: "var(--crit)" }} />Capacity ceiling</div>
          </div>
        </Card>
        <Card className="fd-pad">
          <CardHead title="Risk timeline" desc="Next 72 hours" />
          <div className="fd-listrows">
            {[
              { t: "Thu 03:00 UTC", d: "Ingest volume crosses provisioned GPU capacity", risk: "critical" },
              { t: "Thu 14:00 UTC", d: "perimeter-north likely to breach 15fps floor", risk: "watch" },
              { t: "Fri 09:00 UTC", d: "Scheduled retraining job may amplify inference load", risk: "watch" },
              { t: "Sat 00:00 UTC", d: "Low-traffic window, safe for maintenance", risk: "healthy" },
            ].map((r, i) => (
              <div className="fd-listrow" key={i}>
                <div><div style={{ fontWeight: 600, fontSize: 12.5 }}>{r.d}</div><div className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{r.t}</div></div>
                <StatusPill status={r.risk as any} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="fd-pad">
        <CardHead title="Model confidence by stream" desc="How much FrameDock trusts its own forecast" />
        <div className="fd-listrows">
          {STREAMS.map((s, i) => {
            const conf = [61, 74, 88, 96, 94, 99][i];
            return (
              <div className="fd-listrow" key={s.name}>
                <span className="fd-svcname">{s.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
                  <div className="fd-scorebar" style={{ width: 120 }}><div style={{ width: `${conf}%`, background: "var(--predict)" }} /></div>
                  <span className="mono" style={{ fontSize: 11 }}>{conf}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function ForecastChart() {
  const { d1, d2, ceiling } = useMemo(() => {
    const actual = genSeries(24, 40, 12);
    const forecast = genSeries(12, actual[actual.length - 1], 10);
    const W = 660, max = 100;
    const stepA = (W * 0.65) / (actual.length - 1);
    const stepF = (W * 0.35) / (forecast.length - 1);
    let d1 = actual.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * stepA).toFixed(1)} ${(200 - (p / max) * 180).toFixed(1)}`).join(" ");
    const lastX = (actual.length - 1) * stepA, lastY = 200 - (actual[actual.length - 1] / max) * 180;
    let d2 = `M ${lastX.toFixed(1)} ${lastY.toFixed(1)} `;
    forecast.forEach((p, i) => { const x = lastX + (i + 1) * stepF, y = 200 - (p / max) * 180; d2 += `L ${x.toFixed(1)} ${y.toFixed(1)} `; });
    return { d1, d2, ceiling: 200 - (78 / max) * 180 };
  }, []);
  return (
    <svg viewBox="0 0 660 200" style={{ width: "100%", height: 200 }}>
      <line x1={0} y1={ceiling} x2={660} y2={ceiling} stroke="var(--crit)" strokeWidth={1.5} strokeDasharray="3 4" />
      <path d={d1} fill="none" stroke="var(--brand)" strokeWidth={2.2} strokeLinecap="round" />
      <path d={d2} fill="none" stroke="var(--predict)" strokeWidth={2.2} strokeDasharray="6 5" strokeLinecap="round" />
    </svg>
  );
}

/* ================================================================
   SECTION: Pipeline Diagnostics
   ================================================================ */

function PipelineDiagnostics() {
  const nodes = [
    { id: "ingest", label: "Ingestion Gateway", x: 60, y: 100, status: "healthy" },
    { id: "extract", label: "Frame Extraction", x: 220, y: 40, status: "watch" },
    { id: "gpu", label: "GPU Inference Pool", x: 220, y: 160, status: "critical" },
    { id: "detect", label: "Event Detector", x: 400, y: 100, status: "watch" },
    { id: "analytics", label: "Analytics Engine", x: 570, y: 40, status: "healthy" },
    { id: "dash", label: "Dashboard Feed", x: 570, y: 160, status: "healthy" },
  ] as const;
  const edges = [["ingest", "extract"], ["ingest", "gpu"], ["extract", "detect"], ["gpu", "detect"], ["detect", "analytics"], ["detect", "dash"]];
  const colorOf = (s: string) => s === "critical" ? "var(--crit)" : s === "watch" ? "var(--warn)" : "var(--good)";
  const find = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <>
      <SectionHead eyebrow="Diagnose" title="Pipeline Diagnostics" sub="Auto-correlated dependency graph tracing a stall back to its source stage." />
      <Card className="fd-pad" style={{ marginBottom: 16 }}>
        <CardHead title="Pipeline dependency graph" desc="perimeter-north frame-rate collapse, EVT-4821" />
        <svg viewBox="0 0 640 210" style={{ width: "100%", height: 260 }}>
          {edges.map(([a, b], i) => { const A = find(a), B = find(b); return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--border)" strokeWidth={1.5} />; })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={26} fill="var(--surface-2)" stroke={colorOf(n.status)} strokeWidth={2} />
              <circle cx={n.x} cy={n.y} r={4} fill={colorOf(n.status)} />
              <text x={n.x} y={n.y + 42} textAnchor="middle" fontSize={11} fill="var(--text-dim)" fontFamily="Inter, sans-serif">{n.label}</text>
            </g>
          ))}
        </svg>
      </Card>
      <Card className="fd-pad">
        <CardHead title="Correlated signals" desc="Ranked by contribution to root cause" />
        <div className="fd-listrows">
          {[
            { s: "GPU inference pool → queue saturation", c: 96 },
            { s: "Frame extraction → decode backlog rising", c: 74 },
            { s: "Event detector → downstream timeout retries", c: 58 },
            { s: "Ingestion gateway → healthy, ruled out", c: 6 },
          ].map((r, i) => (
            <div className="fd-listrow" key={i}>
              <span>{r.s}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="fd-scorebar" style={{ width: 120 }}><div style={{ width: `${r.c}%`, background: r.c > 70 ? "var(--crit)" : r.c > 30 ? "var(--warn)" : "var(--good)" }} /></div>
                <span className="mono" style={{ fontSize: 11 }}>{r.c}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Infrastructure
   ================================================================ */

const NODES = [
  { name: "gpu-node-a1", role: "inference", region: "ap-south-1a", gpu: 71, vram: 58, status: "watch" },
  { name: "gpu-node-a2", role: "inference", region: "ap-south-1b", gpu: 44, vram: 39, status: "healthy" },
  { name: "gpu-node-b1", role: "training", region: "ap-south-1a", gpu: 88, vram: 92, status: "critical" },
  { name: "ingest-node-01", role: "ingestion", region: "ap-south-1b", gpu: 33, vram: 41, status: "healthy" },
  { name: "edge-node-14", role: "edge", region: "us-east-1a", gpu: 27, vram: 63, status: "healthy" },
  { name: "cache-node-03", role: "cache", region: "us-east-1b", gpu: 52, vram: 77, status: "watch" },
] as const;

function Infrastructure() {
  return (
    <>
      <SectionHead eyebrow="Infrastructure" title="Infrastructure" sub="Every GPU node, edge device and cluster feeding the pipeline." />
      <div className="fd-gridmain" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 16 }}>
        <Card className="fd-kpi"><div className="fd-kpilabel">Nodes online</div><div className="fd-kpival mono">142 / 146</div><Delta dir="flat">97.2% healthy</Delta></Card>
        <Card className="fd-kpi"><div className="fd-kpilabel">GPU clusters</div><div className="fd-kpival mono">9</div><Delta dir="up">3 regions</Delta></Card>
        <Card className="fd-kpi"><div className="fd-kpilabel">Avg GPU utilization</div><div className="fd-kpival mono">58%</div><Delta dir="up">+6% today</Delta></Card>
        <Card className="fd-kpi"><div className="fd-kpilabel">Avg VRAM</div><div className="fd-kpival mono">61%</div><Delta dir="flat">stable</Delta></Card>
      </div>
      <Card className="fd-pad">
        <CardHead title="Node fleet" desc="Compute resources across regions" />
        <div className="fd-tablewrap">
          <table className="fd-table">
            <thead><tr><th>Node</th><th>Role</th><th>Region</th><th>GPU</th><th>VRAM</th><th>Status</th></tr></thead>
            <tbody>
              {NODES.map((n) => (
                <tr className="fd-row" key={n.name}>
                  <td className="mono">{n.name}</td>
                  <td>{n.role}</td>
                  <td className="mono">{n.region}</td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="fd-scorebar"><div style={{ width: `${n.gpu}%`, background: n.gpu > 80 ? "var(--crit)" : n.gpu > 60 ? "var(--warn)" : "var(--good)" }} /></div><span className="mono" style={{ fontSize: 11 }}>{n.gpu}%</span></div></td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="fd-scorebar"><div style={{ width: `${n.vram}%`, background: n.vram > 80 ? "var(--crit)" : n.vram > 60 ? "var(--warn)" : "var(--good)" }} /></div><span className="mono" style={{ fontSize: 11 }}>{n.vram}%</span></div></td>
                  <td><StatusPill status={n.status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Events & Alerts
   ================================================================ */

const EVENTS_FULL = [
  { id: "EVT-4821", title: "Unauthorized entry — perimeter-north", sev: "critical", status: "Open", opened: "4m ago", streams: 1, owner: "Unassigned" },
  { id: "EVT-4819", title: "Vehicle congestion — traffic-junction-9", sev: "watch", status: "Investigating", opened: "19m ago", streams: 1, owner: "Unassigned" },
  { id: "EVT-4814", title: "PPE violation — loading-dock-03", sev: "watch", status: "Investigating", opened: "44m ago", streams: 1, owner: "S. Fernando" },
  { id: "EVT-4801", title: "Queue buildup — checkout-lane-02", sev: "healthy", status: "Resolved", opened: "Yesterday", streams: 1, owner: "R. Berugoda" },
  { id: "EVT-4788", title: "Object left behind — yard-camera-05", sev: "healthy", status: "Resolved", opened: "2 days ago", streams: 1, owner: "M. Perera" },
] as const;

function EventsAlerts() {
  const { toast } = useApp();
  type EventRow = { id: string; title: string; sev: "critical" | "watch" | "healthy"; status: string; opened: string; streams: number; owner: string };
  const [list, setList] = useState<EventRow[]>(() => EVENTS_FULL.map((i) => ({ ...i })));
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [sev, setSev] = useState<"critical" | "watch" | "healthy">("watch");
  const rows = list.filter((i) => filter === "all" || (filter === "open" ? i.status !== "Resolved" : i.status === "Resolved"));

  function createAlert(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast("Give the alert a title first."); return; }
    const id = `EVT-${4822 + list.length}`;
    setList((l) => [{ id, title: title.trim(), sev, status: sev === "healthy" ? "Resolved" : "Open", opened: "Just now", streams: 1, owner: "You" }, ...l]);
    setTitle(""); setSev("watch"); setShowForm(false);
    toast(`${id} created.`);
  }

  return (
    <>
      <SectionHead eyebrow="Events" title="Events & Alerts" sub="Every detected event, auto-correlated and tracked to resolution."
        actions={<button className="fd-btn fd-btnprimary" onClick={() => setShowForm((s) => !s)}><Ic name={showForm ? "x" : "plus"} size={15} />{showForm ? "Cancel" : "New alert"}</button>} />
      {showForm && (
        <Card className="fd-pad" style={{ marginBottom: 16 }}>
          <form onSubmit={createAlert} className="fd-filterbar" style={{ alignItems: "center" }}>
            <input className="fd-select" style={{ flex: 1, minWidth: 200 }} placeholder="Alert title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            <select className="fd-select" value={sev} onChange={(e) => setSev(e.target.value as any)}>
              <option value="critical">Critical</option>
              <option value="watch">Watching</option>
              <option value="healthy">Resolved</option>
            </select>
            <button className="fd-btn fd-btnprimary" type="submit">Create</button>
          </form>
        </Card>
      )}
      <Card className="fd-pad">
        <CardHead title="All events" desc="Sorted by most recent"
          right={<div className="fd-tabset">{(["all", "open", "resolved"] as const).map((f) => <span key={f} className={`fd-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</span>)}</div>} />
        <div className="fd-tablewrap">
          <table className="fd-table">
            <thead><tr><th>ID</th><th>Title</th><th>Severity</th><th>Status</th><th>Opened</th><th>Streams</th><th>Owner</th></tr></thead>
            <tbody>
              {rows.map((i) => (
                <tr className="fd-row" key={i.id}>
                  <td className="mono">{i.id}</td>
                  <td className="fd-svcname">{i.title}</td>
                  <td><StatusPill status={i.sev as any} /></td>
                  <td>{i.status}</td>
                  <td className="mono">{i.opened}</td>
                  <td>{i.streams}</td>
                  <td>{i.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Integrations
   ================================================================ */

const INTEGRATIONS = [
  { name: "RTSP / ONVIF Gateway", cat: "Ingestion", icon: "camera" },
  { name: "NVIDIA DeepStream", cat: "Inference", icon: "cpu" },
  { name: "AWS S3", cat: "Cloud storage", icon: "server" },
  { name: "Google Cloud Storage", cat: "Cloud storage", icon: "server" },
  { name: "Kafka", cat: "Streaming", icon: "ingest" },
  { name: "Slack", cat: "Alerting", icon: "bell" },
  { name: "PagerDuty", cat: "Alerting", icon: "bolt" },
  { name: "Datadog", cat: "Observability", icon: "chart" },
  { name: "Snowflake", cat: "Analytics", icon: "layers" },
];

function Integrations() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ "RTSP / ONVIF Gateway": true, "NVIDIA DeepStream": true, Slack: true });
  return (
    <>
      <SectionHead eyebrow="Connect" title="Integrations" sub="Bring every camera, cloud archive and alerting tool into one pipeline." />
      <div className="fd-intgrid">
        {INTEGRATIONS.map((it) => {
          const on = !!connected[it.name];
          return (
            <Card className="fd-pad fd-intcard" key={it.name}>
              <div className="fd-inticon"><Ic name={it.icon} size={18} /></div>
              <div style={{ flex: 1 }}>
                <div className="fd-svcname">{it.name}</div>
                <div className="fd-svcsub">{it.cat}</div>
              </div>
              <button className={`fd-btn fd-btnsm ${on ? "" : "fd-btnprimary"}`} onClick={() => setConnected((c) => ({ ...c, [it.name]: !on }))}>
                {on ? "Connected" : "Connect"}
              </button>
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ================================================================
   SECTION: Reports
   ================================================================ */

const FREQ_OPTIONS = ["Daily · 09:00", "Weekly · Mondays 08:00", "Bi-weekly", "Monthly · 1st"];

function Reports() {
  const { toast } = useApp();
  const [reports, setReports] = useState([
    { name: "Weekly Stream Health Summary", freq: "Weekly · Mondays 08:00", last: "Jul 8, 2026" },
    { name: "Monthly Detection Accuracy Report", freq: "Monthly · 1st", last: "Jul 1, 2026" },
    { name: "Daily Event Digest", freq: "Daily · 09:00", last: "Today" },
    { name: "Capacity Planning Report", freq: "Bi-weekly", last: "Jun 28, 2026" },
  ]);
  const [editing, setEditing] = useState<string | null>(null);

  function scheduleReport() {
    const name = `Custom Report ${reports.length + 1}`;
    setReports((r) => [...r, { name, freq: "Weekly · Mondays 08:00", last: "Not yet sent" }]);
    toast(`${name} scheduled.`);
  }
  function download(r: { name: string; freq: string; last: string }) {
    downloadTextFile(`${r.name.replace(/\s+/g, "-").toLowerCase()}.txt`,
      `FrameDock report: ${r.name}\nSchedule: ${r.freq}\nLast sent: ${r.last}\n\nThis is a generated placeholder export.`);
    toast(`${r.name} downloaded.`);
  }
  return (
    <>
      <SectionHead eyebrow="Reports" title="Reports" sub="Scheduled and on-demand summaries for stakeholders."
        actions={<button className="fd-btn fd-btnprimary" onClick={scheduleReport}><Ic name="plus" size={15} />Schedule report</button>} />
      <Card className="fd-pad">
        <CardHead title="Scheduled reports" desc="Auto-generated and delivered" />
        <div className="fd-listrows">
          {reports.map((r) => (
            <div key={r.name}>
              <div className="fd-listrow">
                <div><div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div><div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{r.freq} · last sent {r.last}</div></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="fd-btn fd-btnsm" onClick={() => download(r)}><Ic name="download" size={13} />Download</button>
                  <button className="fd-btn fd-btnsm" onClick={() => setEditing(editing === r.name ? null : r.name)}>{editing === r.name ? "Close" : "Edit"}</button>
                </div>
              </div>
              {editing === r.name && (
                <div className="fd-filterbar" style={{ paddingBottom: 12 }}>
                  <select className="fd-select" value={r.freq} onChange={(e) => {
                    const freq = e.target.value;
                    setReports((rs) => rs.map((x) => (x.name === r.name ? { ...x, freq } : x)));
                  }}>
                    {FREQ_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                  </select>
                  <button className="fd-btn fd-btnsm fd-btnprimary" onClick={() => { setEditing(null); toast(`${r.name} updated.`); }}>Save</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Developer API
   ================================================================ */

function randomKey() {
  const chars = "abcdef0123456789";
  let s = "fd_live_sk_";
  for (let i = 0; i < 32; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function DeveloperAPI() {
  const { toast } = useApp();
  const [revealed, setRevealed] = useState(false);
  const [key, setKey] = useState("fd_live_sk_8f2a1c9d7e4b6019a2f3c8b7d1e5a904");
  const masked = key.slice(0, 12) + "•".repeat(18) + key.slice(-4);
  return (
    <>
      <SectionHead eyebrow="Build" title="Developer API" sub="Pull stream telemetry, events and predictions into your own tools." />
      <div className="fd-gridmain">
        <Card className="fd-pad">
          <CardHead title="API key" desc="Use this key to authenticate requests" />
          <div className="fd-listrow" style={{ borderTop: "none", paddingTop: 0 }}>
            <span className="mono" style={{ fontSize: 12.5 }}>{revealed ? key : masked}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="fd-btn fd-btnsm" onClick={() => setRevealed((r) => !r)}><Ic name="eye" size={13} />{revealed ? "Hide" : "Reveal"}</button>
              <button className="fd-btn fd-btnsm" onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(key).catch(() => {});
                toast("API key copied.");
              }}><Ic name="copy" size={13} />Copy</button>
              <button className="fd-btn fd-btnsm" onClick={() => { setKey(randomKey()); setRevealed(false); toast("API key rotated. Update your integrations."); }}>Rotate</button>
            </div>
          </div>
        </Card>
        <Card className="fd-pad">
          <CardHead title="Docs" desc="Reference & guides" />
          <div className="fd-listrows">
            {["Quickstart", "Stream ingestion API", "Event query language reference", "Webhooks"].map((d) => (
              <div className="fd-listrow" key={d} onClick={() => toast(`${d}: docs coming soon.`)} style={{ cursor: "pointer" }}><span>{d}</span><Ic name="chevron" size={13} /></div>
            ))}
          </div>
          <span className="fd-nvidia" style={{ background: "var(--brand-dim)", color: "var(--brand)", borderColor: "transparent" }}>Full docs coming soon</span>
        </Card>
      </div>
      <Card className="fd-pad">
        <CardHead title="Example request" desc="Fetch the last hour of events for a stream" />
        <pre className="fd-code mono">{`curl https://api.framedock.one/v1/events/query \\
  -H "Authorization: Bearer ${masked}" \\
  -d '{"stream":"perimeter-north","range":"1h"}'`}</pre>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Account / Settings  (frontend only)
   ================================================================ */

function AccountSettings() {
  const { toast } = useApp();
  const [name, setName] = useState("Admin User");
  const [email] = useState("admin@framedock.one");
  const [role, setRole] = useState("Admin · Platform Operations");
  const [savedMsg, setSavedMsg] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  const [sessions, setSessions] = useState([
    { id: 1, label: "Chrome · Colombo, LK", you: true },
    { id: 2, label: "Safari · Colombo, LK", you: false },
  ]);
  const [deactivated, setDeactivated] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setPhoto(reader.result as string); toast("Photo updated."); };
    reader.readAsDataURL(file);
  }
  function signOutSession(id: number) {
    setSessions((s) => s.filter((x) => x.id !== id));
    toast("Signed out of that device.");
  }
  function deactivateAccount() {
    if (window.confirm("Deactivate your account? This can't be undone here.")) {
      setDeactivated(true);
      toast("Account deactivated.");
    }
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavedMsg("Profile updated.");
    setTimeout(() => setSavedMsg(""), 2500);
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!curPw || !newPw || !confirmPw) { setPwMsg({ type: "error", text: "Fill in all password fields." }); return; }
    if (newPw.length < 8) { setPwMsg({ type: "error", text: "New password must be at least 8 characters." }); return; }
    if (newPw !== confirmPw) { setPwMsg({ type: "error", text: "New password and confirmation don't match." }); return; }
    setPwMsg({ type: "success", text: "Password changed successfully." });
    setCurPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwMsg(null), 3000);
  }

  return (
    <>
      <SectionHead eyebrow="Account" title="Settings" sub="Manage your profile, security and notification preferences." />

      <div className="fd-gridmain">
        <Card className="fd-pad">
          <CardHead title="Profile" desc="Your identity across FrameDock" />
          <form onSubmit={saveProfile}>
            <div className="fd-formrow">
              <div className="avatar" style={{ width: 56, height: 56, fontSize: 18, backgroundImage: photo ? `url(${photo})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
                {!photo && name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              <button type="button" className="fd-btn fd-btnsm" onClick={() => fileInputRef.current?.click()}><Ic name="image" size={13} />Change photo</button>
            </div>
            <label className="fd-label">Full name</label>
            <input className="fd-input" value={name} onChange={(e) => setName(e.target.value)} />
            <label className="fd-label">Email address</label>
            <input className="fd-input" value={email} disabled />
            <label className="fd-label">Role</label>
            <input className="fd-input" value={role} onChange={(e) => setRole(e.target.value)} />
            <div className="fd-formfoot">
              {savedMsg && <span className="fd-msg fd-msgsuccess">{savedMsg}</span>}
              <button className="fd-btn fd-btnprimary" type="submit">Save changes</button>
            </div>
          </form>
        </Card>

        <Card className="fd-pad">
          <CardHead title="Change password" desc="Choose a strong password you don't use elsewhere" />
          <form onSubmit={changePassword}>
            <label className="fd-label">Current password</label>
            <input className="fd-input" type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} placeholder="••••••••" />
            <label className="fd-label">New password</label>
            <input className="fd-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 8 characters" />
            <label className="fd-label">Confirm new password</label>
            <input className="fd-input" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password" />
            <div className="fd-formfoot">
              {pwMsg && <span className={`fd-msg ${pwMsg.type === "error" ? "fd-msgerror" : "fd-msgsuccess"}`}>{pwMsg.text}</span>}
              <button className="fd-btn fd-btnprimary" type="submit">Update password</button>
            </div>
          </form>
        </Card>
      </div>

      <div className="fd-gridmain">
        <Card className="fd-pad">
          <CardHead title="Notifications" desc="Choose how FrameDock reaches you" />
          <div className="fd-listrow" style={{ borderTop: "none", paddingTop: 4 }}><span>Email alerts for critical events</span><Toggle checked={notifEmail} onChange={setNotifEmail} /></div>
          <div className="fd-listrow"><span>Slack notifications</span><Toggle checked={notifSlack} onChange={setNotifSlack} /></div>
          <div className="fd-listrow"><span>Weekly digest email</span><Toggle checked={notifDigest} onChange={setNotifDigest} /></div>
        </Card>

        <Card className="fd-pad">
          <CardHead title="Sessions" desc="Where you're signed in" />
          <div className="fd-listrows">
            {sessions.map((s) => (
              <div className="fd-listrow" key={s.id}>
                <span>{s.label}{s.you && <span style={{ color: "var(--good)", fontWeight: 600 }}> · This device</span>}</span>
                {s.you ? <span className="mono" style={{ fontSize: 11 }}>Active now</span> :
                  <button className="fd-btn fd-btnsm" onClick={() => signOutSession(s.id)}><Ic name="logout" size={13} />Sign out</button>}
              </div>
            ))}
            {sessions.length === 1 && <div style={{ fontSize: 12, color: "var(--text-faint)", paddingTop: 10 }}>No other active sessions.</div>}
          </div>
        </Card>
      </div>

      <Card className="fd-pad" style={{ borderColor: "var(--crit-dim)" }}>
        <CardHead title="Danger zone" desc="These actions are permanent" />
        <div className="fd-listrow" style={{ borderTop: "none", paddingTop: 4 }}>
          <span>Deactivate account{deactivated && <span style={{ color: "var(--crit)", fontWeight: 600 }}> · Deactivated</span>}</span>
          <button className="fd-btn" disabled={deactivated} style={{ color: "var(--crit)", borderColor: "var(--crit-dim)", opacity: deactivated ? 0.5 : 1 }} onClick={deactivateAccount}>
            <Ic name="trash" size={13} />{deactivated ? "Deactivated" : "Deactivate"}
          </button>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   Sidebar + Topbar
   ================================================================ */

const NAV: { group: string; items: { id: SectionId; label: string; icon: string; badge?: string; badgeColor?: string; live?: boolean }[] }[] = [
  { group: "Monitor", items: [
    { id: "command", label: "Command Center", icon: "grid", live: true },
    { id: "streams", label: "Stream Explorer", icon: "camera" },
    { id: "detection", label: "Event Detection", icon: "target", badge: "6" },
    { id: "forecast", label: "Capacity Forecast", icon: "bolt" },
  ]},
  { group: "Operations", items: [
    { id: "pipeline", label: "Pipeline Diagnostics", icon: "root" },
    { id: "infra", label: "Infrastructure", icon: "server" },
    { id: "events", label: "Events & Alerts", icon: "bell", badge: "3", badgeColor: "crit" },
    { id: "integrations", label: "Integrations", icon: "grid2" },
  ]},
  { group: "Account", items: [
    { id: "reports", label: "Reports", icon: "doc" },
    { id: "api", label: "Developer API", icon: "api" },
    { id: "account", label: "Settings", icon: "gear" },
  ]},
];

function BrandMark() {
  return (
    <div className="fd-brandmark">
      <Ic name="camera" size={20} />
    </div>
  );
}

function Sidebar({ active, onNavigate, open, onClose }: { active: SectionId; onNavigate: (s: SectionId) => void; open: boolean; onClose: () => void }) {
  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <>
      <div className={`fd-overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`fd-sidebar ${open ? "open" : ""}`}>
        <div className="fd-brand">
          <BrandMark />
          <div>
            <div className="fd-brandname">FrameDock</div>
            <div className="fd-brandsub">Video AI Pipeline</div>
          </div>
        </div>
        <nav className="fd-navscroll">
          {NAV.map((g) => (
            <div className="fd-navgroup" key={g.group}>
              <div className="fd-navlabel">{g.group}</div>
              {g.items.map((it) => (
                <a key={it.id} className={`fd-navitem ${active === it.id ? "active" : ""}`} onClick={() => onNavigate(it.id)}>
                  <Ic name={it.icon} size={17} />
                  {it.label}
                  {it.live && <span className="fd-livedot" />}
                  {it.badge && <span className="fd-badge" style={it.badgeColor === "crit" ? { background: "var(--crit-dim)", color: "var(--crit)" } : undefined}>{it.badge}</span>}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div className="fd-sidebarfoot">
          <div className="avatar">AU</div>
          <div><div className="fd-footname">Admin User</div><div className="fd-footrole">Admin · Platform Ops</div></div>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <button type="button" className="fd-btn fd-btnsm" onClick={handleSignOut}><Ic name="logout" size={13} />Sign out</button>
        </div>
      </aside>
    </>
  );
}

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Critical event on perimeter-north", body: "Unauthorized entry detected, EVT-4821 opened.", time: "4m ago", read: false, kind: "warn" as const },
  { id: 2, title: "Congestion pattern predicted", body: "traffic-junction-9 trending toward a queue-length breach.", time: "2m ago", read: false, kind: "predict" as const },
  { id: 3, title: "Capacity forecast updated", body: "Ingest volume nearing provisioned GPU capacity.", time: "1h ago", read: false, kind: "warn" as const },
  { id: 4, title: "Weekly Stream Health Summary sent", body: "Delivered to your inbox.", time: "3h ago", read: false, kind: "good" as const },
];

function Topbar({ onBurger, section, theme, onToggleTheme, user, onSignOut }: { onBurger: () => void; section: SectionId; theme: "light" | "dark"; onToggleTheme: () => void; user: User | null; onSignOut: () => void }) {
  const { toast, navigate } = useApp();
  const now = useLiveClock();
  const [latency, setLatency] = useState(82);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: SectionId; label: string }[]>([]);

  const sectionItems = NAV.flatMap((g) => g.items);

  useEffect(() => {
    const id = setInterval(() => setLatency(68 + Math.round(Math.random() * 40)), 2600);
    return () => clearInterval(id);
  }, []);

  const label = sectionItems.find((i) => i.id === section)?.label || "Command Center";

  const handleSearchChange = (value: string) => {
    setQuery(value);
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      setSearchResults([]);
      return;
    }

    const matches = sectionItems
      .filter((item) => item.label.toLowerCase().includes(normalized) || item.id.toLowerCase().includes(normalized))
      .slice(0, 6);

    setSearchResults(matches);
  };

  const activateSearchResult = (result: { id: SectionId; label: string }) => {
    navigate(result.id);
    setQuery("");
    setSearchResults([]);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchResults.length > 0) {
        activateSearchResult(searchResults[0]);
      }
    } else if (event.key === "Escape") {
      setQuery("");
      setSearchResults([]);
    }
  };

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="fd-topbar">
      <button className="fd-burger" onClick={onBurger} aria-label="Toggle menu"><Ic name="menu" size={20} /></button>
      <div className="fd-search" style={{ position: 'relative' }}>
        <Ic name="search" size={15} />
        <input
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder={`Search ${label.toLowerCase()}…`}
        />
        <span className="fd-kbd">⌘K</span>
        {searchResults.length > 0 && (
          <div className="fd-searchpanel">
            {searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                className="fd-searchitem"
                onClick={() => activateSearchResult(result)}
              >
                {result.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="fd-topbarright">
        <div className="fd-pill"><span className="fd-pulsedot" /><span className="mono">{latency}ms</span></div>
        <div className="fd-liveclock">
          <span className="mono fd-clocktime">{now.toISOString().substr(11, 8)}</span>
          <span className="fd-clockdate">UTC · {now.toISOString().substr(0, 10)}</span>
        </div>

        <div className="fd-notifwrap" ref={notifRef}>
          <button className="fd-iconbtn" aria-label="Notifications" onClick={() => setNotifOpen((o) => !o)}>
            <Ic name="bell" size={16} />
            {unread > 0 && <span className="fd-notifcount">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="fd-notifpanel">
              <div className="fd-notifhead">
                <span>Notifications</span>
                {unread > 0 && <button className="fd-notifmarkall" onClick={() => setNotifs((n) => n.map((x) => ({ ...x, read: true })))}>Mark all read</button>}
              </div>
              <div className="fd-notiflist">
                {notifs.length === 0 && <div className="fd-notifempty">You're all caught up.</div>}
                {notifs.map((n) => {
                  const k = KIND_STYLE[n.kind] || KIND_STYLE.signal;
                  return (
                    <div key={n.id} className={`fd-notifitem ${n.read ? "read" : ""}`} onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}>
                      <div className="fd-feedic" style={{ background: k.bg, color: k.fg, width: 26, height: 26 }}><Ic name={k.icon} size={12} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="fd-feedtitle"><span>{n.title}</span><span className="fd-feedtime mono">{n.time}</span></div>
                        <div className="fd-feedbody">{n.body}</div>
                      </div>
                      {!n.read && <span className="fd-notifdot" />}
                    </div>
                  );
                })}
              </div>
              {notifs.length > 0 && (
                <button className="fd-notifclearall" onClick={() => { setNotifs([]); toast("Notifications cleared."); }}>Clear all</button>
              )}
            </div>
          )}
        </div>

        <button className="fd-iconbtn" aria-label="Toggle theme" onClick={onToggleTheme}>
          <Ic name={theme === "light" ? "moon" : "sun"} size={16} />
        </button>
        <div className="fd-userchip">
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 11.5 }}>{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
          <div><div className="fd-username">{user?.displayName || 'FrameDock User'}</div><div className="fd-usermail">{user?.email || 'Signed in securely'}</div></div>
        </div>
        <button className="fd-btn fd-btnsm" onClick={onSignOut}>Sign out</button>
      </div>
    </header>
  );
}

/* ================================================================
   Root component
   ================================================================ */

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length >= 12) score += 1;

  if (score <= 2) return { label: 'Weak', color: '#ef4444' };
  if (score <= 4) return { label: 'Medium', color: '#f59e0b' };
  return { label: 'Strong', color: '#10b981' };
}

function AuthGate({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (mode === 'signup' && passwordStrength.label === 'Weak') {
      setError('Please choose a stronger password.');
      return;
    }

    setLoading(true);

    try {
      const credential = mode === 'login'
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);

      onAuthenticated(credential.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      onAuthenticated(credential.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-5 py-20 text-[#10111f] sm:px-8">
      <div className="mx-auto flex max-w-md flex-col rounded-3xl border border-[#e1e3f5] bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,31,31,0.12)] backdrop-blur">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#4f46e5]">FrameDock</p>
        <h1 className="mt-3 text-3xl font-semibold">Access your dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-[#5b5f75]">
          Sign in or create an account to unlock the FrameDock command center.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#10111f]" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#e1e3f5] bg-[#f8f9fe] px-4 py-3 outline-none ring-0"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#10111f]" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#e1e3f5] bg-[#f8f9fe] px-4 py-3 outline-none ring-0"
              placeholder="At least 6 characters"
            />
            {mode === 'signup' && password && (
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between text-xs text-[#5b5f75]">
                  <span>Password strength</span>
                  <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                </div>
                <div className="h-2 rounded-full bg-[#e1e3f5]">
                  <div className="h-2 rounded-full" style={{ width: `${Math.min((password.length / 16) * 100, 100)}%`, background: passwordStrength.color }} />
                </div>
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#10111f]" htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-[#e1e3f5] bg-[#f8f9fe] px-4 py-3 outline-none ring-0"
                placeholder="Re-enter password"
              />
            </div>
          )}

          {error && <p className="rounded-xl border border-[#ef4444]/20 bg-[#fee2e2] px-3 py-2 text-sm text-[#b91c1c]">{error}</p>}

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded-xl bg-[#173d3d] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-70">
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e1e3f5]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#8a8fa3]">or</span>
          <div className="h-px flex-1 bg-[#e1e3f5]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e1e3f5] bg-white px-4 py-3 text-sm font-semibold text-[#10111f] transition hover:bg-[#f8f9fe] disabled:opacity-70"
        >
          <span className="text-base">G</span>
          Continue with Google
        </button>

        <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setConfirmPassword(''); }} className="mt-5 text-sm font-medium text-[#4f46e5]">
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [section, setSection] = useState<SectionId>("command");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const { toasts, push } = useToasts();

  const navigate = (s: SectionId) => { setSection(s); setMobileOpen(false); };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [section]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const ctxValue = useMemo(() => ({ navigate, toast: push, theme }), [theme]);

  const sectionMap: Record<SectionId, React.ReactNode> = {
    command: <CommandCenter />,
    streams: <StreamExplorer />,
    detection: <EventDetection />,
    forecast: <CapacityForecast />,
    pipeline: <PipelineDiagnostics />,
    infra: <Infrastructure />,
    events: <EventsAlerts />,
    integrations: <Integrations />,
    reports: <Reports />,
    api: <DeveloperAPI />,
    account: <AccountSettings />,
  };

  if (!authReady) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] text-sm font-medium text-[#5b5f75]">Loading dashboard…</div>;
  }

  if (!user) {
    return <AuthGate onAuthenticated={setUser} />;
  }

  return (
    <AppCtx.Provider value={ctxValue}>
      <div className="fd-app" data-theme={theme}>
        <style>{CSS}</style>
        <Sidebar active={section} onNavigate={navigate} open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="fd-main">
          <Topbar onBurger={() => setMobileOpen(true)} section={section} theme={theme} onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))} user={user} onSignOut={handleSignOut} />
          <main className="fd-content">
            {sectionMap[section]}
            <div className="fd-footernote">
              <span>FrameDock Command Center · v1.0.0 · Region: ap-south-1</span>
              <span><a href="#" onClick={(e) => { e.preventDefault(); navigate("api"); }}>Developer API</a> · <a href="#" onClick={(e) => { e.preventDefault(); push("Docs coming soon."); }}>Docs (coming soon)</a> · <a href="#" onClick={(e) => { e.preventDefault(); push("All systems operational."); }}>Status page</a></span>
            </div>
          </main>
        </div>
        <ToastStack toasts={toasts} />
      </div>
    </AppCtx.Provider>
  );
}

export default Dashboard;

/* ================================================================
   Styles: indigo/cyan glass theme, matches framedock.one landing.
   Change tokens to re-skin. data-theme="dark" swaps to navy glass.
   ================================================================ */

const CSS = `
:root{
  --bg:#f6f7fb; --bg-1:#ffffff; --surface:#ffffff; --surface-2:#f1f2fa; --surface-hover:#eceefb;
  --border:#e1e3f5; --border-soft:#ececf7;
  --text:#10111f; --text-dim:#5b5f75; --text-faint:#9295ab;

  --brand:#4f46e5; --brand-dim:#4f46e522; --brand-glow:#4f46e555;
  --predict:#06b6d4; --predict-dim:#06b6d422;
  --warn:#f59e0b; --warn-dim:#f59e0b22;
  --crit:#ef4444; --crit-dim:#ef444422;
  --good:#10b981; --good-dim:#10b98122;

  --radius:14px; --sidebar-w:250px;
  --font-display:'Space Grotesk',sans-serif; --font-body:'Inter',sans-serif; --font-mono:'JetBrains Mono',monospace;
}
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

.fd-app,.fd-app *{box-sizing:border-box;}
.fd-app{
  font-family:var(--font-body); color:var(--text); min-height:100vh; -webkit-font-smoothing:antialiased;
  background:
    radial-gradient(ellipse 1200px 600px at 15% -10%, #eceafd 0%, transparent 60%),
    radial-gradient(ellipse 900px 500px at 100% 0%, #e6f9fb 0%, transparent 55%),
    var(--bg);
  display:flex;
}
.fd-app a{color:inherit;text-decoration:none;cursor:pointer;}
.fd-app button{font-family:inherit;cursor:pointer;}
.mono{font-family:var(--font-mono);}

/* sidebar */
.fd-sidebar{ width:var(--sidebar-w); flex-shrink:0; background:var(--bg-1); border-right:1px solid var(--border-soft); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; z-index:60; transition:transform .25s ease; }
.fd-brand{ display:flex; align-items:center; gap:10px; padding:18px 16px 14px; }
.fd-brandmark{ width:38px; height:38px; border-radius:11px; flex-shrink:0; background:linear-gradient(140deg,var(--brand),var(--predict)); display:grid; place-items:center; color:#fff; box-shadow:0 0 22px var(--brand-glow); }
.fd-brandname{ font-family:var(--font-display); font-weight:700; font-size:17px; }
.fd-brandsub{ font-size:10.5px; color:var(--text-faint); text-transform:uppercase; letter-spacing:1.2px; margin-top:1px; }
.fd-navscroll{ flex:1; overflow-y:auto; padding:6px 12px 12px; }
.fd-navgroup{ margin-top:18px; }
.fd-navgroup:first-child{ margin-top:4px; }
.fd-navlabel{ font-size:10.5px; font-weight:600; color:var(--text-faint); text-transform:uppercase; letter-spacing:1.4px; padding:0 10px 8px; }
.fd-navitem{ display:flex; align-items:center; gap:11px; padding:9px 10px; border-radius:9px; font-size:13.5px; font-weight:500; color:var(--text-dim); position:relative; transition:background .15s,color .15s; }
.fd-navitem:hover{ background:var(--surface-hover); color:var(--text); }
.fd-navitem.active{ background:linear-gradient(90deg, var(--brand-dim), transparent); color:var(--text); }
.fd-navitem.active::before{ content:''; position:absolute; left:-12px; top:8px; bottom:8px; width:3px; background:var(--brand); border-radius:3px; }
.fd-badge{ margin-left:auto; font-size:10px; font-weight:600; background:var(--predict-dim); color:var(--predict); padding:1px 7px; border-radius:20px; }
.fd-livedot{ margin-left:auto; width:6px; height:6px; border-radius:50%; background:var(--good); box-shadow:0 0 8px var(--good); }
.fd-sidebarfoot{ border-top:1px solid var(--border-soft); padding:14px 16px; display:flex; align-items:center; gap:10px; }
.avatar{ width:34px; height:34px; border-radius:50%; flex-shrink:0; background:linear-gradient(140deg,var(--brand),var(--predict)); display:grid; place-items:center; font-family:var(--font-display); font-weight:700; font-size:13px; color:#fff; }
.fd-footname{ font-size:13px; font-weight:600; }
.fd-footrole{ font-size:11px; color:var(--text-faint); }
.fd-overlay{ display:none; position:fixed; inset:0; background:#0006; z-index:55; }

/* topbar */
.fd-main{ flex:1; min-width:0; display:flex; flex-direction:column; }
.fd-topbar{ position:sticky; top:0; z-index:50; display:flex; align-items:center; gap:14px; padding:14px 28px; background:rgba(246,247,251,.82); backdrop-filter:blur(14px); border-bottom:1px solid var(--border-soft); }
.fd-burger{ display:none; background:none; border:none; color:var(--text-dim); padding:6px; }
.fd-search{ flex:1; max-width:420px; display:flex; align-items:center; gap:9px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:9px 12px; color:var(--text-faint); }
.fd-search input{ background:none; border:none; outline:none; color:var(--text); font-size:13px; width:100%; font-family:inherit; }
.fd-search input::placeholder{ color:var(--text-faint); }
.fd-searchpanel{ position:absolute; top:calc(100% + 8px); left:0; right:0; z-index:90; background:var(--surface); border:1px solid var(--border); border-radius:12px; box-shadow:0 20px 50px #00000022; overflow:hidden; }
.fd-searchitem{ width:100%; text-align:left; padding:10px 14px; font-size:13px; color:var(--text); background:transparent; border:none; cursor:pointer; transition:background .15s; }
.fd-searchitem:hover{ background:var(--surface-hover); }
.fd-kbd{ font-family:var(--font-mono); font-size:10.5px; color:var(--text-faint); background:var(--surface-2); border:1px solid var(--border); padding:2px 6px; border-radius:5px; }
.fd-topbarright{ margin-left:auto; display:flex; align-items:center; gap:18px; }
.fd-liveclock{ display:flex; flex-direction:column; align-items:flex-end; line-height:1.25; }
.fd-clocktime{ font-size:12.5px; color:var(--text); }
.fd-clockdate{ font-size:10.5px; color:var(--text-faint); }
.fd-pill{ display:flex; align-items:center; gap:6px; font-size:11.5px; color:var(--text-dim); background:var(--surface); border:1px solid var(--border); padding:6px 11px; border-radius:20px; }
.fd-pulsedot{ width:7px; height:7px; border-radius:50%; background:var(--good); position:relative; flex-shrink:0; }
.fd-pulsedot::after{ content:''; position:absolute; inset:-4px; border-radius:50%; border:1px solid var(--good); animation:fdPulse 2s ease-out infinite; }
@keyframes fdPulse{ 0%{ transform:scale(.6); opacity:.9; } 100%{ transform:scale(1.9); opacity:0; } }
.fd-iconbtn{ position:relative; width:36px; height:36px; border-radius:10px; display:grid; place-items:center; background:var(--surface); border:1px solid var(--border); color:var(--text-dim); }
.fd-iconbtn:hover{ background:var(--surface-hover); color:var(--text); }
.fd-notifcount{ position:absolute; top:-5px; right:-5px; background:var(--crit); color:#fff; font-size:9.5px; font-weight:700; border-radius:20px; padding:1px 5px; border:2px solid var(--bg-1); }
.fd-userchip{ display:flex; align-items:center; gap:10px; padding-left:16px; border-left:1px solid var(--border-soft); }
.fd-username{ font-size:12.5px; font-weight:600; }
.fd-usermail{ font-size:10.5px; color:var(--text-faint); }

/* content */
.fd-content{ padding:26px 28px 60px; max-width:1600px; width:100%; margin:0 auto; }
.fd-pagehead{ display:flex; align-items:flex-end; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-bottom:22px; }
.fd-eyebrow{ display:flex; align-items:center; gap:8px; font-size:11.5px; font-weight:600; color:var(--brand); text-transform:uppercase; letter-spacing:1.4px; margin-bottom:8px; }
.fd-dot{ width:5px; height:5px; border-radius:50%; background:var(--brand); }
.fd-title{ font-family:var(--font-display); font-size:28px; font-weight:700; letter-spacing:-.3px; }
.fd-sub{ color:var(--text-dim); font-size:13.5px; margin-top:6px; max-width:540px; }
.fd-actions{ display:flex; gap:10px; }
.fd-btn{ display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:600; padding:10px 16px; border-radius:10px; border:1px solid var(--border); background:var(--surface); color:var(--text); transition:background .15s; white-space:nowrap; }
.fd-btn:hover{ background:var(--surface-hover); }
.fd-btnsm{ padding:7px 12px; font-size:12px; }
.fd-btnprimary{ background:linear-gradient(135deg,var(--brand),#4338ca); border-color:transparent; color:#fff; }
.fd-btnprimary:hover{ filter:brightness(1.08); }

.fd-kpigrid{ display:grid; grid-template-columns:repeat(6,1fr); gap:14px; margin-bottom:22px; }
.fd-card{ background:var(--surface); border:1px solid var(--border-soft); border-radius:var(--radius); }
.fd-kpi{ padding:17px 18px; transition:border-color .2s,transform .2s; }
.fd-kpi:hover{ border-color:var(--border); transform:translateY(-2px); }
.fd-kpitop{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.fd-kpiicon{ width:30px; height:30px; border-radius:8px; display:grid; place-items:center; }
.fd-kpilabel{ font-size:11px; color:var(--text-faint); font-weight:500; }
.fd-kpival{ font-size:23px; font-weight:600; letter-spacing:-.5px; margin-bottom:8px; }
.fd-delta{ display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; padding:2px 7px; border-radius:20px; }
.fd-up{ color:var(--good); background:var(--good-dim); }
.fd-down{ color:var(--crit); background:var(--crit-dim); }
.fd-flat{ color:var(--warn); background:var(--warn-dim); }

.fd-gridmain{ display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-bottom:16px; align-items:start; }
.fd-gridbottom{ display:grid; grid-template-columns:1.15fr 1fr; gap:16px; }
.fd-pad{ padding:20px 22px; }
.fd-cardhead{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:16px; }
.fd-cardtitle{ font-family:var(--font-display); font-size:15.5px; font-weight:600; }
.fd-carddesc{ font-size:12px; color:var(--text-faint); margin-top:3px; }
.fd-tabset{ display:flex; gap:4px; background:var(--surface-2); border:1px solid var(--border); border-radius:9px; padding:3px; }
.fd-tab{ font-size:11.5px; font-weight:600; color:var(--text-faint); padding:6px 12px; border-radius:7px; }
.fd-tab.active{ background:var(--brand-dim); color:var(--brand); }
.fd-legend{ display:flex; gap:16px; margin-top:12px; flex-wrap:wrap; }
.fd-legenditem{ display:flex; align-items:center; gap:7px; font-size:11.5px; color:var(--text-dim); }
.fd-swatch{ width:14px; height:3px; border-radius:2px; display:inline-block; }
.fd-swatch.dashed{ background:repeating-linear-gradient(90deg,var(--predict) 0 4px,transparent 4px 7px); }

.fd-feed{ display:flex; flex-direction:column; gap:2px; max-height:404px; overflow-y:auto; padding-right:4px; }
.fd-feeditem{ display:flex; gap:11px; padding:12px 4px; border-bottom:1px solid var(--border-soft); }
.fd-feeditem:last-child{ border-bottom:none; }
.fd-feedic{ width:28px; height:28px; border-radius:8px; flex-shrink:0; display:grid; place-items:center; margin-top:1px; }
.fd-feedtitle{ font-size:12.5px; font-weight:600; display:flex; justify-content:space-between; gap:8px; }
.fd-feedtime{ font-size:10px; color:var(--text-faint); font-weight:500; flex-shrink:0; }
.fd-feedbody{ font-size:12px; color:var(--text-dim); margin-top:3px; line-height:1.5; }

.fd-pipeline{ display:flex; align-items:center; gap:0; overflow-x:auto; padding:10px 2px 4px; }
.fd-pipestep{ display:flex; flex-direction:column; align-items:center; gap:8px; min-width:98px; flex-shrink:0; }
.fd-pipeic{ width:44px; height:44px; border-radius:12px; display:grid; place-items:center; background:var(--surface-2); border:1px solid var(--border); color:var(--brand); }
.fd-pipelabel{ font-size:11px; text-align:center; color:var(--text-dim); font-weight:500; line-height:1.3; }
.fd-pipeconnector{ flex:1; height:2px; min-width:20px; background:linear-gradient(90deg,var(--border),var(--brand-dim),var(--border)); position:relative; top:-22px; }
.fd-nvidia{ display:inline-flex; align-items:center; gap:6px; margin-top:14px; font-size:10.5px; color:var(--good); background:var(--good-dim); border:1px solid #10b98133; padding:5px 11px; border-radius:20px; font-weight:600; letter-spacing:.3px; }

.fd-gaugegrid{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.fd-gauge{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:8px 0; }
.fd-gaugeval{ font-family:var(--font-mono); font-size:15px; font-weight:600; margin-top:-52px; }
.fd-gaugelabel{ font-size:11px; color:var(--text-faint); text-align:center; }

.fd-tablewrap{ overflow-x:auto; margin:0 -22px; padding:0 22px; }
.fd-table{ width:100%; border-collapse:collapse; font-size:12.5px; min-width:640px; }
.fd-table th{ text-align:left; font-size:10.5px; text-transform:uppercase; letter-spacing:.8px; color:var(--text-faint); font-weight:600; padding:0 12px 10px; }
.fd-table td{ padding:12px 12px; border-top:1px solid var(--border-soft); vertical-align:middle; }
.fd-row:hover td{ background:var(--surface-hover); }
.fd-svcname{ font-weight:600; font-size:13px; }
.fd-svcsub{ font-size:11px; color:var(--text-faint); }
.fd-status{ display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; padding:4px 10px; border-radius:20px; }
.fd-sdot{ width:6px; height:6px; border-radius:50%; }
.fd-status.fd-healthy{ background:var(--good-dim); color:var(--good); }
.fd-status.fd-healthy .fd-sdot{ background:var(--good); }
.fd-status.fd-watch{ background:var(--warn-dim); color:var(--warn); }
.fd-status.fd-watch .fd-sdot{ background:var(--warn); }
.fd-status.fd-critical{ background:var(--crit-dim); color:var(--crit); }
.fd-status.fd-critical .fd-sdot{ background:var(--crit); }
.fd-spark{ width:100px; height:28px; }
.fd-scorebar{ width:70px; height:5px; border-radius:5px; background:var(--surface-2); overflow:hidden; }
.fd-scorebar>div{ height:100%; border-radius:5px; }

.fd-heatdaylabels{ display:flex; gap:4px; margin-bottom:6px; margin-left:26px; }
.fd-heatdaylabels span{ width:15px; font-size:9.5px; color:var(--text-faint); text-align:center; }
.fd-heatrowwrap{ display:flex; gap:6px; overflow-x:auto; }
.fd-heathours{ display:flex; flex-direction:column; gap:4px; width:20px; }
.fd-heathours span{ height:15px; font-size:9px; color:var(--text-faint); line-height:15px; }
.fd-heatmap{ display:flex; gap:4px; }
.fd-heatcol{ display:flex; flex-direction:column; gap:4px; }
.fd-heatcell{ width:15px; height:15px; border-radius:4px; }

.fd-incident{ display:flex; gap:12px; padding:13px 0; border-bottom:1px solid var(--border-soft); }
.fd-incident:last-child{ border-bottom:none; }
.fd-incsev{ width:4px; border-radius:4px; flex-shrink:0; }
.fd-inctitle{ font-size:13px; font-weight:600; display:flex; justify-content:space-between; gap:10px; }
.fd-incmeta{ font-size:11px; color:var(--text-faint); margin-top:4px; display:flex; gap:10px; flex-wrap:wrap; }
.fd-inctag{ font-size:10px; font-weight:600; padding:2px 8px; border-radius:20px; }

.fd-filterbar{ display:flex; gap:10px; flex-wrap:wrap; }
.fd-select{ background:var(--surface-2); border:1px solid var(--border); color:var(--text); border-radius:9px; padding:9px 12px; font-size:12.5px; font-family:inherit; outline:none; }
.fd-listrows{ display:flex; flex-direction:column; }
.fd-listrow{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; border-top:1px solid var(--border-soft); font-size:12.5px; }
.fd-listrows .fd-listrow:first-child{ border-top:none; }
.fd-sliderrow{ display:flex; align-items:center; gap:14px; }
.fd-slider{ flex:1; accent-color:var(--brand); }
.fd-sliderval{ font-size:13px; width:44px; text-align:right; }

.fd-intgrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.fd-intcard{ display:flex; align-items:center; gap:12px; }
.fd-inticon{ width:38px; height:38px; border-radius:10px; background:var(--surface-2); border:1px solid var(--border); color:var(--brand); display:grid; place-items:center; flex-shrink:0; }

.fd-code{ background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:16px 18px; font-size:12px; overflow-x:auto; color:var(--text-dim); line-height:1.6; }

.fd-formrow{ display:flex; align-items:center; gap:14px; margin-bottom:18px; }
.fd-label{ display:block; font-size:11.5px; font-weight:600; color:var(--text-faint); margin:14px 0 6px; text-transform:uppercase; letter-spacing:.6px; }
.fd-label:first-of-type{ margin-top:0; }
.fd-input{ width:100%; background:var(--surface-2); border:1px solid var(--border); color:var(--text); border-radius:9px; padding:10px 13px; font-size:13px; font-family:inherit; outline:none; transition:border-color .15s; }
.fd-input:focus{ border-color:var(--brand); }
.fd-input:disabled{ color:var(--text-faint); cursor:not-allowed; }
.fd-formfoot{ display:flex; align-items:center; justify-content:flex-end; gap:14px; margin-top:18px; }
.fd-msg{ font-size:12px; font-weight:600; }
.fd-msgsuccess{ color:var(--good); }
.fd-msgerror{ color:var(--crit); }

.fd-toggle{ width:42px; height:24px; border-radius:20px; background:var(--surface-2); border:1px solid var(--border); position:relative; padding:0; transition:background .15s; flex-shrink:0; }
.fd-toggle.on{ background:var(--brand); border-color:var(--brand); }
.fd-toggle-knob{ position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform .15s; }
.fd-toggle.on .fd-toggle-knob{ transform:translateX(18px); }

.fd-footernote{ margin-top:30px; padding-top:20px; border-top:1px solid var(--border-soft); display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; font-size:11.5px; color:var(--text-faint); }
.fd-footernote a:hover{ color:var(--brand); }

@media (max-width:1180px){
  .fd-kpigrid{ grid-template-columns:repeat(3,1fr); }
  .fd-gridmain{ grid-template-columns:1fr; }
  .fd-gridbottom{ grid-template-columns:1fr; }
  .fd-intgrid{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width:860px){
  .fd-sidebar{ position:fixed; left:0; top:0; transform:translateX(-100%); box-shadow:0 0 40px #0000004d; }
  .fd-sidebar.open{ transform:translateX(0); }
  .fd-overlay.show{ display:block; }
  .fd-burger{ display:grid; place-items:center; }
  .fd-search{ display:none; }
  .fd-searchpanel{ display:none; }
  .fd-kbd{ display:none; }
  .fd-content{ padding:20px 16px 50px; }
  .fd-topbar{ padding:12px 16px; }
  .fd-userchip .fd-username,.fd-userchip .fd-usermail{ display:none; }
  .fd-liveclock{ display:none; }
}
@media (max-width:640px){
  .fd-kpigrid{ grid-template-columns:repeat(2,1fr); }
  .fd-title{ font-size:23px; }
  .fd-actions{ width:100%; }
  .fd-actions .fd-btn{ flex:1; justify-content:center; }
  .fd-intgrid{ grid-template-columns:1fr; }
}
@media (max-width:420px){
  .fd-kpigrid{ grid-template-columns:1fr 1fr; }
  .fd-pad{ padding:16px; }
}

/* dark theme override — deep navy glass, matches the landing page's dark sections */
.fd-app[data-theme="dark"]{
  --bg:#0b0e1f; --bg-1:#0d1024; --surface:#11142a; --surface-2:#161a35; --surface-hover:#1c2140;
  --border:#262b4a; --border-soft:#1c2140;
  --text:#f2f3fb; --text-dim:#a7abc8; --text-faint:#6d7191;
}
.fd-app[data-theme="dark"]{
  background:
    radial-gradient(ellipse 1200px 600px at 15% -10%, #171b3a 0%, transparent 60%),
    radial-gradient(ellipse 900px 500px at 100% 0%, #0f2530 0%, transparent 55%),
    var(--bg);
}
.fd-app[data-theme="dark"] .fd-topbar{ background:rgba(11,14,31,.82); }
.fd-app[data-theme="dark"] .avatar{ color:#fff; }

/* notifications dropdown */
.fd-notifwrap{ position:relative; }
.fd-notifpanel{
  position:absolute; top:calc(100% + 10px); right:0; width:340px; max-width:88vw;
  background:var(--surface); border:1px solid var(--border); border-radius:14px;
  box-shadow:0 20px 50px #00000026; z-index:80; overflow:hidden;
}
.fd-notifhead{ display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid var(--border-soft); font-size:13px; font-weight:600; }
.fd-notifmarkall{ background:none; border:none; color:var(--brand); font-size:11.5px; font-weight:600; }
.fd-notiflist{ max-height:320px; overflow-y:auto; }
.fd-notifitem{ display:flex; gap:10px; padding:12px 16px; border-bottom:1px solid var(--border-soft); cursor:pointer; position:relative; transition:background .15s; }
.fd-notifitem:hover{ background:var(--surface-hover); }
.fd-notifitem:last-child{ border-bottom:none; }
.fd-notifitem.read{ opacity:.55; }
.fd-notifdot{ position:absolute; top:14px; right:14px; width:7px; height:7px; border-radius:50%; background:var(--brand); }
.fd-notifempty{ padding:24px 16px; text-align:center; font-size:12.5px; color:var(--text-faint); }
.fd-notifclearall{ width:100%; padding:11px; background:none; border:none; border-top:1px solid var(--border-soft); font-size:12px; font-weight:600; color:var(--text-dim); }
.fd-notifclearall:hover{ background:var(--surface-hover); color:var(--text); }

/* toasts */
.fd-toaststack{ position:fixed; bottom:20px; right:20px; display:flex; flex-direction:column; gap:8px; z-index:100; }
.fd-toast{
  display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border);
  color:var(--text); font-size:12.5px; font-weight:500; padding:11px 16px; border-radius:10px;
  box-shadow:0 10px 30px #00000026; animation:fdToastIn .2s ease;
}
.fd-toast svg{ color:var(--good); flex-shrink:0; }
@keyframes fdToastIn{ from{ transform:translateY(8px); opacity:0; } to{ transform:translateY(0); opacity:1; } }

@media (max-width:640px){ .fd-notifpanel{ position:fixed; top:64px; right:10px; left:10px; width:auto; } }

/* video frame previews */
.fd-framegridwrap{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.fd-frametilemeta{ display:flex; align-items:center; justify-content:space-between; margin-top:8px; padding:0 2px; }
.fd-frametile{ position:relative; width:100%; aspect-ratio:16/10; border-radius:12px; overflow:hidden; border:1px solid var(--border); background:#0b0e1f; }
.fd-frametile.compact{ width:96px; aspect-ratio:16/10; border-radius:8px; }
.fd-framefootage{ position:absolute; inset:0; }
.fd-framegrid{ position:absolute; inset:0; opacity:.16; background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px); background-size:22px 22px; }
.fd-framescan{ position:absolute; left:0; right:0; height:26%; background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.08) 50%, rgba(255,255,255,0) 100%); animation:fdScan 5s linear infinite; }
@keyframes fdScan{ 0%{ transform:translateY(-30%); } 100%{ transform:translateY(430%); } }
.fd-box{ position:absolute; border:2px solid; border-radius:2px; }
.fd-boxlabel{ position:absolute; top:-16px; left:-2px; font-size:8.5px; font-weight:700; color:#0b0e1f; padding:1px 5px; border-radius:3px; white-space:nowrap; letter-spacing:.02em; }
.fd-frametile.compact .fd-boxlabel{ display:none; }
.fd-frametop{ position:absolute; top:6px; left:6px; right:6px; display:flex; align-items:center; justify-content:space-between; z-index:2; }
.fd-frametile.compact .fd-frametop{ top:3px; left:3px; right:3px; }
.fd-livepill{ display:inline-flex; align-items:center; gap:4px; background:rgba(0,0,0,.55); color:#fff; padding:2px 7px; border-radius:20px; font-size:9px; font-weight:700; letter-spacing:.04em; }
.fd-livedotsm{ width:5px; height:5px; border-radius:50%; background:#ff4d4f; box-shadow:0 0 6px #ff4d4f; }
.fd-frameres{ background:rgba(0,0,0,.5); color:#fff; padding:2px 6px; border-radius:6px; font-size:8.5px; }
.fd-frametile.compact .fd-frameres{ display:none; }
@media (max-width:860px){ .fd-framegridwrap{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:540px){ .fd-framegridwrap{ grid-template-columns:1fr; } }

@media (prefers-reduced-motion: reduce){ .fd-app *{ animation:none!important; transition:none!important; } }
`;