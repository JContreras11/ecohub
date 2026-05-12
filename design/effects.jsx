// EcoHub — Atmospheric effects: wind particles + water-ripple cursor trail
// Designed to be lightweight and run only when canvas is visible.

const { useEffect, useRef } = React;

/* WindCanvas — drifting leaves/seeds floating across a frame */
const WindCanvas = ({ density = 1, palette = "forest", className = "", style = {} }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const colors = palette === "forest"
      ? ["oklch(0.66 0.14 145 / 0.35)", "oklch(0.78 0.13 85 / 0.35)", "oklch(0.72 0.12 195 / 0.30)", "oklch(0.86 0.07 145 / 0.45)"]
      : palette === "gold"
      ? ["oklch(0.85 0.11 85 / 0.5)", "oklch(0.76 0.12 195 / 0.3)", "oklch(0.99 0.01 90 / 0.6)"]
      : ["oklch(0.99 0.01 90 / 0.5)", "oklch(0.86 0.07 145 / 0.4)", "oklch(0.72 0.12 195 / 0.3)"];

    const COUNT = Math.max(8, Math.floor(40 * density));
    const seeds = [];

    function reset(s) {
      s.x = Math.random() * w;
      s.y = h + Math.random() * 100;
      s.vx = (Math.random() - 0.5) * 0.25;
      s.vy = -0.15 - Math.random() * 0.45;
      s.r = 1.5 + Math.random() * 4.5;
      s.rot = Math.random() * Math.PI * 2;
      s.spin = (Math.random() - 0.5) * 0.02;
      s.color = colors[Math.floor(Math.random() * colors.length)];
      s.shape = Math.random() < 0.55 ? "leaf" : "dot";
      s.phase = Math.random() * Math.PI * 2;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      seeds.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const s = {};
        reset(s);
        s.y = Math.random() * h;
        seeds.push(s);
      }
    }

    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of seeds) {
        s.phase += 0.015;
        s.x += s.vx + Math.sin(s.phase) * 0.4;
        s.y += s.vy;
        s.rot += s.spin;
        if (s.y < -20 || s.x < -20 || s.x > w + 20) reset(s);

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.fillStyle = s.color;
        if (s.shape === "leaf") {
          ctx.beginPath();
          ctx.ellipse(0, 0, s.r * 1.6, s.r * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, s.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    }

    init();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density, palette]);

  return (
    <canvas ref={ref} className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", ...style }} />
  );
};

/* WaterCursor — ripples trailing the cursor inside its container */
const WaterCursor = ({ tint = "bio" }) => {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const parent = root.parentElement;
    if (!parent) return;
    const cs = getComputedStyle(parent);
    if (cs.position === "static") parent.style.position = "relative";

    const tintColor = tint === "bio"
      ? "oklch(0.72 0.12 195 / 0.55)"
      : tint === "solar"
      ? "oklch(0.85 0.11 85 / 0.55)"
      : "oklch(0.66 0.14 145 / 0.55)";

    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 30) return;
      last = now;
      const r = parent.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      const ring = document.createElement("div");
      ring.style.cssText = `
        position: absolute; left: ${x}px; top: ${y}px;
        width: 6px; height: 6px; border-radius: 50%;
        border: 1.5px solid ${tintColor};
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: ripple-out 1100ms ease-out forwards;
      `;
      root.appendChild(ring);
      setTimeout(() => ring.remove(), 1100);

      // dot
      const dot = document.createElement("div");
      dot.style.cssText = `
        position: absolute; left: ${x + (Math.random() - 0.5) * 6}px; top: ${y + (Math.random() - 0.5) * 6}px;
        width: 3px; height: 3px; border-radius: 50%;
        background: ${tintColor};
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: dot-fade 800ms ease-out forwards;
      `;
      root.appendChild(dot);
      setTimeout(() => dot.remove(), 800);
    };
    parent.addEventListener("mousemove", onMove);
    return () => parent.removeEventListener("mousemove", onMove);
  }, [tint]);

  return (
    <>
      <style>{`
        @keyframes ripple-out {
          0% { width: 6px; height: 6px; opacity: 1; }
          100% { width: 80px; height: 80px; opacity: 0; }
        }
        @keyframes dot-fade {
          0% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.4) translateY(20px); }
        }
      `}</style>
      <div ref={ref} style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5,
      }} />
    </>
  );
};

/* SunRays — slow rotating radial rays behind hero */
const SunRays = ({ size = 1200, opacity = 0.18, top = -400, left = "50%" }) => (
  <div aria-hidden style={{
    position: "absolute", top, left, transform: "translateX(-50%)",
    width: size, height: size, pointerEvents: "none",
    background: `conic-gradient(from 0deg,
      transparent 0deg,
      oklch(0.85 0.11 85 / ${opacity}) 6deg,
      transparent 12deg,
      transparent 24deg,
      oklch(0.85 0.11 85 / ${opacity * 0.6}) 30deg,
      transparent 36deg,
      transparent 90deg,
      oklch(0.85 0.11 85 / ${opacity}) 96deg,
      transparent 102deg,
      transparent 180deg,
      oklch(0.85 0.11 85 / ${opacity * 0.6}) 186deg,
      transparent 192deg,
      transparent 270deg,
      oklch(0.85 0.11 85 / ${opacity}) 276deg,
      transparent 282deg,
      transparent 360deg)`,
    borderRadius: "50%",
    animation: "spin-slow 90s linear infinite",
  }} />
);

/* AuroraBoreal — daltonwalsh.com technique adapted to EcoHub palette.
   Three tiny dots with massive box-shadow blooms (45vmax) drift across
   the container in looping paths while a slow hue-rotate breathes color
   through the verdant→bio→solar spectrum. Mountain silhouettes + fjord
   reflection ground the scene. */
