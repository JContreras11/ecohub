// DESIGN SYSTEM — Solarpunk tokens + components, ready for Tailwind
const { Btn: SBtn, Badge: SBadge, ImagePlate: SImg, VineDivider: SVine, ProgressArc: SArc, StageBar: SStage, Icon: SIcon } = window.EcoUI;
const { WindCanvas: SWind, WaterCursor: SWater, SunRays: SRays } = window.EcoFx;
const { NavBar: SNav } = window.EcoNav;
const { Mark: SMark, Wordmark: SWord, Stamp: SStamp } = window.EcoLogo;
const { HERO_IMAGES: SH } = window.EcoData;

/* ---------- mini helpers ---------- */
const Section = ({ id, eyebrow, title, italic, sub, children }) => (
  <section id={id} style={{ padding: "100px 32px", borderTop: "1px solid var(--line)" }}>
    <div style={{ maxWidth: 1480, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 56, marginBottom: 48 }}>
        <div style={{ position: "sticky", top: 100, alignSelf: "start" }}>
          <SBadge tone="verdant" dot>{eyebrow}</SBadge>
          <h2 className="display" style={{ fontSize: 56, lineHeight: 0.98, margin: "16px 0 12px", color: "var(--earth-900)" }}>
            {title} {italic && <span className="display-italic" style={{ color: "var(--verdant-600)" }}>{italic}</span>}
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{sub}</p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  </section>
);

const CodeBlock = ({ children, label = "tailwind.config.js" }) => (
  <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)", background: "var(--earth-950)" }}>
    <div style={{
      padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
      color: "var(--solar-300)", background: "oklch(0.16 0.03 145)", borderBottom: "1px solid oklch(0.99 0.01 90 / 0.08)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span>{label}</span>
      <span style={{ color: "oklch(0.85 0.02 90 / 0.5)", textTransform: "none", letterSpacing: "0.1em" }}>copy</span>
    </div>
    <pre style={{
      margin: 0, padding: "20px 22px", fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7,
      color: "var(--bone-100)", overflow: "auto",
    }}>{children}</pre>
  </div>
);

const Swatch = ({ name, varName, value, dark = false }) => (
  <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)", background: "var(--bone-50)" }}>
    <div style={{ height: 96, background: `var(${varName})`, position: "relative" }}>
      <span style={{
        position: "absolute", bottom: 8, right: 10, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em",
        color: dark ? "var(--bone-50)" : "var(--earth-900)", opacity: 0.7,
      }}>{name}</span>
    </div>
    <div style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
      <div style={{ color: "var(--earth-900)" }}>{varName}</div>
      <div style={{ opacity: 0.7, marginTop: 2, fontSize: 10 }}>{value}</div>
    </div>
  </div>
);

