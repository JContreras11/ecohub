// EcoHub Logo — a leaf folded into an open-source/network node
// Variants: Mark (icon only), Wordmark (icon + text), Stamp (circular badge)

const Mark = ({ size = 40, tone = "forest" }) => {
  // tone: forest | gold | bone | bio
  const toneMap = {
    forest: { stroke: "var(--verdant-700)", fill: "var(--verdant-500)", glow: "var(--solar-400)" },
    gold:   { stroke: "var(--solar-700)",   fill: "var(--solar-500)",   glow: "var(--verdant-400)" },
    bone:   { stroke: "var(--bone-100)",    fill: "var(--bone-100)",    glow: "var(--solar-400)" },
    bio:    { stroke: "var(--bio-700)",     fill: "var(--bio-500)",     glow: "var(--solar-400)" },
  };
  const t = toneMap[tone] || toneMap.forest;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`leafG-${tone}`} x1="10" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={t.fill} />
          <stop offset="1" stopColor={t.stroke} />
        </linearGradient>
      </defs>
      {/* Leaf body */}
      <path
        d="M32 4 C 50 10, 60 24, 56 42 C 52 56, 38 60, 24 56 C 12 52, 4 40, 8 24 C 12 10, 22 4, 32 4 Z"
        fill={`url(#leafG-${tone})`}
        stroke={t.stroke}
        strokeWidth="1.2"
      />
      {/* Central vein = network spine */}
      <path d="M14 50 Q 28 32 50 14" stroke="var(--bone-50)" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      {/* Side veins */}
      <path d="M22 44 L 30 38" stroke="var(--bone-50)" strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
      <path d="M30 38 L 38 32" stroke="var(--bone-50)" strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
      <path d="M38 32 L 46 26" stroke="var(--bone-50)" strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
      <path d="M28 22 L 34 28" stroke="var(--bone-50)" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      <path d="M40 18 L 44 24" stroke="var(--bone-50)" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      {/* Network nodes */}
      <circle cx="14" cy="50" r="2.4" fill={t.glow} stroke={t.stroke} strokeWidth="0.8" />
      <circle cx="30" cy="38" r="1.8" fill="var(--bone-50)" stroke={t.stroke} strokeWidth="0.8" />
      <circle cx="38" cy="32" r="1.8" fill="var(--bone-50)" stroke={t.stroke} strokeWidth="0.8" />
      <circle cx="50" cy="14" r="2.6" fill={t.glow} stroke={t.stroke} strokeWidth="0.8" />
      {/* Sun ray dot */}
      <circle cx="50" cy="14" r="5" fill="none" stroke={t.glow} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
};

const Wordmark = ({ size = 36, tone = "forest", inverse = false }) => {
  const inkColor = inverse ? "var(--bone-50)" : "var(--earth-900)";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <Mark size={size} tone={tone} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 2 }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: size * 0.78,
          letterSpacing: "-0.02em",
          color: inkColor,
        }}>
          Eco<span style={{ fontWeight: 500, color: "var(--verdant-600)" }}>Hub</span>
        </span>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: size * 0.20,
          letterSpacing: "0.18em",
          color: inverse ? "var(--bone-300)" : "var(--ink-soft)",
          textTransform: "uppercase",
        }}>
          Open · Solar · On-Chain
        </span>
      </div>
    </div>
  );
};

const Stamp = ({ size = 140 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    border: "1.5px solid var(--verdant-700)",
    background: "radial-gradient(circle at 30% 25%, var(--solar-200), var(--verdant-100) 70%)",
    display: "grid", placeItems: "center",
    position: "relative",
    boxShadow: "var(--shadow-leaf)",
  }}>
    <Mark size={size * 0.5} tone="forest" />
    <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 100 100">
      <defs>
        <path id="circ" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
      </defs>
      <text fontFamily="var(--font-mono)" fontSize="6" letterSpacing="0.3em" fill="var(--verdant-800)">
        <textPath href="#circ" startOffset="0">
          ECOHUB · OPEN ECOLOGY · MILESTONE FUNDED · ON-CHAIN ·
        </textPath>
      </text>
    </svg>
  </div>
);

window.EcoLogo = { Mark, Wordmark, Stamp };