const AuroraBoreal = ({ intensity = 1 }) => (
  <div aria-hidden style={{
    position: "absolute", inset: 0, overflow: "hidden",
    background: "linear-gradient(180deg, #061018 0%, #0a1f2a 35%, #143645 65%, #1f5366 100%)",
  }}>
    {/* aurora blob layer — clipped so blooms stay above water line */}
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* deep verdant green */}
      <div className="eh-aurora-blob eh-aurora-1" style={{
        position: "absolute", width: 6, height: 6, borderRadius: "50%",
        opacity: 0.78 * intensity,
        boxShadow: "0 0 45vmax 38vmax oklch(0.72 0.20 155)",
        animation: "eh-aurora-hue 14s linear infinite, eh-aurora-path-1 22s linear infinite",
        mixBlendMode: "screen",
      }} />
      {/* turquoise / bio */}
      <div className="eh-aurora-blob eh-aurora-2" style={{
        position: "absolute", width: 6, height: 6, borderRadius: "50%",
        opacity: 0.72 * intensity,
        boxShadow: "0 0 45vmax 38vmax oklch(0.78 0.16 195)",
        animation: "eh-aurora-hue 18s linear infinite, eh-aurora-path-2 28s linear infinite",
        mixBlendMode: "screen",
      }} />
      {/* solar warm accent (rare amber wash) */}
      <div className="eh-aurora-blob eh-aurora-3" style={{
        position: "absolute", width: 6, height: 6, borderRadius: "50%",
        opacity: 0.55 * intensity,
        boxShadow: "0 0 45vmax 36vmax oklch(0.80 0.18 130)",
        animation: "eh-aurora-hue 22s linear infinite, eh-aurora-path-3 18s linear infinite",
        mixBlendMode: "screen",
      }} />
    </div>

    {/* stars (subtle, behind the glow) */}
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.7,
      backgroundImage:
        "radial-gradient(1px 1px at 12% 18%, oklch(0.99 0.01 90 / 0.9), transparent 50%)," +
        "radial-gradient(1px 1px at 28% 12%, oklch(0.99 0.01 90 / 0.6), transparent 50%)," +
        "radial-gradient(1.5px 1.5px at 64% 8%, oklch(0.99 0.01 90 / 0.85), transparent 50%)," +
        "radial-gradient(1px 1px at 78% 22%, oklch(0.99 0.01 90 / 0.5), transparent 50%)," +
        "radial-gradient(1px 1px at 88% 14%, oklch(0.99 0.01 90 / 0.7), transparent 50%)," +
        "radial-gradient(1px 1px at 44% 6%, oklch(0.99 0.01 90 / 0.65), transparent 50%)," +
        "radial-gradient(1px 1px at 52% 26%, oklch(0.99 0.01 90 / 0.45), transparent 50%)",
      animation: "eh-aurora-twinkle 6s ease-in-out infinite",
    }} />

    {/* mountain silhouettes — distant + foreground */}
    <svg style={{ position: "absolute", left: 0, right: 0, bottom: "32%", width: "100%", height: "32%" }} preserveAspectRatio="none" viewBox="0 0 1000 200">
      <path d="M 0 200 L 0 130 L 80 90 L 140 110 L 220 60 L 310 100 L 380 75 L 460 115 L 550 85 L 640 105 L 730 70 L 820 95 L 900 80 L 1000 110 L 1000 200 Z" fill="#0a1f2a" opacity="0.85" />
      <path d="M 0 200 L 0 160 L 100 140 L 200 155 L 320 130 L 440 150 L 560 135 L 700 155 L 820 140 L 1000 160 L 1000 200 Z" fill="#061419" opacity="0.95" />
    </svg>

    {/* water reflection — fjord with mirrored aurora */}
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, height: "32%",
      background: "linear-gradient(180deg, #0a2030 0%, #051218 60%, #020a0e 100%)",
      borderTop: "1px solid oklch(0.78 0.15 175 / 0.2)",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 90% at 50% 0%, oklch(0.72 0.20 155 / 0.22), transparent 70%)",
        animation: "eh-aurora-hue 14s linear infinite",
        mixBlendMode: "screen",
      }} />
      {/* horizontal water sheen */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(180deg, transparent 0%, oklch(0.78 0.10 195 / 0.06) 12%, transparent 14%, oklch(0.78 0.10 195 / 0.04) 28%, transparent 30%)",
      }} />
    </div>

    <style>{`
      @keyframes eh-aurora-hue {
        to { filter: hue-rotate(360deg); }
      }
      @keyframes eh-aurora-path-1 {
        0%   { top: 12%;  left: 50%; }
        25%  { top: 22%;  left: 8%;  }
        50%  { top: 38%;  left: 50%; }
        75%  { top: 18%;  left: 92%; }
        100% { top: 12%;  left: 50%; }
      }
      @keyframes eh-aurora-path-2 {
        0%   { top: 30%;  left: 92%; }
        25%  { top: 42%;  left: 60%; }
        50%  { top: 18%;  left: 12%; }
        75%  { top: 8%;   left: 55%; }
        100% { top: 30%;  left: 92%; }
      }
      @keyframes eh-aurora-path-3 {
        0%   { top: 45%;  left: 50%; }
        25%  { top: 22%;  left: 88%; }
        50%  { top: 6%;   left: 40%; }
        75%  { top: 28%;  left: 8%;  }
        100% { top: 45%;  left: 50%; }
      }
      @keyframes eh-aurora-twinkle {
        0%, 100% { opacity: 0.55; }
        50%      { opacity: 0.9;  }
      }
    `}</style>
  </div>
);

window.EcoFx = { WindCanvas, WaterCursor, SunRays, AuroraBoreal };
