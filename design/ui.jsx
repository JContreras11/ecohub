// Shared UI primitives — buttons, badges, cards, image placeholders, vine dividers
const { useState: usePState, useEffect: usePEffect, useRef: usePRef } = React;

/* === Button === */
const Btn = ({ children, variant = "solid", size = "md", icon, onClick, as = "button", href, style = {}, glow = false, ...rest }) => {
  const sizes = {
    sm: { pad: "7px 12px", fs: 12 },
    md: { pad: "11px 18px", fs: 14 },
    lg: { pad: "14px 24px", fs: 15 },
    xl: { pad: "18px 32px", fs: 17 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    solid: {
      background: "var(--earth-900)",
      color: "var(--bone-50)",
      border: "1px solid var(--earth-900)",
    },
    primary: {
      background: "linear-gradient(135deg, var(--verdant-500), var(--verdant-700))",
      color: "var(--bone-50)",
      border: "1px solid var(--verdant-700)",
      boxShadow: glow ? "var(--shadow-glow-verdant)" : "var(--shadow-leaf)",
    },
    solar: {
      background: "linear-gradient(135deg, var(--solar-400), var(--solar-600))",
      color: "var(--earth-900)",
      border: "1px solid var(--solar-700)",
      boxShadow: glow ? "var(--shadow-glow-solar)" : "var(--shadow-leaf)",
    },
    ghost: {
      background: "oklch(0.99 0.005 90 / 0.7)",
      color: "var(--earth-900)",
      border: "1px solid var(--line-strong)",
      backdropFilter: "blur(10px)",
    },
    line: {
      background: "transparent",
      color: "var(--earth-900)",
      border: "1px solid var(--earth-900)",
    },
  };
  const Tag = as;
  return (
    <Tag
      onClick={onClick}
      href={href}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: s.pad, fontSize: s.fs, fontWeight: 500,
        borderRadius: 8, cursor: "pointer",
        fontFamily: "var(--font-body)", letterSpacing: "-0.01em",
        textDecoration: "none", whiteSpace: "nowrap",
        transition: "transform 200ms ease, box-shadow 200ms ease, background 200ms ease",
        ...variants[variant], ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
      {...rest}
    >
      {children}
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
    </Tag>
  );
};

/* === Badge === */
const Badge = ({ children, tone = "verdant", style = {}, dot = false }) => {
  const tones = {
    verdant:  { bg: "var(--verdant-100)",  fg: "var(--verdant-800)",  bd: "var(--verdant-300)" },
    solar:    { bg: "var(--solar-100)",    fg: "var(--solar-800)",    bd: "var(--solar-400)" },
    bio:      { bg: "var(--bio-100)",      fg: "var(--bio-800)",      bd: "var(--bio-400)" },
    coral:    { bg: "oklch(0.92 0.05 35)", fg: "var(--coral-700)",    bd: "var(--coral-300)" },
    ink:      { bg: "var(--earth-900)",    fg: "var(--bone-50)",      bd: "var(--earth-900)" },
    bone:     { bg: "var(--bone-50)",      fg: "var(--earth-900)",    bd: "var(--line)" },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 9px", fontSize: 11,
      fontFamily: "var(--font-mono)", letterSpacing: "0.08em",
      textTransform: "uppercase", fontWeight: 500,
      borderRadius: 4,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />}
      {children}
    </span>
  );
};

/* === ImagePlate — large placeholder for ecological imagery, uses real Unsplash photos === */
const ImagePlate = ({ src, alt = "", aspect = "16/10", radius = "var(--r-xl)", overlay = null, style = {}, parallax = false }) => (
  <div style={{
    position: "relative", overflow: "hidden", borderRadius: radius,
    aspectRatio: aspect, width: "100%",
    background: "linear-gradient(135deg, var(--verdant-200), var(--bio-200))",
    ...style,
  }}>
    {src ? (
      <img src={src} alt={alt}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", display: "block",
          transition: "transform 1.4s cubic-bezier(.2,.6,.2,1)",
        }}
        onMouseEnter={(e) => parallax && (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseLeave={(e) => parallax && (e.currentTarget.style.transform = "scale(1)")}
      />
    ) : (
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(45deg, oklch(0.99 0.01 90 / 0.3) 0 8px, transparent 8px 18px)",
        display: "grid", placeItems: "center",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--earth-700)", textTransform: "uppercase", letterSpacing: "0.18em" }}>{alt || "image"}</span>
      </div>
    )}
    {overlay}
  </div>
);

