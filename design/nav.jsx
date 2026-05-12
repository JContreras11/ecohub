// EcoHub Top Nav — Web3 dApp style
const { Wordmark } = window.EcoLogo;
const { Btn, Badge, Icon } = window.EcoUI;

const NavBar = ({ current = "landing", onNav, dark = false }) => {
  const items = [
    { id: "landing",  label: "Discover" },
    { id: "create",   label: "Launch" },
    { id: "project",  label: "Projects" },
    { id: "profile",  label: "Profile" },
    { id: "about",    label: "About" },
    { id: "system",   label: "System" },
  ];
  return (
    <nav style={{
      position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)",
      width: "min(96%, 1480px)", zIndex: 30,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 8px 8px 20px", borderRadius: 12,
      background: dark
        ? "oklch(0.10 0.02 145 / 0.55)"
        : "oklch(0.99 0.005 90 / 0.85)",
      backdropFilter: "blur(28px) saturate(1.4)",
      WebkitBackdropFilter: "blur(28px) saturate(1.4)",
      border: dark ? "1px solid oklch(0.99 0.005 90 / 0.12)" : "1px solid var(--line-strong)",
      boxShadow: dark ? "0 8px 32px oklch(0.06 0.012 145 / 0.4)" : "var(--shadow-leaf)",
    }}>
      <div onClick={() => onNav?.("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <Wordmark size={22} inverse={dark} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em",
          padding: "3px 6px", borderRadius: 4,
          background: dark ? "oklch(0.99 0.005 90 / 0.1)" : "var(--verdant-100)",
          color: dark ? "var(--bio-300)" : "var(--verdant-700)",
          textTransform: "uppercase", fontWeight: 500,
        }}>BETA</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {items.map((it) => (
          <button key={it.id}
            onClick={() => onNav?.(it.id)}
            style={{
              background: current === it.id
                ? (dark ? "oklch(0.99 0.005 90 / 0.12)" : "var(--earth-900)")
                : "transparent",
              color: current === it.id
                ? (dark ? "var(--bone-50)" : "var(--bone-50)")
                : (dark ? "oklch(0.99 0.005 90 / 0.7)" : "var(--earth-700)"),
              border: "none",
              padding: "9px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "background 150ms, color 150ms",
              fontFamily: "var(--font-body)",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              if (current !== it.id) e.currentTarget.style.background = dark ? "oklch(0.99 0.005 90 / 0.06)" : "var(--bone-200)";
            }}
            onMouseLeave={(e) => {
              if (current !== it.id) e.currentTarget.style.background = "transparent";
            }}
          >{it.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Network indicator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 10px", borderRadius: 6,
          background: dark ? "oklch(0.99 0.005 90 / 0.06)" : "var(--bone-200)",
          fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
          color: dark ? "var(--bone-100)" : "var(--earth-900)",
        }}>
          <span className="pulse-dot" style={{
            width: 6, height: 6, borderRadius: 3,
            background: "var(--verdant-500)",
            boxShadow: "0 0 6px var(--verdant-500)",
          }} />
          OPTIMISM
        </div>
        {/* Wallet chip */}
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderRadius: 8,
          background: dark
            ? "linear-gradient(135deg, var(--verdant-500), var(--bio-600))"
            : "var(--earth-900)",
          border: "none",
          color: "var(--bone-50)",
          fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500,
          cursor: "pointer",
          boxShadow: dark ? "var(--shadow-glow-verdant)" : "none",
        }}>
          <span style={{
            width: 16, height: 16, borderRadius: 4,
            background: "linear-gradient(135deg, var(--solar-400), var(--coral-500))",
          }} />
          0x71a…dF3
        </button>
      </div>
    </nav>
  );
};

window.EcoNav = { NavBar };
