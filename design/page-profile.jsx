// USER PROFILE — maker dashboard
const { Btn: UBtn, Badge: UBadge, ImagePlate: UImg, ProgressArc: UArc, Icon: UIcon } = window.EcoUI;
const { WindCanvas: UWind, WaterCursor: UWater, SunRays: URays } = window.EcoFx;
const { NavBar: UNav } = window.EcoNav;
const { HERO_IMAGES: UH, AVATARS: UA, PROJECTS: UP } = window.EcoData;

const Profile = ({ onNav }) => {
  return (
    <div style={{ position: "relative", background: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero band */}
      <div style={{ position: "relative", height: 460, overflow: "hidden" }}>
        <img src={UH.greenroof} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, oklch(0.20 0.05 145 / 0.5), oklch(0.20 0.05 145 / 0.85))" }} />
        <UWind density={0.7} palette="forest" />
        <UWater tint="bio" />
        <URays size={1100} opacity={0.14} top={-380} left="20%" />
        <UNav current="profile" onNav={onNav} dark />
      </div>

      <div style={{ maxWidth: 1480, margin: "-180px auto 0", padding: "0 32px 100px", position: "relative", zIndex: 4 }}>
        {/* Identity card */}
        <div className="glass-leaf" style={{ borderRadius: 36, padding: 36, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "center", marginBottom: 32 }}>
          <div style={{ position: "relative" }}>
            <img src={UA.amara} style={{ width: 144, height: 144, borderRadius: "50%", border: "4px solid var(--bone-50)", objectFit: "cover", boxShadow: "var(--shadow-leaf)" }} />
            <div style={{
              position: "absolute", bottom: 6, right: 6, width: 36, height: 36, borderRadius: "50%",
              background: "var(--solar-500)", display: "grid", placeItems: "center",
              border: "3px solid var(--bone-50)", color: "var(--earth-900)",
            }}><UIcon.Check size={16} /></div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <UBadge tone="solar" dot>Verified Maker</UBadge>
              <UBadge tone="bio">Validator · biology</UBadge>
              <UBadge tone="bone"><UIcon.Pin size={10} /> Cartagena, CO</UBadge>
            </div>
            <h1 className="display" style={{ fontSize: 64, margin: "0 0 8px", color: "var(--earth-900)", lineHeight: 1 }}>
              Amara <span className="display-italic" style={{ color: "var(--verdant-600)" }}>Vélez</span>
            </h1>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", margin: "0 0 14px", maxWidth: 640 }}>
              Coastal ecologist. Building open hardware atlases for mangrove restoration. Past lives at Tierra Viva and BasinDAO.
            </p>
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--ink-soft)", fontFamily: "var(--font-mono)" }}>
              <span><b style={{ color: "var(--earth-900)", fontFamily: "var(--font-body)", fontSize: 16 }}>4</b> projects</span>
              <span><b style={{ color: "var(--earth-900)", fontFamily: "var(--font-body)", fontSize: 16 }}>1.2k</b> stars earned</span>
              <span><b style={{ color: "var(--earth-900)", fontFamily: "var(--font-body)", fontSize: 16 }}>$182k</b> raised</span>
              <span><b style={{ color: "var(--earth-900)", fontFamily: "var(--font-body)", fontSize: 16 }}>27</b> validations</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <UBtn variant="primary" icon={<UIcon.Plus size={14} />} glow onClick={() => onNav?.("create")}>New project</UBtn>
            <UBtn variant="ghost" icon={<UIcon.Settings size={14} />}>Edit profile</UBtn>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)", textAlign: "center", marginTop: 4 }}>0x71a…dF3</div>
          </div>
        </div>

        {/* Tabs + content */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, padding: 6, background: "var(--bone-200)", borderRadius: 999, width: "fit-content" }}>
          {["Projects", "Backed", "Validations", "Garden", "Activity"].map((t, i) => (
            <button key={t} style={{
              padding: "10px 20px", borderRadius: 999, border: "none",
              background: i === 0 ? "var(--bone-50)" : "transparent",
              color: "var(--earth-900)", fontWeight: i === 0 ? 500 : 400, cursor: "pointer",
              boxShadow: i === 0 ? "var(--shadow-leaf)" : "none", fontSize: 14,
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
          {/* Projects grid */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 className="display" style={{ fontSize: 36, margin: 0, color: "var(--earth-900)" }}>Maker projects</h2>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-soft)", letterSpacing: "0.15em" }}>4 OPEN</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[UP[0], UP[2], UP[3], UP[5]].map((p) => (
                <div key={p.id} onClick={() => onNav?.("projectDetail")} style={{
                  borderRadius: 24, overflow: "hidden", background: "var(--bone-50)",
                  border: "1px solid var(--line)", cursor: "pointer",
                  transition: "transform 250ms",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
                >
                  <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                    <img src={p.cover} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <UBadge tone="bone" dot>Stage {String(p.currentStage + 1).padStart(2, "0")}</UBadge>
                    </div>
                    <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                      <UArc value={p.raised/p.goal} size={48} stroke={3} />
                    </div>
                  </div>
                  <div style={{ padding: 18 }}>
                    <h3 className="display" style={{ fontSize: 22, margin: "0 0 6px", color: "var(--earth-900)" }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.tagline}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>
                      <span>${(p.raised/1000).toFixed(1)}k / ${(p.goal/1000).toFixed(0)}k</span>
                      <span>{p.backers} backers</span>
                      <span>{p.daysLeft}d</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right rail */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Garden contribution graph */}
            <div style={{ borderRadius: 24, padding: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
              <h3 className="display" style={{ fontSize: 24, margin: "0 0 4px", color: "var(--earth-900)" }}>Contribution garden</h3>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "0 0 16px", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>312 contributions · last 12 months</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(26, 1fr)", gap: 3 }}>
                {Array.from({ length: 26 * 7 }).map((_, i) => {
                  const lvl = Math.floor(Math.pow(Math.random(), 1.6) * 5);
                  const colors = ["var(--bone-300)", "var(--verdant-200)", "var(--verdant-400)", "var(--verdant-600)", "var(--solar-500)"];
                  return <div key={i} style={{ aspectRatio: 1, borderRadius: 3, background: colors[lvl] }} />;
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>
                <span>less</span>
                <div style={{ display: "flex", gap: 3 }}>
                  {["var(--bone-300)", "var(--verdant-200)", "var(--verdant-400)", "var(--verdant-600)", "var(--solar-500)"].map((c) => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
                  ))}
                </div>
                <span>more</span>
              </div>
            </div>

            {/* Badges */}
            <div style={{ borderRadius: 24, padding: 24, background: "var(--earth-950)", color: "var(--bone-100)" }}>
              <h3 className="display" style={{ fontSize: 22, margin: "0 0 16px", color: "var(--bone-50)" }}>Earned badges</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { i: "🌱", l: "Seedling" },
                  { i: "🌿", l: "Sprout" },
                  { i: "🌳", l: "Canopy" },
                  { i: "☀", l: "Solar" },
                  { i: "💧", l: "Source" },
                  { i: "⛓", l: "On-chain" },
                ].map((b) => (
                  <div key={b.l} style={{ aspectRatio: "1", borderRadius: 14, background: "oklch(0.99 0.01 90 / 0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <div style={{ fontSize: 28 }}>{b.i}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--solar-300)" }}>{b.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div style={{ borderRadius: 24, padding: 24, background: "var(--verdant-50)", border: "1px solid var(--verdant-200)" }}>
              <h3 className="display" style={{ fontSize: 22, margin: "0 0 16px", color: "var(--earth-900)" }}>Recent activity</h3>
              {[
                { i: UIcon.Spark, t: "Released 22k USDC from Stage 01", w: "Mangrove Atlas", a: "2d ago" },
                { i: UIcon.Check, t: "Validated Stage 02 of Solar Mesh", w: "as Δ-04", a: "4d ago" },
                { i: UIcon.Fork,  t: "Forked WindCards → patagonia-fork", w: "Maker fork", a: "1w ago" },
                { i: UIcon.Wallet,t: "Backed River Sentinels · 250 USDC", w: "Backer", a: "2w ago" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--verdant-200)" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--verdant-100)", color: "var(--verdant-700)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <a.i size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "var(--earth-900)" }}>{a.t}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-soft)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{a.w} · {a.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.EcoProfile = Profile;