/* === VineDivider — leafy border between sections === */
const VineDivider = ({ tone = "verdant", flip = false }) => {
  const color = tone === "solar" ? "var(--solar-600)" : tone === "bio" ? "var(--bio-600)" : "var(--verdant-600)";
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none"
      style={{ display: "block", width: "100%", height: 60, transform: flip ? "scaleY(-1)" : "" }}>
      <path d="M0 30 Q 150 5 300 30 T 600 30 T 900 30 T 1200 30"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      {[120, 280, 440, 600, 760, 920, 1080].map((cx, i) => (
        <g key={i} transform={`translate(${cx}, ${30 + (i % 2 ? -8 : 8)})`}>
          <ellipse rx="10" ry="4.5" fill={color} opacity="0.5" transform="rotate(-25)" />
          <circle r="2" fill={color} />
        </g>
      ))}
    </svg>
  );
};

/* === ProgressArc — used for milestone progress on cards === */
const ProgressArc = ({ value = 0.5, size = 48, stroke = 4, label }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--verdant-100)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r}
          stroke="var(--verdant-600)" strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={off}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dashoffset 800ms ease" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "grid", placeItems: "center",
        fontFamily: "var(--font-mono)", fontSize: size * 0.22, color: "var(--earth-900)", fontWeight: 600,
      }}>
        {label ?? `${Math.round(value * 100)}%`}
      </div>
    </div>
  );
};

/* === StageBar — multi-stage milestone visual === */
const StageBar = ({ stages, current = 0 }) => (
  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
    {stages.map((st, i) => {
      const state = i < current ? "done" : i === current ? "active" : "future";
      const colors = {
        done:   { bg: "var(--verdant-500)", fg: "var(--bone-50)" },
        active: { bg: "var(--solar-500)",   fg: "var(--earth-900)" },
        future: { bg: "var(--bone-300)",    fg: "var(--earth-700)" },
      }[state];
      return (
        <div key={i} style={{
          flex: 1, padding: "8px 10px", borderRadius: 8,
          background: colors.bg, color: colors.fg,
          fontSize: 11, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: "0.08em",
          display: "flex", alignItems: "center", gap: 6,
          minWidth: 0,
        }}>
          <span style={{ opacity: 0.7 }}>{String(i + 1).padStart(2, "0")}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{st}</span>
        </div>
      );
    })}
  </div>
);

/* === Iconography (line, simple) === */
const Icon = {
  Arrow: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Plus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
  ),
  Search: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
  ),
  Bell: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>
  ),
  Leaf: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19c8 0 14-6 14-14H11C7 5 5 9 5 13v6Z" /><path d="M5 19l8-8" />
    </svg>
  ),
  Sun: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      {[0,45,90,135,180,225,270,315].map((a) => (
        <line key={a} x1={12 + Math.cos(a*Math.PI/180)*7} y1={12 + Math.sin(a*Math.PI/180)*7} x2={12 + Math.cos(a*Math.PI/180)*10} y2={12 + Math.sin(a*Math.PI/180)*10} />
      ))}
    </svg>
  ),
  Drop: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c4 5 7 8 7 12a7 7 0 1 1-14 0c0-4 3-7 7-12Z" /></svg>
  ),
  Globe: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
  ),
  Code: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4 10 20" /></svg>
  ),
  Chain: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></svg>
  ),
  Wallet: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M16 13h2M3 10h18" /></svg>
  ),
  Spark: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>
  ),
  Users: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14c3.5 0 6 2 6 5" /></svg>
  ),
  Pin: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 21s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
  ),
  Heart: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 7.6a5 5 0 0 0-8.8-3 5 5 0 0 0-8.8 3c0 5.4 8.8 11.4 8.8 11.4s8.8-6 8.8-11.4Z" /></svg>
  ),
  Fork: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="6" cy="5" r="2" /><circle cx="18" cy="5" r="2" /><circle cx="12" cy="19" r="2" /><path d="M6 7v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 13v4" /></svg>
  ),
  Star: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.4l-5.6 2.9 1.1-6.3-4.6-4.4 6.3-.9Z" /></svg>
  ),
  Check: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6" /></svg>
  ),
  Settings: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>
  ),
};

window.EcoUI = { Btn, Badge, ImagePlate, VineDivider, ProgressArc, StageBar, Icon };
