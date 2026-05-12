// ABOUT US
const { Btn: ABtn, Badge: ABadge, ImagePlate: AImg, VineDivider: AVine, Icon: AIcon } = window.EcoUI;
const { WindCanvas: AWind, WaterCursor: AWater, SunRays: ARays } = window.EcoFx;
const { NavBar: ANav } = window.EcoNav;
const { HERO_IMAGES: AH, AVATARS: AA } = window.EcoData;

const About = ({ onNav }) => {
  return (
    <div style={{ position: "relative", background: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: 760, overflow: "hidden" }}>
        <img src={AH.forest} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, oklch(0.20 0.05 145 / 0.55), oklch(0.20 0.05 145 / 0.7))" }} />
        <ARays size={1400} opacity={0.16} top={-500} left="20%" />
        <AWind density={1} palette="forest" />
        <AWater tint="bio" />
        <ANav current="about" onNav={onNav} dark />

        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "200px 32px 80px", textAlign: "center" }}>
          <ABadge tone="bone" dot>Manifesto</ABadge>
          <h1 className="display" style={{ fontSize: "clamp(64px, 9vw, 144px)", margin: "24px 0 24px", color: "var(--bone-50)", lineHeight: 0.95, textShadow: "0 2px 40px oklch(0.20 0.05 145 / 0.5)" }}>
            We believe the<br />
            <span className="display-italic" style={{ color: "var(--solar-300)" }}>biosphere</span> is open source.
          </h1>
          <p style={{ fontSize: 22, color: "oklch(0.95 0.02 90 / 0.92)", maxWidth: 720, margin: "0 auto", lineHeight: 1.5 }}>
            EcoHub is a cooperative of makers, funders, and validators building the public infrastructure for regenerative ecology — solarpunk in spirit, on-chain in architecture.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ padding: "120px 32px", maxWidth: 1480, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 80 }}>
          <div>
            <ABadge tone="verdant" dot>Solarpunk first</ABadge>
            <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "16px 0 24px", color: "var(--earth-900)" }}>
              Optimism is a <span className="display-italic" style={{ color: "var(--verdant-600)" }}>discipline</span>.
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              Solarpunk is not aesthetic decoration — it's a working hypothesis: that technology, architecture, and nature can co-evolve into systems that are abundant, just, and beautiful. Every interaction on EcoHub is a vote for that future.
            </p>
          </div>
          <AImg src={AH.greenroof} aspect="4/5" radius="48px" parallax />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 80 }}>
          <AImg src={AH.hands} aspect="4/5" radius="48px" parallax />
          <div>
            <ABadge tone="solar" dot>Open by architecture</ABadge>
            <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "16px 0 24px", color: "var(--earth-900)" }}>
              Knowledge is a <span className="display-italic" style={{ color: "var(--solar-600)" }}>commons</span>.
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              Every schematic, dataset, and field note published on EcoHub is permissively licensed. Not because openness is convenient — it isn't — but because ecological repair is a global emergency that no single organism, lab, or company can solve.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <ABadge tone="bio" dot>Provable, not promised</ABadge>
            <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "16px 0 24px", color: "var(--earth-900)" }}>
              Capital follows <span className="display-italic" style={{ color: "var(--bio-700)" }}>roots</span>.
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              Funds released only when validators attest. Disputes resolved by quadratic vote. Every dollar traceable from contributor wallet to field receipt. We replace trust with transparency, and promise with proof.
            </p>
          </div>
          <AImg src={AH.river} aspect="4/5" radius="48px" parallax />
        </div>
      </section>

      <AVine />

      {/* Team */}
      <section style={{ padding: "120px 32px", background: "linear-gradient(180deg, var(--verdant-50), var(--bg))" }}>
        <div style={{ maxWidth: 1480, margin: "0 auto", textAlign: "center", marginBottom: 64 }}>
          <ABadge tone="verdant" dot>The cooperative</ABadge>
          <h2 className="display" style={{ fontSize: "clamp(48px, 6vw, 88px)", margin: "16px 0 12px", color: "var(--earth-900)" }}>
            Stewards & <span className="display-italic" style={{ color: "var(--verdant-600)" }}>gardeners</span>
          </h2>
        </div>
        <div style={{ maxWidth: 1480, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { n: "Amara Vélez", r: "Coastal ecologist · CO", a: AA.amara, i: AH.mangrove },
            { n: "Kai Mendoza", r: "Energy systems · MX", a: AA.kai, i: AH.solarPanels },
            { n: "Liana Costa", r: "Hydrology · PT", a: AA.liana, i: AH.river },
            { n: "Tomás Ruiz", r: "Pollinator co-ops · ES", a: AA.tomas, i: AH.bees },
            { n: "Noor Aydin", r: "Vertical farms · NL", a: AA.noor, i: AH.greenhouse },
            { n: "Jin Park", r: "Smart contracts · KR", a: AA.jin, i: AH.lab },
            { n: "Yara Quispe", r: "Wind systems · AR", a: AA.yara, i: AH.wind },
            { n: "Marcos Silva", r: "Bioregions · BR", a: AA.marcos, i: AH.forest },
          ].map((m) => (
            <div key={m.n} style={{ borderRadius: 24, overflow: "hidden", background: "var(--bone-50)", border: "1px solid var(--line)" }}>
              <div style={{ aspectRatio: "1", overflow: "hidden", position: "relative" }}>
                <img src={m.i} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <img src={m.a} style={{ position: "absolute", bottom: 14, left: 14, width: 56, height: 56, borderRadius: "50%", border: "3px solid var(--bone-50)", objectFit: "cover" }} />
              </div>
              <div style={{ padding: 18 }}>
                <div className="display" style={{ fontSize: 22, color: "var(--earth-900)", lineHeight: 1.1 }}>{m.n}</div>
                <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink-soft)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>{m.r}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Big quote */}
      <section style={{ padding: "120px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", color: "var(--earth-900)", lineHeight: 1.15, fontWeight: 500, margin: 0 }}>
            "We are not building a platform. We are <span style={{ color: "var(--verdant-600)" }}>composting</span> one — turning extractive infrastructure into living soil for the next century of regenerative work."
          </h2>
          <div style={{ marginTop: 36, fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
            — EcoHub Cooperative · 2026 Charter
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 32px 120px" }}>
        <div style={{
          maxWidth: 1480, margin: "0 auto", borderRadius: 48, overflow: "hidden",
          position: "relative", padding: "80px 64px", color: "var(--bone-50)",
          background: "var(--earth-900)",
        }}>
          <img src={AH.cityGarden} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, oklch(0.20 0.05 145 / 0.6), oklch(0.30 0.08 195 / 0.4))" }} />
          <AWind density={0.6} palette="gold" />
          <div style={{ position: "relative", maxWidth: 800 }}>
            <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 72px)", margin: "0 0 20px", lineHeight: 1.05 }}>
              Tend the <span className="display-italic" style={{ color: "var(--solar-300)" }}>commons</span> with us.
            </h2>
            <p style={{ fontSize: 18, marginBottom: 28, opacity: 0.9 }}>
              Whether you build, fund, or validate — there is a stage waiting for your hands.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <ABtn variant="solar" size="lg" icon={<AIcon.Arrow size={16} />} glow onClick={() => onNav?.("create")}>Start a project</ABtn>
              <ABtn variant="ghost" size="lg" icon={<AIcon.Heart size={14} />} onClick={() => onNav?.("project")}>Become a backer</ABtn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

window.EcoAbout = About;
