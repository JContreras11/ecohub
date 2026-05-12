// LANDING — full immersive solarpunk hero with wind, water cursor, big imagery
const { Btn: LBtn, Badge: LBadge, ImagePlate: LImg, VineDivider: LVine, ProgressArc: LArc, StageBar: LStage, Icon: LIcon } = window.EcoUI;
const { WindCanvas: LWind, WaterCursor: LWater, SunRays: LRays, AuroraBoreal: LAurora } = window.EcoFx;
const { Mark: LMark, Wordmark: LWord } = window.EcoLogo;
const { NavBar: LNav } = window.EcoNav;
const { HERO_IMAGES: LH, PROJECTS: LP, ACTIVITY_FEED: LAct, PARTNERS: LPart } = window.EcoData;

const Landing = ({ onNav }) => {
  return (
    <div style={{ position: "relative", width: "100%", background: "var(--bg)", overflow: "hidden", fontFamily: "var(--font-body)" }}>
      {/* === HERO === */}
      <section style={{ position: "relative", minHeight: 880, padding: "0 0 80px" }}>
        {/* Aurora boreal background */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <LAurora intensity={1} />
          {/* readability gradient at bottom for content */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, transparent 0%, transparent 50%, oklch(0.06 0.012 145 / 0.5) 80%, var(--bg) 100%)",
          }} />
        </div>

        <LWind density={0.4} palette="forest" />
        <LWater tint="bio" />

        <LNav current="landing" onNav={onNav} dark />

        {/* Hero content */}
        <div style={{ position: "relative", maxWidth: 1480, margin: "0 auto", padding: "180px 32px 0", zIndex: 4 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 48, alignItems: "end" }}>
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                <LBadge tone="bone" dot>Mainnet live</LBadge>
                <LBadge tone="bio">v1.2.0</LBadge>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 9px", borderRadius: 4,
                  background: "oklch(0.99 0.005 90 / 0.1)",
                  border: "1px solid oklch(0.99 0.005 90 / 0.2)",
                  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--bone-50)",
                }}>
                  <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: 3, background: "var(--verdant-400)" }} />
                  $4.2M TVL
                </span>
              </div>
              <h1 className="display" style={{
                fontSize: "clamp(64px, 8.5vw, 132px)",
                color: "var(--bone-50)", margin: "0 0 24px",
                fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 0.92,
              }}>
                Capital that<br />flows where<br /><span className="display-italic" style={{ color: "var(--solar-300)" }}>roots</span> grow.
              </h1>
              <p style={{
                fontSize: 18, lineHeight: 1.55, maxWidth: 580,
                color: "oklch(0.95 0.02 90 / 0.85)", margin: "0 0 32px",
                letterSpacing: "-0.005em",
              }}>
                The on-chain protocol for regenerative work. Open hardware, milestone escrow,
                and validator attestations — no intermediaries, all proof.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <LBtn variant="solar" size="lg" icon={<LIcon.Arrow size={16} />} glow onClick={() => onNav?.("create")}>
                  Launch Project
                </LBtn>
                <LBtn variant="ghost" size="lg" icon={<LIcon.Code size={14} />} onClick={() => onNav?.("project")}>
                  Explore Protocol
                </LBtn>
              </div>

              {/* Live counters */}
              <div style={{ display: "flex", gap: 36, marginTop: 56 }}>
                {[
                  { v: "1,284", l: "Open projects" },
                  { v: "$4.2M", l: "Funded on-chain" },
                  { v: "23", l: "Bioregions" },
                  { v: "412", l: "Validators" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="display" style={{ fontSize: 44, color: "var(--bone-50)", lineHeight: 1, fontWeight: 600 }}>{s.v}</div>
                    <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--solar-300)", marginTop: 8 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating featured project card */}
            <div className="drift-y-slow" style={{ position: "relative" }}>
              <div className="glass-leaf" style={{
                borderRadius: 32, overflow: "hidden",
                boxShadow: "var(--shadow-bloom)",
              }}>
                <img src={LP[1].cover} alt={LP[1].title} style={{ width: "100%", height: 240, objectFit: "cover" }} />
                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <LBadge tone="solar" dot>Funding · Stage 02</LBadge>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--earth-700)" }}>{LP[1].short}</span>
                  </div>
                  <h3 className="display" style={{ fontSize: 28, margin: "0 0 8px", color: "var(--earth-900)" }}>
                    {LP[1].title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "0 0 18px", lineHeight: 1.5 }}>
                    {LP[1].tagline}
                  </p>
                  <LStage stages={LP[1].stages} current={LP[1].currentStage} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
                    <div>
                      <div className="display" style={{ fontSize: 28, color: "var(--verdant-700)", lineHeight: 1 }}>
                        ${(LP[1].raised/1000).toFixed(1)}k <span style={{ fontSize: 14, color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}>/ ${(LP[1].goal/1000).toFixed(0)}k</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>{LP[1].backers} backers · {LP[1].daysLeft}d left</div>
                    </div>
                    <LArc value={LP[1].raised / LP[1].goal} size={56} />
                  </div>
                </div>
              </div>

              {/* Floating decoration cards */}
              <div className="drift-y" style={{
                position: "absolute", top: -36, right: -28,
                padding: "10px 14px", borderRadius: 999,
                background: "var(--solar-400)", color: "var(--earth-900)",
                fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
                boxShadow: "var(--shadow-glow-solar)",
              }}>
                ◉ Live · 921 backers
              </div>
              <div style={{
                position: "absolute", bottom: -22, left: -28,
                padding: "10px 14px", borderRadius: 12,
                background: "var(--earth-900)", color: "var(--bone-50)",
                fontFamily: "var(--font-mono)", fontSize: 11,
                animation: "drift-y 10s ease-in-out infinite",
              }}>
                tx 0xa1f…29c → released 32,000 USDC
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--bone-100)",
          letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <span>Scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, var(--bone-100), transparent)" }} />
        </div>
      </section>

      <LVine />

      {/* === HOW IT WORKS === */}
      <section style={{ position: "relative", padding: "120px 32px", maxWidth: 1480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <LBadge tone="verdant" dot>How EcoHub grows</LBadge>
          <h2 className="display" style={{ fontSize: "clamp(48px, 6vw, 88px)", margin: "20px 0 12px", color: "var(--earth-900)" }}>
            Plant. <span className="display-italic" style={{ color: "var(--verdant-600)" }}>Fund.</span> Verify. <span className="display-italic" style={{ color: "var(--solar-600)" }}>Regenerate.</span>
          </h2>
          <p style={{ fontSize: 18, maxWidth: 640, margin: "0 auto", color: "var(--ink-soft)" }}>
            Each project lives on-chain as a series of stages. Capital flows only when validators attest that the next milestone has rooted.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { num: "01", title: "Publish & seed", body: "Maker uploads schematics, code & milestones. Metadata pinned to IPFS, registered on-chain.", img: LH.lab, badge: "MAKER", icon: LIcon.Code },
            { num: "02", title: "Community funds", body: "Backers contribute USDC or native tokens. Funds locked in a stage-escrow contract.", img: LH.hands, badge: "FUNDER", icon: LIcon.Wallet },
            { num: "03", title: "Validate & release", body: "Domain validators attest milestone completion. Smart contract releases the next tranche.", img: LH.greenroof, badge: "VALIDATOR", icon: LIcon.Check },
          ].map((step) => (
            <div key={step.num} style={{
              borderRadius: 32, overflow: "hidden", background: "var(--bone-50)",
              border: "1px solid var(--line)", boxShadow: "var(--shadow-leaf)",
              transition: "transform 300ms, box-shadow 300ms",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "var(--shadow-bloom)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--shadow-leaf)"; }}
            >
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                <img src={step.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", top: 16, left: 16, padding: "8px 12px",
                  background: "var(--bone-50)", borderRadius: 999,
                  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--earth-900)",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  <step.icon size={12} /> {step.badge}
                </div>
                <div className="display" style={{
                  position: "absolute", bottom: -10, right: 18,
                  fontSize: 96, fontWeight: 700, color: "var(--bone-50)", lineHeight: 1, opacity: 0.95,
                  textShadow: "0 2px 20px oklch(0.20 0.05 145 / 0.4)",
                }}>{step.num}</div>
              </div>
              <div style={{ padding: 28 }}>
                <h3 className="display" style={{ fontSize: 32, margin: "0 0 10px", color: "var(--earth-900)" }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === FEATURED PROJECTS === */}
      <section style={{ position: "relative", padding: "80px 32px 120px", background: "linear-gradient(180deg, var(--bg), var(--verdant-50))" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48 }}>
            <div>
              <LBadge tone="bio" dot>Now flowering</LBadge>
              <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "16px 0 0", color: "var(--earth-900)" }}>
                Featured <span className="display-italic" style={{ color: "var(--verdant-600)" }}>regenerative</span> projects
              </h2>
            </div>
            <LBtn variant="line" icon={<LIcon.Arrow size={14} />} onClick={() => onNav?.("project")}>See all 1,284</LBtn>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 24, gridAutoRows: "minmax(0, 1fr)" }}>
            {/* hero card */}
            <div style={{
              gridRow: "span 2", borderRadius: 36, overflow: "hidden",
              position: "relative", minHeight: 720, cursor: "pointer",
              background: "var(--earth-900)",
            }} onClick={() => onNav?.("projectDetail")}>
              <img src={LP[0].cover} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, oklch(0.12 0.02 145 / 0.85) 100%)" }} />
              <div style={{ position: "absolute", top: 24, left: 24, right: 24, display: "flex", justifyContent: "space-between" }}>
                <LBadge tone="bone" dot>Funding</LBadge>
                <LBadge tone="ink">⛓ {LP[0].chain}</LBadge>
              </div>
              <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, color: "var(--bone-50)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.18em", color: "var(--solar-300)", marginBottom: 12 }}>
                  {LP[0].location.toUpperCase()} · {LP[0].short}
                </div>
                <h3 className="display" style={{ fontSize: 56, margin: "0 0 14px", lineHeight: 1 }}>{LP[0].title}</h3>
                <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 22, maxWidth: 560 }}>{LP[0].tagline}</p>
                <LStage stages={LP[0].stages} current={LP[0].currentStage} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 22 }}>
                  <div>
                    <div className="display" style={{ fontSize: 36 }}>${(LP[0].raised/1000).toFixed(1)}k <span style={{ fontSize: 16, opacity: 0.7 }}>/ ${(LP[0].goal/1000).toFixed(0)}k</span></div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{LP[0].backers} backers · {LP[0].daysLeft}d remaining</div>
                  </div>
                  <LBtn variant="solar" size="md" icon={<LIcon.Arrow size={14} />}>Fund stage</LBtn>
                </div>
              </div>
            </div>

            {/* small cards */}
            {[LP[2], LP[3], LP[4], LP[5]].map((p) => (
              <div key={p.id} style={{
                borderRadius: 28, overflow: "hidden", background: "var(--bone-50)",
                border: "1px solid var(--line)", cursor: "pointer", display: "flex", flexDirection: "column",
                transition: "transform 300ms",
              }} onClick={() => onNav?.("projectDetail")}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
              >
                <div style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative" }}>
                  <img src={p.cover} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 14, left: 14 }}>
                    <LBadge tone="bone">⛓ {p.chain}</LBadge>
                  </div>
                </div>
                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "var(--ink-soft)", marginBottom: 8 }}>
                    {p.location.toUpperCase()}
                  </div>
                  <h3 className="display" style={{ fontSize: 26, margin: "0 0 8px", color: "var(--earth-900)", lineHeight: 1.05 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 16px", lineHeight: 1.5, flex: 1 }}>{p.tagline}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="display" style={{ fontSize: 22, color: "var(--verdant-700)" }}>${(p.raised/1000).toFixed(1)}k</div>
                      <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{Math.round(p.raised/p.goal*100)}% · {p.daysLeft}d</div>
                    </div>
                    <LArc value={p.raised/p.goal} size={42} stroke={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === ON-CHAIN ACTIVITY + WHY === */}
      <section style={{ position: "relative", padding: "120px 32px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <LBadge tone="solar" dot>Provable, not promised</LBadge>
            <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "16px 0 24px", color: "var(--earth-900)" }}>
              Every contribution<br />grows a <span className="display-italic" style={{ color: "var(--verdant-600)" }}>visible root</span>.
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 28, maxWidth: 540 }}>
              EcoHub records every funding flow, milestone unlock, and withdrawal as
              an immutable on-chain attestation. Funders can audit any tree of capital,
              from the seed transaction to the field receipt.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              {[
                { k: "Transparent", v: "Audit any tx, any contributor.", i: LIcon.Chain },
                { k: "Forkable", v: "Clone a project, branch a stage.", i: LIcon.Fork },
                { k: "Co-owned", v: "DAOs vote, validators attest.", i: LIcon.Users },
                { k: "Open license", v: "CERN-OHL, MIT, CC-BY by default.", i: LIcon.Code },
              ].map((it) => (
                <div key={it.k} style={{ padding: 18, borderRadius: 18, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--verdant-100)", color: "var(--verdant-700)", display: "grid", placeItems: "center", marginBottom: 10 }}>
                    <it.i size={18} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{it.k}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{it.v}</div>
                </div>
              ))}
            </div>
            <LBtn variant="primary" icon={<LIcon.Arrow size={14} />} glow>Read the protocol</LBtn>
          </div>

          {/* Activity feed */}
          <div className="glass-leaf" style={{ borderRadius: 32, padding: 28, position: "relative", overflow: "hidden" }}>
            <LWind density={0.4} palette="gold" />
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 className="display" style={{ fontSize: 28, margin: 0, color: "var(--earth-900)" }}>Live on-chain</h3>
              <LBadge tone="bio" dot>Streaming</LBadge>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
              {LAct.map((a, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center",
                  padding: "14px 16px", borderRadius: 14,
                  background: "oklch(0.99 0.005 90 / 0.7)", border: "1px solid var(--line)",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
                    background: a.kind === "fund" ? "var(--verdant-100)" : a.kind === "milestone" ? "var(--solar-100)" : a.kind === "release" ? "var(--bio-100)" : "var(--bone-300)",
                    color: a.kind === "fund" ? "var(--verdant-700)" : a.kind === "milestone" ? "var(--solar-800)" : a.kind === "release" ? "var(--bio-800)" : "var(--earth-900)",
                  }}>
                    {a.kind === "fund" ? <LIcon.Wallet size={16} /> :
                     a.kind === "milestone" ? <LIcon.Check size={16} /> :
                     a.kind === "release" ? <LIcon.Spark size={16} /> :
                     <LIcon.Fork size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: "var(--earth-900)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-soft)" }}>{a.who}</span>
                      <span style={{ margin: "0 6px", opacity: 0.5 }}>→</span>
                      <span style={{ fontWeight: 500 }}>{a.project}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{a.amount}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === LARGE BIOSPHERE IMAGE BAND === */}
      <section style={{ position: "relative", height: 540, overflow: "hidden", margin: "0 32px", borderRadius: 48 }}>
        <img src={LH.forest} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, oklch(0.20 0.05 145 / 0.7), oklch(0.30 0.08 195 / 0.4))" }} />
        <LWind density={0.6} palette="gold" />
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: 32 }}>
          <div style={{ textAlign: "center", maxWidth: 920, color: "var(--bone-50)" }}>
            <h2 className="display" style={{ fontSize: "clamp(48px, 6vw, 96px)", margin: "0 0 24px", lineHeight: 1 }}>
              Make ecological knowledge<br />a <span className="display-italic" style={{ color: "var(--solar-300)" }}>commons</span>, not a commodity.
            </h2>
            <LBtn variant="solar" size="xl" icon={<LIcon.Leaf size={18} />} glow onClick={() => onNav?.("create")}>Start your stage</LBtn>
          </div>
        </div>
      </section>

      {/* === PARTNERS BAND === */}
      <section style={{ padding: "60px 32px" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, opacity: 0.7 }}>
          {LPart.map((p) => (
            <div key={p} style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.2em", color: "var(--earth-700)" }}>{p}</div>
          ))}
        </div>
      </section>

      <LVine />

      {/* === FOOTER === */}
      <footer style={{ padding: "80px 32px 60px", background: "var(--earth-950)", color: "var(--bone-200)" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <LWord size={32} inverse />
            <p style={{ fontSize: 14, marginTop: 18, lineHeight: 1.6, color: "oklch(0.85 0.02 90 / 0.8)" }}>
              An open commons for regenerative ecology. Built solarpunk-first, governed by makers, funders, and validators.
            </p>
          </div>
          {[
            { h: "Discover", l: ["Projects", "Bioregions", "Validators", "DAOs"] },
            { h: "Build", l: ["Start a project", "Stage templates", "Hardware kits", "API & SDK"] },
            { h: "Learn", l: ["Protocol docs", "Solarpunk manifesto", "Whitepaper", "Press"] },
            { h: "Network", l: ["Discord", "GitHub", "Lens", "Mastodon"] },
          ].map((c) => (
            <div key={c.h}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--solar-300)", marginBottom: 14 }}>{c.h}</div>
              {c.l.map((x) => (
                <div key={x} style={{ fontSize: 14, marginBottom: 8, color: "oklch(0.93 0.02 90 / 0.85)", cursor: "pointer" }}>{x}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1480, margin: "60px auto 0", paddingTop: 24, borderTop: "1px solid oklch(0.99 0.01 90 / 0.12)", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12, color: "oklch(0.85 0.02 90 / 0.6)" }}>
          <div>© 2026 EcoHub Cooperative · CC-BY-SA 4.0</div>
          <div>Open infrastructure for regenerative work · Base · Optimism · Polygon</div>
        </div>
      </footer>
    </div>
  );
};

window.EcoLanding = Landing;
