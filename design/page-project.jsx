// PROJECT DETAIL — full hi-fi project view
const { Btn: PBtn, Badge: PBadge, ImagePlate: PImg, VineDivider: PVine, ProgressArc: PArc, StageBar: PStage, Icon: PIcon } = window.EcoUI;
const { WindCanvas: PWind, WaterCursor: PWater } = window.EcoFx;
const { NavBar: PNav } = window.EcoNav;
const { HERO_IMAGES: PH, AVATARS: PA, PROJECTS: PP } = window.EcoData;

const ProjectDetail = ({ onNav }) => {
  const p = PP[1]; // Solar Mesh
  const pct = p.raised / p.goal;

  return (
    <div style={{ position: "relative", background: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero band */}
      <div style={{ position: "relative", height: 620, overflow: "hidden" }}>
        <img src={p.cover} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, oklch(0.20 0.05 145 / 0.55), oklch(0.20 0.05 145 / 0.85))" }} />
        <PWind density={0.8} palette="forest" />
        <PWater tint="solar" />
        <PNav current="project" onNav={onNav} dark />

        <div style={{ position: "relative", maxWidth: 1480, margin: "0 auto", padding: "180px 32px 0" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <PBadge tone="solar" dot>Funding · Stage 02</PBadge>
            <PBadge tone="bone">⛓ {p.chain}</PBadge>
            <PBadge tone="bone">{p.location}</PBadge>
          </div>
          <h1 className="display" style={{
            fontSize: "clamp(56px, 7vw, 110px)", margin: "0 0 16px", color: "var(--bone-50)",
            lineHeight: 0.98, maxWidth: 1100, textShadow: "0 2px 30px oklch(0.20 0.05 145 / 0.4)",
          }}>
            {p.title.split("—")[0]}<span className="display-italic" style={{ color: "var(--solar-300)" }}>—</span>{p.title.split("—")[1]}
          </h1>
          <p style={{ fontSize: 20, color: "oklch(0.95 0.02 90 / 0.92)", maxWidth: 720, margin: "0 0 36px" }}>{p.tagline}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={p.owner.avatar} style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid var(--bone-50)" }} />
            <div>
              <div style={{ color: "var(--bone-50)", fontWeight: 500, fontSize: 16 }}>{p.owner.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--solar-200)" }}>{p.owner.handle}</div>
            </div>
            <div style={{ width: 1, height: 40, background: "oklch(0.99 0.01 90 / 0.3)", margin: "0 12px" }} />
            <PBtn variant="ghost" size="sm" icon={<PIcon.Star size={14} />}>{p.stars} stars</PBtn>
            <PBtn variant="ghost" size="sm" icon={<PIcon.Fork size={14} />}>{p.forks} forks</PBtn>
            <PBtn variant="ghost" size="sm" icon={<PIcon.Heart size={14} />}>Watch</PBtn>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1480, margin: "-100px auto 0", padding: "0 32px 120px", position: "relative", zIndex: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 32 }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Stages timeline */}
            <div className="glass-leaf" style={{ borderRadius: 32, padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 className="display" style={{ fontSize: 36, margin: 0, color: "var(--earth-900)" }}>Stage tree</h2>
                <PBadge tone="bio" dot>02 of 04 active</PBadge>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {p.stages.map((stage, i) => {
                  const state = i < p.currentStage ? "done" : i === p.currentStage ? "active" : "future";
                  const colors = {
                    done:   { bg: "var(--verdant-100)",  pill: "var(--verdant-500)", ink: "var(--verdant-800)" },
                    active: { bg: "var(--solar-100)",    pill: "var(--solar-500)",   ink: "var(--solar-800)" },
                    future: { bg: "var(--bone-200)",     pill: "var(--bone-300)",    ink: "var(--earth-700)" },
                  }[state];
                  const amounts = [22000, 38000, 54000, 26400];
                  return (
                    <div key={i} style={{
                      padding: 22, borderRadius: 20, background: colors.bg,
                      border: `1px solid ${state === "active" ? "var(--solar-400)" : "var(--line)"}`,
                      display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 18, alignItems: "center",
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: colors.pill, color: state === "future" ? "var(--earth-700)" : "var(--bone-50)",
                        display: "grid", placeItems: "center",
                        fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 14,
                      }}>
                        {state === "done" ? <PIcon.Check size={18} /> : String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 17, color: "var(--earth-900)", marginBottom: 4 }}>{stage}</div>
                        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: colors.ink, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {state === "done" ? "Validated · attestation 0xa1f…29c" : state === "active" ? "Funding · 38% to unlock" : "Locked · awaits previous stage"}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="display" style={{ fontSize: 24, color: "var(--earth-900)", lineHeight: 1 }}>${amounts[i].toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>USDC</div>
                      </div>
                      {state === "active" ? <PBtn variant="solid" size="sm" icon={<PIcon.Arrow size={12} />}>Fund</PBtn> :
                       state === "done"   ? <PBadge tone="verdant" dot>Released</PBadge> :
                                             <PBadge tone="bone">Pending</PBadge>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* About */}
            <div style={{ borderRadius: 32, padding: 32, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
              <h2 className="display" style={{ fontSize: 36, margin: "0 0 18px", color: "var(--earth-900)" }}>About this project</h2>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 16 }}>
                Solar Mesh is a kit-based 1kW microgrid designed for off-grid Mesoamerican communities. Every PCB, mechanical drawing, and firmware module is open under CERN-OHL-S. We pair the kit with a local DAO that decides on placement, governance, and revenue share from any surplus generation.
              </p>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 24 }}>
                The current stage funds five pilot installations in the Sierra Norte de Oaxaca, including weather-monitoring and a public dashboard for performance.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                <PImg src={PH.solarPanels} aspect="4/3" />
                <PImg src={PH.lab} aspect="4/3" />
              </div>
            </div>

            {/* Repository */}
            <div style={{ borderRadius: 32, padding: 32, background: "var(--earth-950)", color: "var(--bone-100)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 className="display" style={{ fontSize: 30, margin: 0, color: "var(--bone-50)" }}>Repository</h2>
                <PBadge tone="bone">CERN-OHL-S</PBadge>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "oklch(0.85 0.02 90 / 0.85)" }}>
                {[
                  { i: "📁", n: "hardware/mppt-controller-v3", t: "schematics + gerbers", c: "Kai · 2d ago" },
                  { i: "📁", n: "firmware/esp32-mesh", t: "ESP-IDF + Rust modules", c: "@vega · 5d ago" },
                  { i: "📁", n: "enclosure/3d-models", t: "STEP, STL, BOM", c: "@solarkai · 1w ago" },
                  { i: "📄", n: "BOM.csv", t: "412 line items", c: "Kai · 4d ago" },
                  { i: "📄", n: "ASSEMBLY.md", t: "step-by-step build", c: "@vega · 5d ago" },
                ].map((f) => (
                  <div key={f.n} style={{ display: "grid", gridTemplateColumns: "auto 1.4fr 1fr auto", gap: 18, padding: "12px 0", borderBottom: "1px solid oklch(0.99 0.01 90 / 0.06)" }}>
                    <span>{f.i}</span>
                    <span style={{ color: "var(--solar-300)" }}>{f.n}</span>
                    <span style={{ color: "oklch(0.85 0.02 90 / 0.55)" }}>{f.t}</span>
                    <span style={{ color: "oklch(0.85 0.02 90 / 0.55)" }}>{f.c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — funding panel + meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 100, alignSelf: "start" }}>
            <div style={{ borderRadius: 28, padding: 28, background: "var(--bone-50)", border: "1px solid var(--line)", boxShadow: "var(--shadow-bloom)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 18 }}>
                <div>
                  <div className="display" style={{ fontSize: 44, color: "var(--earth-900)", lineHeight: 1 }}>${(p.raised/1000).toFixed(1)}k</div>
                  <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>raised of ${(p.goal/1000).toFixed(0)}k goal</div>
                </div>
                <PArc value={pct} size={68} />
              </div>
              <div style={{ height: 6, borderRadius: 999, background: "var(--bone-300)", overflow: "hidden", marginBottom: 18 }}>
                <div style={{ width: `${pct * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--verdant-500), var(--solar-500))" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 22 }}>
                {[
                  { v: p.backers, l: "Backers" },
                  { v: p.daysLeft + "d", l: "Left" },
                  { v: "3/5", l: "Validators" },
                ].map((s) => (
                  <div key={s.l} style={{ padding: "10px 12px", borderRadius: 12, background: "var(--bone-200)", textAlign: "center" }}>
                    <div className="display" style={{ fontSize: 22, color: "var(--earth-900)", lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-soft)", marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
                {["50", "250", "1000"].map((v) => (
                  <button key={v} style={{
                    padding: "12px 0", borderRadius: 12,
                    border: "1px solid var(--line)", background: "var(--bone-100)",
                    fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 14, cursor: "pointer", color: "var(--earth-900)",
                  }}>${v}</button>
                ))}
              </div>
              <PBtn variant="primary" size="lg" icon={<PIcon.Wallet size={16} />} glow style={{ width: "100%", justifyContent: "center" }}>
                Fund Stage 02
              </PBtn>
              <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-soft)", textAlign: "center", fontFamily: "var(--font-mono)" }}>
                Locked in escrow · released on validator attestation
              </div>
            </div>

            <div style={{ borderRadius: 24, padding: 22, background: "var(--verdant-50)", border: "1px solid var(--verdant-200)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--verdant-800)", marginBottom: 12 }}>Backers · top</div>
              {[
                { n: "PachaTech DAO", a: "$5,000" },
                { n: "0x71a…dF3", a: "$2,400" },
                { n: "Gaia Research", a: "$1,800" },
                { n: "@regenrico", a: "$1,200" },
              ].map((b) => (
                <div key={b.n} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                  <span style={{ color: "var(--earth-900)" }}>{b.n}</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--verdant-700)" }}>{b.a}</span>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: 24, padding: 22, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 12 }}>Contract</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--earth-900)", marginBottom: 8 }}>0x9ec…a4f1</div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Deployed on {p.chain} · April 12, 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.EcoProject = ProjectDetail;