/* ---------- Page ---------- */
const SystemPage = ({ onNav }) => {
  return (
    <div style={{ position: "relative", background: "var(--bg)", minHeight: "100vh", overflow: "hidden" }}>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: 720, overflow: "hidden" }}>
        <img src={SH.greenroof} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, oklch(0.20 0.05 145 / 0.55) 0%, oklch(0.20 0.05 145 / 0.78) 70%, var(--bg) 100%)" }} />
        <SRays size={1300} opacity={0.13} top={-450} left="78%" />
        <SWind density={1} palette="forest" />
        <SWater tint="bio" />
        <SNav current="system" onNav={onNav} dark />

        <div style={{ position: "relative", maxWidth: 1480, margin: "0 auto", padding: "180px 32px 0" }}>
          <SBadge tone="bone" dot>v1.0 · Solarpunk · Tailwind-ready</SBadge>
          <h1 className="display" style={{
            fontSize: "clamp(64px, 9vw, 144px)", margin: "20px 0 22px", color: "var(--bone-50)",
            lineHeight: 0.96, textShadow: "0 2px 30px oklch(0.20 0.05 145 / 0.4)",
          }}>
            EcoHub<br />
            <span className="display-italic" style={{ color: "var(--solar-300)" }}>Design</span> System.
          </h1>
          <p style={{ fontSize: 20, color: "oklch(0.95 0.02 90 / 0.92)", maxWidth: 640, marginBottom: 32 }}>
            Tokens, primitives, and patterns for solarpunk interfaces — where technology, architecture, and nature share a grammar.
            Drop the config into Tailwind v4 and start composing.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <SBtn variant="solar" size="lg" icon={<SIcon.Code size={16} />} glow>Get tailwind.config</SBtn>
            <SBtn variant="ghost" size="lg" icon={<SIcon.Arrow size={14} />}>Read the docs</SBtn>
          </div>

          {/* Quick toc */}
          <div style={{ marginTop: 56, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { id: "foundation", l: "Foundation" },
              { id: "color",      l: "Color" },
              { id: "type",       l: "Type" },
              { id: "spacing",    l: "Spacing & radii" },
              { id: "motion",     l: "Motion" },
              { id: "components", l: "Components" },
              { id: "tailwind",   l: "Tailwind config" },
            ].map((t) => (
              <a key={t.id} href={`#${t.id}`} style={{
                padding: "8px 14px", borderRadius: 999,
                background: "oklch(0.99 0.01 90 / 0.12)", border: "1px solid oklch(0.99 0.01 90 / 0.2)",
                color: "var(--bone-100)", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em",
                textDecoration: "none", textTransform: "uppercase",
              }}>{t.l}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Foundation */}
      <Section id="foundation" eyebrow="01 · Foundation" title="Three roots." italic="One canopy."
        sub="Every choice in this system is rooted in three commitments: ecological truth (oklch color, organic curvature), open architecture (tokens, no magic numbers), and atmospheric depth (light, wind, water as first-class effects).">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {[
            { num: "01", t: "Living color", b: "All hues defined in oklch — perceptually uniform, accessible across light/dark.", icon: SIcon.Drop, tone: "var(--bio-100)", ink: "var(--bio-800)" },
            { num: "02", t: "Atmospheric motion", b: "Wind particles, water ripples, and slow drift are part of the language, not decoration.", icon: SIcon.Sun, tone: "var(--solar-100)", ink: "var(--solar-800)" },
            { num: "03", t: "Open by structure", b: "Every value lives as a CSS variable & a Tailwind theme key — copyable, forkable, remixable.", icon: SIcon.Code, tone: "var(--verdant-100)", ink: "var(--verdant-800)" },
          ].map((p) => (
            <div key={p.num} style={{
              padding: 24, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: p.tone, color: p.ink, display: "grid", placeItems: "center", marginBottom: 16 }}>
                <p.icon size={20} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "var(--ink-soft)" }}>{p.num}</div>
              <h3 className="display" style={{ fontSize: 26, margin: "8px 0 10px", color: "var(--earth-900)" }}>{p.t}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{p.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Color */}
      <Section id="color" eyebrow="02 · Color" title="A palette" italic="from the biosphere."
        sub="Five hue families anchor the system — verdant forests, solar gold, bio-luminescent teal, terracotta coral, and warm bone whites — each with an 11-stop scale in oklch for perceptual smoothness.">
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {[
            {
              name: "Verdant", role: "Primary · forest greens",
              stops: ["50","100","200","300","400","500","600","700","800","900","950"],
              prefix: "verdant",
            },
            {
              name: "Solar", role: "Accent · golden sunlight",
              stops: ["50","100","200","300","400","500","600","700","800","900"],
              prefix: "solar",
            },
            {
              name: "Bio", role: "Accent · bio-luminescent teal",
              stops: ["50","100","200","300","400","500","600","700","800","900"],
              prefix: "bio",
            },
            {
              name: "Bone", role: "Surface · warm whites",
              stops: ["50","100","200","300","400"],
              prefix: "bone",
            },
            {
              name: "Earth", role: "Ink · forest text",
              stops: ["700","800","900","950"],
              prefix: "earth",
            },
          ].map((fam) => (
            <div key={fam.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <h3 className="display" style={{ fontSize: 28, margin: 0, color: "var(--earth-900)" }}>{fam.name}</h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{fam.role}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${fam.stops.length}, 1fr)`, gap: 6 }}>
                {fam.stops.map((s, i) => {
                  const num = parseInt(s, 10);
                  const dark = num >= 500;
                  return (
                    <div key={s} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--line)" }}>
                      <div style={{ height: 84, background: `var(--${fam.prefix}-${s})`, position: "relative" }}>
                        <span style={{
                          position: "absolute", bottom: 6, left: 8, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
                          color: dark ? "var(--bone-50)" : "var(--earth-900)",
                        }}>{s}</span>
                      </div>
                      <div style={{ padding: "6px 8px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-soft)" }}>
                        {fam.prefix}-{s}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Semantic */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <h3 className="display" style={{ fontSize: 28, margin: 0, color: "var(--earth-900)" }}>Semantic tokens</h3>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-soft)" }}>Roles</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <Swatch name="bg" varName="--bg" value="bone-100" />
              <Swatch name="bg-elev" varName="--bg-elev" value="bone-50" />
              <Swatch name="surface" varName="--surface" value="bone-200" />
              <Swatch name="ink" varName="--ink" value="earth-900" dark />
              <Swatch name="ink-soft" varName="--ink-soft" value="earth-700" dark />
              <Swatch name="primary" varName="--primary" value="verdant-600" dark />
              <Swatch name="accent" varName="--accent" value="solar-500" />
              <Swatch name="bio" varName="--bio" value="bio-500" />
            </div>
          </div>

          <CodeBlock label="theme.css — Tailwind v4 (@theme inline)">
{`@theme inline {
  /* Verdant — primary forest greens */
  --color-verdant-50:  oklch(0.97 0.02 145);
  --color-verdant-500: oklch(0.55 0.15 145);   /* primary */
  --color-verdant-600: oklch(0.46 0.13 145);
  --color-verdant-900: oklch(0.20 0.05 145);

  /* Solar — golden sunlight */
  --color-solar-300: oklch(0.85 0.11 85);
  --color-solar-500: oklch(0.78 0.13 85);    /* accent */
  --color-solar-700: oklch(0.55 0.12 75);

  /* Bio — bio-luminescent teal */
  --color-bio-500: oklch(0.72 0.12 195);
  --color-bio-700: oklch(0.48 0.10 200);

  /* Bone — warm whites */
  --color-bone-50:  oklch(0.99 0.005 90);
  --color-bone-100: oklch(0.98 0.008 90);

  /* Earth — forest text */
  --color-earth-900: oklch(0.18 0.03 145);
}

/* usage in markup: */
<button class="bg-verdant-600 text-bone-50 hover:bg-verdant-700 ...">
  Plant a Project
</button>`}
          </CodeBlock>
        </div>
      </Section>

      {/* Type */}
      <Section id="type" eyebrow="03 · Type" title="A grotesk" italic="system."
        sub="One grotesk type family (Inter / Söhne-style) handles every voice — display, body, all weights. Emphasis is made with color and weight, never italic or serif. A technical mono (Geist Mono) marks on-chain numerics, hashes, and code.">        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Display */}
          <div style={{ padding: 36, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
              <span>Display · Inter Display / Söhne grotesk</span><span>display / display-italic (color emphasis)</span>
            </div>
            <div className="display" style={{ fontSize: 96, color: "var(--earth-900)", lineHeight: 0.98, margin: 0 }}>
              The <span className="display-italic" style={{ color: "var(--verdant-600)" }}>biosphere</span><br />is open source.
            </div>
            <div style={{ display: "flex", gap: 36, marginTop: 28, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>
              <span>Weight 600 · headline</span>
              <span>Weight 500 · emphasis</span>
              <span>Tracking -0.035em</span>
              <span>Leading 0.95</span>
            </div>
          </div>

          {/* Type scale */}
          <div style={{ padding: 28, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 18 }}>Scale</div>
            {[
              { n: "Display 1", c: "display", style: { fontSize: 88, lineHeight: 0.95, fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.02em" }, t: "Plant. Fund. Verify." },
              { n: "Display 2", c: "display", style: { fontSize: 64, lineHeight: 0.98, fontFamily: "var(--font-display)", fontWeight: 500 }, t: "Make ecological knowledge a commons." },
              { n: "H1", c: "h1", style: { fontSize: 48, lineHeight: 1.05, fontFamily: "var(--font-display)", fontWeight: 500 }, t: "Stage tree" },
              { n: "H2", c: "h2", style: { fontSize: 36, lineHeight: 1.1, fontFamily: "var(--font-display)" }, t: "Featured regenerative projects" },
              { n: "H3", c: "h3", style: { fontSize: 24, lineHeight: 1.2, fontWeight: 600, fontFamily: "var(--font-body)" }, t: "About this project" },
              { n: "Body L", c: "body-lg", style: { fontSize: 18, lineHeight: 1.65, fontFamily: "var(--font-body)" }, t: "Open infrastructure for regenerative work." },
              { n: "Body", c: "body", style: { fontSize: 15, lineHeight: 1.6, fontFamily: "var(--font-body)" }, t: "EcoHub records every funding flow as an immutable on-chain attestation." },
              { n: "Caption", c: "caption", style: { fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", textTransform: "uppercase" }, t: "ON-CHAIN · STAGE 02" },
            ].map((row, i, all) => (
              <div key={row.n} style={{
                display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 24, alignItems: "baseline",
                padding: "16px 0", borderBottom: i < all.length - 1 ? "1px solid var(--line)" : "none",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--ink-soft)", textTransform: "uppercase" }}>{row.n}</div>
                <div style={{ ...row.style, color: "var(--earth-900)" }}>{row.t}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>{Math.round(row.style.fontSize)}px</div>
              </div>
            ))}
          </div>

          <CodeBlock label="theme.css — fonts">
{`@theme inline {
  --font-display: "Inter Display", "Inter", "Söhne", "Helvetica Neue", system-ui, sans-serif;
  --font-sans:    "Inter", "Söhne", "Helvetica Neue", system-ui, sans-serif;
  --font-mono:    "Geist Mono", "JetBrains Mono", ui-monospace, monospace;
}

/* usage */
<h1 class="font-display text-7xl/[0.95] tracking-[-0.035em] font-semibold text-earth-900">
  The <span class="text-verdant-600 font-medium">biosphere</span>
  is open source.
</h1>`}
          </CodeBlock>
        </div>
      </Section>

      {/* Spacing & radii */}
      <Section id="spacing" eyebrow="04 · Spacing & radii" title="Generous" italic="breathing room."
        sub="Solarpunk interfaces feel airy. The spacing scale is 4-based; the radius scale escalates from sharp utility (8px) to organic blob (var(--r-organic)) for hero moments.">
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Spacing */}
          <div style={{ padding: 28, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 14 }}>Spacing scale (4-based)</div>
            {[
              ["s-1", 4],   ["s-2", 8],   ["s-3", 12],  ["s-4", 16],  ["s-5", 20],
              ["s-6", 24],  ["s-8", 32],  ["s-10", 40], ["s-12", 48], ["s-16", 64],
              ["s-20", 80], ["s-24", 96], ["s-32", 128],
            ].map(([n, v]) => (
              <div key={n} style={{ display: "grid", gridTemplateColumns: "80px 80px 1fr", gap: 18, alignItems: "center", padding: "8px 0" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--earth-900)" }}>{n}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-soft)" }}>{v}px</div>
                <div style={{ height: 16, width: v, background: "linear-gradient(90deg, var(--verdant-500), var(--solar-500))", borderRadius: 4 }} />
              </div>
            ))}
          </div>

          {/* Radii */}
          <div style={{ padding: 28, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 14 }}>Radius scale</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
              {[
                { n: "sm", r: "8px" },
                { n: "md", r: "14px" },
                { n: "lg", r: "22px" },
                { n: "xl", r: "32px" },
                { n: "2xl", r: "48px" },
                { n: "organic", r: "64% 36% 58% 42% / 52% 60% 40% 48%" },
              ].map((it) => (
                <div key={it.n} style={{ textAlign: "center" }}>
                  <div style={{
                    aspectRatio: "1", borderRadius: it.r,
                    background: "linear-gradient(135deg, var(--verdant-300), var(--bio-300))",
                    border: "1px solid var(--verdant-400)", marginBottom: 10,
                  }} />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--earth-900)" }}>r-{it.n}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div style={{ padding: 28, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 18 }}>Elevation</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { n: "leaf", s: "var(--shadow-leaf)" },
                { n: "bloom", s: "var(--shadow-bloom)" },
                { n: "glow-bio", s: "var(--shadow-glow-bio)" },
                { n: "glow-solar", s: "var(--shadow-glow-solar)" },
              ].map((it) => (
                <div key={it.n} style={{ padding: "8px 8px 14px" }}>
                  <div style={{
                    height: 96, borderRadius: 16,
                    background: "var(--bone-50)", boxShadow: it.s, marginBottom: 12, border: "1px solid var(--line)",
                  }} />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--earth-900)", textAlign: "center" }}>shadow-{it.n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Motion */}
      <Section id="motion" eyebrow="05 · Motion" title="Wind, water," italic="and slow drift."
        sub="Three motion primitives carry the language: ambient drift (8–14s ease-in-out loops), wind canvas particles, and water-ripple cursor trails. Avoid linear easings; everything breathes.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ position: "relative", borderRadius: 24, height: 280, overflow: "hidden", background: "linear-gradient(160deg, var(--verdant-100), var(--bio-100))", border: "1px solid var(--line)" }}>
            <SWind density={0.9} palette="forest" />
            <div style={{ position: "absolute", left: 22, bottom: 22 }}>
              <div className="display" style={{ fontSize: 28, color: "var(--earth-900)", lineHeight: 1, marginBottom: 4 }}>WindCanvas</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)", letterSpacing: "0.14em", textTransform: "uppercase" }}>density · palette</div>
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 24, height: 280, overflow: "hidden", background: "var(--earth-950)", border: "1px solid var(--line)" }}>
            <SWater tint="bio" />
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <div className="display" style={{ fontSize: 36, color: "var(--bone-50)", textAlign: "center" }}>
                Move your cursor<br /><span className="display-italic" style={{ color: "var(--bio-300)" }}>here</span>
              </div>
            </div>
            <div style={{ position: "absolute", left: 22, bottom: 22 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--bio-300)", letterSpacing: "0.14em", textTransform: "uppercase" }}>WaterCursor · tint</div>
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 24, height: 220, overflow: "hidden", background: "var(--bone-50)", border: "1px solid var(--line)", display: "grid", placeItems: "center" }}>
            <div className="drift-y-slow" style={{
              padding: "18px 24px", borderRadius: 22, background: "var(--solar-300)", color: "var(--earth-900)",
              fontFamily: "var(--font-display)", fontSize: 32, boxShadow: "var(--shadow-bloom)",
            }}>drift-y-slow</div>
          </div>
          <div style={{ position: "relative", borderRadius: 24, height: 220, overflow: "hidden", background: "var(--bone-50)", border: "1px solid var(--line)", display: "grid", placeItems: "center" }}>
            <div className="sway" style={{
              padding: "18px 24px", borderRadius: 22, background: "var(--verdant-200)", color: "var(--earth-900)",
              fontFamily: "var(--font-display)", fontSize: 32, boxShadow: "var(--shadow-leaf)",
            }}>sway</div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <CodeBlock label="motion.css">
{`@keyframes drift-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes sway    { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }

.drift-y      { animation: drift-y 8s ease-in-out infinite; }
.drift-y-slow { animation: drift-y 14s ease-in-out infinite; }
.sway         { animation: sway 6s ease-in-out infinite; transform-origin: bottom center; }

/* in tailwind v4 */
@theme inline {
  --animate-drift-y: drift-y 8s ease-in-out infinite;
  --animate-sway:    sway 6s ease-in-out infinite;
}`}
          </CodeBlock>
        </div>
      </Section>

      {/* Components */}
      <Section id="components" eyebrow="06 · Components" title="A small," italic="composable kit."
        sub="Just enough primitives to grow. Buttons, badges, image plates, progress arcs, stage bars. Compose them into cards and panels — never the other way around.">
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Logo */}
          <div style={{ padding: 32, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 18 }}>Logo · Mark · Wordmark · Stamp</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "center" }}>
              <SMark size={88} tone="forest" />
              <SWord size={36} />
              <SStamp size={120} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 24, padding: 22, borderRadius: 16, background: "var(--earth-950)" }}>
              <SMark size={44} tone="bone" />
              <SMark size={44} tone="gold" />
              <SMark size={44} tone="bio" />
              <SMark size={44} tone="forest" />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ padding: 32, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 18 }}>Buttons · 5 variants · 4 sizes</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
              <SBtn variant="primary" icon={<SIcon.Arrow size={14} />} glow>Primary</SBtn>
              <SBtn variant="solar" icon={<SIcon.Sun size={14} />} glow>Solar</SBtn>
              <SBtn variant="solid">Solid ink</SBtn>
              <SBtn variant="ghost" icon={<SIcon.Code size={14} />}>Ghost</SBtn>
              <SBtn variant="line">Line</SBtn>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <SBtn variant="primary" size="sm">SM</SBtn>
              <SBtn variant="primary" size="md">MD</SBtn>
              <SBtn variant="primary" size="lg">LG</SBtn>
              <SBtn variant="primary" size="xl" icon={<SIcon.Leaf size={18} />}>XL · with icon</SBtn>
            </div>
          </div>

          {/* Badges */}
          <div style={{ padding: 32, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 18 }}>Badges · 6 tones</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <SBadge tone="verdant" dot>Verdant</SBadge>
              <SBadge tone="solar" dot>Solar</SBadge>
              <SBadge tone="bio" dot>Bio</SBadge>
              <SBadge tone="coral" dot>Coral</SBadge>
              <SBadge tone="ink">Ink</SBadge>
              <SBadge tone="bone">Bone</SBadge>
            </div>
          </div>

          {/* Progress + stages */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 18 }}>
            <div style={{ padding: 28, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 18 }}>ProgressArc</div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <SArc value={0.32} size={56} />
                <SArc value={0.68} size={72} />
                <SArc value={0.92} size={88} />
              </div>
            </div>
            <div style={{ padding: 28, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 18 }}>StageBar</div>
              <SStage stages={["Field survey", "Nursery build", "Plant seedlings", "Year-1 monitor"]} current={1} />
            </div>
          </div>

          {/* Cards examples */}
          <div style={{ padding: 32, borderRadius: 24, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 18 }}>Composed cards · large imagery</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { img: SH.solarPanels, title: "Solar Mesh", tag: "Energy", chain: "Optimism" },
                { img: SH.mangrove,    title: "Mangrove Atlas", tag: "Coastal", chain: "Base" },
              ].map((c) => (
                <div key={c.title} style={{ borderRadius: 24, overflow: "hidden", background: "var(--bone-100)", border: "1px solid var(--line)" }}>
                  <div style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative" }}>
                    <img src={c.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <SBadge tone="bone">⛓ {c.chain}</SBadge>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <SBadge tone="verdant" dot>{c.tag}</SBadge>
                    <h3 className="display" style={{ fontSize: 26, margin: "10px 0 6px", color: "var(--earth-900)" }}>{c.title}</h3>
                    <div style={{ height: 6, borderRadius: 999, background: "var(--bone-300)", overflow: "hidden", marginTop: 14 }}>
                      <div style={{ width: "62%", height: "100%", background: "linear-gradient(90deg, var(--verdant-500), var(--solar-500))" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glass surface */}
          <div style={{
            position: "relative", borderRadius: 28, overflow: "hidden", padding: 32,
            background: `url(${SH.greenroof}) center/cover`,
            minHeight: 320,
          }}>
            <div className="glass-leaf" style={{ borderRadius: 24, padding: 24, maxWidth: 380 }}>
              <SBadge tone="solar" dot>glass-leaf</SBadge>
              <h3 className="display" style={{ fontSize: 28, margin: "10px 0 8px", color: "var(--earth-900)" }}>Frosted leaf</h3>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55, margin: 0 }}>Light glassmorphism over verdant imagery — used for floating panels, hero cards, and toolbar nav.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Tailwind config */}
      <Section id="tailwind" eyebrow="07 · Tailwind config" title="Drop-in" italic="for Tailwind v4."
        sub="Copy this @theme block into your CSS entry and the EcoHub palette, fonts, radii, shadows, and motion tokens are immediately available as utility classes.">
        <CodeBlock label="src/app.css — full @theme">
{`@import "tailwindcss";

@theme inline {
  /* === Color === */
  --color-verdant-50:  oklch(0.97 0.02 145);
  --color-verdant-100: oklch(0.93 0.04 145);
  --color-verdant-200: oklch(0.86 0.07 145);
  --color-verdant-300: oklch(0.76 0.11 145);
  --color-verdant-400: oklch(0.66 0.14 145);
  --color-verdant-500: oklch(0.55 0.15 145);
  --color-verdant-600: oklch(0.46 0.13 145);
  --color-verdant-700: oklch(0.37 0.10 145);
  --color-verdant-800: oklch(0.28 0.07 145);
  --color-verdant-900: oklch(0.20 0.05 145);
  --color-verdant-950: oklch(0.14 0.03 145);

  --color-solar-50:  oklch(0.98 0.02 85);
  --color-solar-100: oklch(0.95 0.04 85);
  --color-solar-300: oklch(0.85 0.11 85);
  --color-solar-500: oklch(0.78 0.13 85);
  --color-solar-700: oklch(0.55 0.12 75);
  --color-solar-900: oklch(0.30 0.07 70);

  --color-bio-100: oklch(0.93 0.04 195);
  --color-bio-300: oklch(0.80 0.10 195);
  --color-bio-500: oklch(0.72 0.12 195);
  --color-bio-700: oklch(0.48 0.10 200);
  --color-bio-900: oklch(0.24 0.06 210);

  --color-bone-50:  oklch(0.99 0.005 90);
  --color-bone-100: oklch(0.98 0.008 90);
  --color-bone-200: oklch(0.96 0.012 90);
  --color-bone-300: oklch(0.93 0.015 88);

  --color-earth-700: oklch(0.35 0.04 145);
  --color-earth-900: oklch(0.18 0.03 145);
  --color-earth-950: oklch(0.12 0.02 145);

  --color-coral-500: oklch(0.65 0.17 35);

  /* === Type === */
  --font-display: "Inter Display", "Inter", "Söhne", "Helvetica Neue", system-ui, sans-serif;
  --font-sans:    "Inter", "Söhne", "Helvetica Neue", system-ui, sans-serif;
  --font-mono:    "Geist Mono", "JetBrains Mono", ui-monospace, monospace;

  /* === Radii === */
  --radius-sm:  8px;
  --radius-md:  14px;
  --radius-lg:  22px;
  --radius-xl:  32px;
  --radius-2xl: 48px;

  /* === Shadows === */
  --shadow-leaf:       0 1px 2px oklch(0.20 0.05 145 / 0.06), 0 8px 24px oklch(0.20 0.05 145 / 0.08);
  --shadow-bloom:      0 2px 6px oklch(0.20 0.05 145 / 0.08), 0 24px 64px oklch(0.20 0.05 145 / 0.14);
  --shadow-glow-bio:   0 0 0 1px oklch(0.72 0.12 195 / 0.3), 0 12px 40px oklch(0.72 0.12 195 / 0.25);
  --shadow-glow-solar: 0 0 0 1px oklch(0.78 0.13 85 / 0.3),  0 12px 40px oklch(0.78 0.13 85 / 0.3);

  /* === Motion === */
  --animate-drift-y:      drift-y 8s ease-in-out infinite;
  --animate-drift-y-slow: drift-y 14s ease-in-out infinite;
  --animate-sway:         sway 6s ease-in-out infinite;
}

@keyframes drift-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes sway    { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }

/* glassy leaf surface */
.glass-leaf {
  background: linear-gradient(135deg,
    oklch(0.99 0.01 145 / 0.78),
    oklch(0.94 0.03 145 / 0.6));
  backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid oklch(0.99 0.01 145 / 0.7);
  box-shadow: var(--shadow-leaf);
}`}
        </CodeBlock>

        <div style={{ marginTop: 22 }}>
          <CodeBlock label="example.tsx — composing the hero CTA">
{`<button className="
  inline-flex items-center gap-2
  px-10 py-5 rounded-full
  bg-gradient-to-br from-solar-300 to-solar-500
  text-earth-900 font-medium text-lg
  border border-solar-700
  shadow-glow-solar
  transition-transform duration-200
  hover:-translate-y-0.5
">
  Plant a Project
  <ArrowIcon className="size-4" />
</button>`}
          </CodeBlock>
        </div>
      </Section>

      {/* Tailwind v3 alternative */}
      <Section id="tailwind-v3" eyebrow="07b · Tailwind v3" title="Same tokens," italic="classic config."
        sub="If you're still on Tailwind v3, the same palette plugs into a tailwind.config.js extend block. Functionally identical — same class names, same outputs.">
        <CodeBlock label="tailwind.config.js">
{`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        verdant: {
          50:  "oklch(0.97 0.02 145)", 100: "oklch(0.93 0.04 145)",
          200: "oklch(0.86 0.07 145)", 300: "oklch(0.76 0.11 145)",
          400: "oklch(0.66 0.14 145)", 500: "oklch(0.55 0.15 145)",
          600: "oklch(0.46 0.13 145)", 700: "oklch(0.37 0.10 145)",
          800: "oklch(0.28 0.07 145)", 900: "oklch(0.20 0.05 145)",
          950: "oklch(0.14 0.03 145)",
        },
        solar: { 300:"oklch(0.85 0.11 85)", 500:"oklch(0.78 0.13 85)", 700:"oklch(0.55 0.12 75)" },
        bio:   { 300:"oklch(0.80 0.10 195)",500:"oklch(0.72 0.12 195)",700:"oklch(0.48 0.10 200)" },
        bone:  { 50:"oklch(0.99 0.005 90)", 100:"oklch(0.98 0.008 90)", 200:"oklch(0.96 0.012 90)" },
        earth: { 700:"oklch(0.35 0.04 145)", 900:"oklch(0.18 0.03 145)", 950:"oklch(0.12 0.02 145)" },
      },
      fontFamily: {
        display: ['"Inter Display"', '"Inter"', '"Söhne"', '"Helvetica Neue"', "system-ui", "sans-serif"],
        sans:    ['"Inter"', '"Söhne"', '"Helvetica Neue"', "system-ui", "sans-serif"],
        mono:    ['"Geist Mono"', '"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: { sm:"8px", md:"14px", lg:"22px", xl:"32px", "2xl":"48px" },
      boxShadow: {
        leaf:       "0 1px 2px oklch(0.20 0.05 145 / 0.06), 0 8px 24px oklch(0.20 0.05 145 / 0.08)",
        bloom:      "0 2px 6px oklch(0.20 0.05 145 / 0.08), 0 24px 64px oklch(0.20 0.05 145 / 0.14)",
        "glow-bio":   "0 0 0 1px oklch(0.72 0.12 195 / 0.3), 0 12px 40px oklch(0.72 0.12 195 / 0.25)",
        "glow-solar": "0 0 0 1px oklch(0.78 0.13 85 / 0.3),  0 12px 40px oklch(0.78 0.13 85 / 0.3)",
      },
      animation: {
        "drift-y":      "drift-y 8s ease-in-out infinite",
        "drift-y-slow": "drift-y 14s ease-in-out infinite",
        sway:           "sway 6s ease-in-out infinite",
      },
      keyframes: {
        "drift-y": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        sway:      { "0%,100%": { transform: "rotate(-1.5deg)" }, "50%": { transform: "rotate(1.5deg)" } },
      },
    },
  },
};`}
        </CodeBlock>
      </Section>

      {/* Footer band */}
      <section style={{ position: "relative", padding: "120px 32px 100px", overflow: "hidden", background: "var(--earth-950)" }}>
        <img src={SH.forest} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
        <SWind density={0.6} palette="gold" />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", textAlign: "center", color: "var(--bone-50)" }}>
          <h2 className="display" style={{ fontSize: "clamp(48px, 6vw, 96px)", margin: "0 0 24px", lineHeight: 1 }}>
            One system.<br />
            <span className="display-italic" style={{ color: "var(--solar-300)" }}>Many gardens.</span>
          </h2>
          <p style={{ fontSize: 17, color: "oklch(0.95 0.02 90 / 0.85)", maxWidth: 620, margin: "0 auto 32px" }}>
            Use the EcoHub Design System anywhere — landing pages, dashboards, hardware UIs.
            Open under MIT · forks encouraged.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <SBtn variant="solar" size="lg" icon={<SIcon.Code size={16} />} glow>Get tailwind.config</SBtn>
            <SBtn variant="ghost" size="lg" icon={<SIcon.Fork size={14} />} onClick={() => onNav?.("landing")}>Back to product</SBtn>
          </div>
        </div>
      </section>
    </div>
  );
};

window.EcoSystem = SystemPage;
