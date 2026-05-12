// CREATE PROJECT — multi-step form with stages, IPFS, deploy preview
const { Btn: CBtn, Badge: CBadge, ImagePlate: CImg, VineDivider: CVine, Icon: CIcon } = window.EcoUI;
const { WindCanvas: CWind, WaterCursor: CWater } = window.EcoFx;
const { NavBar: CNav } = window.EcoNav;
const { HERO_IMAGES: CH } = window.EcoData;
const { useState: useCS } = React;

const CreateProject = ({ onNav }) => {
  const [step, setStep] = useCS(1);
  const [stages, setStages] = useCS([
    { name: "Field survey & baseline mapping", amount: 8000, days: 30, desc: "Sonar bathymetry + drone imagery of 12km coast." },
    { name: "Build community nursery", amount: 18000, days: 45, desc: "Modular nursery, 12k seedling capacity." },
    { name: "Plant first 12,000 seedlings", amount: 24000, days: 60, desc: "Coordinated planting w/ 4 coastal communities." },
  ]);
  const [title, setTitle] = useCS("Mangrove Restoration Atlas");
  const [tagline, setTagline] = useCS("Open-source mapping & seedling distribution for coastal regeneration.");
  const [bio, setBio] = useCS("Cartagena → Barranquilla coastline, Colombia");
  const [chain, setChain] = useCS("Base");
  const [license, setLicense] = useCS("CERN-OHL-S");

  const totalGoal = stages.reduce((s, x) => s + Number(x.amount || 0), 0);

  const updateStage = (i, key, val) => {
    setStages(stages.map((s, j) => j === i ? { ...s, [key]: val } : s));
  };
  const addStage = () => setStages([...stages, { name: "New stage", amount: 0, days: 30, desc: "" }]);
  const removeStage = (i) => setStages(stages.filter((_, j) => j !== i));

  const Field = ({ label, value, onChange, placeholder, big = false, hint }) => (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>{label}</label>
      {big ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
          style={fieldStyle} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={fieldStyle} />
      )}
      {hint && <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>{hint}</div>}
    </div>
  );
  const fieldStyle = {
    width: "100%", border: "1px solid var(--line)", borderRadius: 14,
    padding: "14px 16px", fontFamily: "var(--font-body)", fontSize: 15,
    background: "var(--bone-50)", color: "var(--earth-900)",
    outline: "none", resize: "vertical",
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "linear-gradient(180deg, var(--verdant-50) 0%, var(--bg) 600px)" }}>
      {/* Subtle banner image */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 480, overflow: "hidden", zIndex: 0 }}>
        <img src={CH.greenhouse} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, oklch(0.20 0.05 145 / 0.4), var(--verdant-50))" }} />
      </div>
      <CWind density={0.6} palette="forest" />
      <CWater tint="bio" />
      <CNav current="create" onNav={onNav} dark />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "160px 32px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <CBadge tone="bone" dot>Plant a project</CBadge>
            <h1 className="display" style={{ fontSize: "clamp(48px, 6vw, 84px)", margin: "16px 0 8px", color: "var(--bone-50)", textShadow: "0 2px 24px oklch(0.20 0.05 145 / 0.5)" }}>
              Sow your <span className="display-italic" style={{ color: "var(--solar-300)" }}>stage tree</span>.
            </h1>
            <p style={{ fontSize: 17, color: "oklch(0.95 0.02 90 / 0.85)", maxWidth: 520, margin: 0 }}>
              Each stage is a milestone. Funds unlock only when validators attest. Define the path, and the forest will grow with you.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <CBtn variant="ghost">Save draft</CBtn>
            <CBtn variant="line">Preview</CBtn>
          </div>
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {[
            { n: 1, l: "Identity" },
            { n: 2, l: "Stages" },
            { n: 3, l: "On-chain" },
            { n: 4, l: "Publish" },
          ].map((s) => {
            const state = s.n === step ? "active" : s.n < step ? "done" : "future";
            return (
              <button key={s.n} onClick={() => setStep(s.n)} style={{
                flex: 1, padding: "14px 18px", borderRadius: 16,
                border: state === "active" ? "1.5px solid var(--verdant-700)" : "1px solid var(--line)",
                background: state === "done" ? "var(--verdant-100)" : state === "active" ? "var(--bone-50)" : "oklch(0.99 0.01 90 / 0.8)",
                cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "grid", placeItems: "center",
                  background: state === "future" ? "var(--bone-300)" : "var(--verdant-600)",
                  color: state === "future" ? "var(--earth-700)" : "var(--bone-50)",
                  fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600,
                }}>
                  {state === "done" ? <CIcon.Check size={14} /> : String(s.n).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)" }}>Step</div>
                  <div style={{ fontWeight: 500, fontSize: 15, color: "var(--earth-900)" }}>{s.l}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Body grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
          <div className="glass-leaf" style={{ borderRadius: 32, padding: 36, position: "relative", overflow: "hidden" }}>
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <h2 className="display" style={{ fontSize: 36, margin: 0, color: "var(--earth-900)" }}>Project identity</h2>
                <Field label="Project title" value={title} onChange={setTitle} placeholder="e.g. Mangrove Restoration Atlas" />
                <Field label="Tagline" value={tagline} onChange={setTagline} placeholder="One-line description" big />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <Field label="Bioregion" value={bio} onChange={setBio} placeholder="Region or coordinates" />
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>License</label>
                    <select value={license} onChange={(e) => setLicense(e.target.value)} style={{ ...fieldStyle, appearance: "none" }}>
                      <option>CERN-OHL-S</option><option>MIT</option><option>CC-BY-SA 4.0</option><option>Apache-2.0</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>Cover image</label>
                  <div style={{
                    border: "2px dashed var(--verdant-300)", borderRadius: 18, padding: 32,
                    display: "flex", alignItems: "center", gap: 18, background: "var(--verdant-50)",
                  }}>
                    <img src={CH.mangrove} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 10 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: "var(--earth-900)" }}>cartagena-coast-baseline.jpg</div>
                      <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>2400×1600 · pinned to IPFS · bafkreig…84zr</div>
                    </div>
                    <CBtn variant="line" size="sm">Replace</CBtn>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>Tags</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Coastal", "Hardware", "Mapping", "Open Data", "+ Add"].map((t) => (
                      <CBadge key={t} tone={t === "+ Add" ? "bone" : "verdant"}>{t}</CBadge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 className="display" style={{ fontSize: 36, margin: 0, color: "var(--earth-900)" }}>Define stages</h2>
                  <CBtn variant="line" size="sm" icon={<CIcon.Plus size={14} />} onClick={addStage}>Add stage</CBtn>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {stages.map((s, i) => (
                    <div key={i} style={{
                      borderRadius: 20, padding: 20,
                      background: "var(--bone-50)", border: "1px solid var(--line)",
                      display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "start",
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: "linear-gradient(135deg, var(--verdant-500), var(--verdant-700))",
                        color: "var(--bone-50)", display: "grid", placeItems: "center",
                        fontFamily: "var(--font-mono)", fontWeight: 600,
                      }}>{String(i + 1).padStart(2, "0")}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input value={s.name} onChange={(e) => updateStage(i, "name", e.target.value)}
                          style={{ ...fieldStyle, fontWeight: 500, fontSize: 16, padding: "10px 14px", border: "1px solid var(--line)" }} />
                        <textarea value={s.desc} onChange={(e) => updateStage(i, "desc", e.target.value)} rows={2}
                          style={{ ...fieldStyle, fontSize: 13, padding: "10px 14px" }} />
                        <div style={{ display: "flex", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--verdant-50)", borderRadius: 10 }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>USDC</span>
                            <input type="number" value={s.amount} onChange={(e) => updateStage(i, "amount", Number(e.target.value))}
                              style={{ border: "none", background: "transparent", width: 90, fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--earth-900)", outline: "none" }} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--solar-100)", borderRadius: 10 }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>DAYS</span>
                            <input type="number" value={s.days} onChange={(e) => updateStage(i, "days", Number(e.target.value))}
                              style={{ border: "none", background: "transparent", width: 50, fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--earth-900)", outline: "none" }} />
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeStage(i)} style={{
                        width: 32, height: 32, borderRadius: 10, border: "1px solid var(--line)",
                        background: "var(--bone-50)", color: "var(--ink-soft)", cursor: "pointer",
                      }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: 18, borderRadius: 14, background: "var(--verdant-100)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--verdant-800)" }}>Total funding goal</span>
                  <span className="display" style={{ fontSize: 28, color: "var(--verdant-800)", lineHeight: 1 }}>${totalGoal.toLocaleString()} USDC</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <h2 className="display" style={{ fontSize: 36, margin: 0, color: "var(--earth-900)" }}>On-chain configuration</h2>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>Network</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {["Base", "Optimism", "Polygon"].map((c) => (
                      <button key={c} onClick={() => setChain(c)} style={{
                        padding: "18px", borderRadius: 14, cursor: "pointer",
                        border: chain === c ? "1.5px solid var(--verdant-700)" : "1px solid var(--line)",
                        background: chain === c ? "var(--verdant-100)" : "var(--bone-50)",
                        textAlign: "left",
                      }}>
                        <div style={{ fontWeight: 600, color: "var(--earth-900)", marginBottom: 4 }}>{c}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>~$0.{c === "Base" ? "002" : c === "Optimism" ? "003" : "001"} per tx</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Validators required" value="3 of 5" onChange={() => {}} hint="Multi-sig attestation per stage." />
                  <Field label="Backer voting" value="Quadratic" onChange={() => {}} hint="Used to dispute or accelerate." />
                </div>
                <div style={{ padding: 18, borderRadius: 14, background: "var(--earth-900)", color: "var(--bone-50)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7 }}>
                  <div style={{ color: "var(--solar-300)", marginBottom: 6 }}>// EcoHub.sol — generated</div>
                  StageEscrow(chain="{chain}")<br />
                  &nbsp;.stages([{stages.length}])<br />
                  &nbsp;.totalGoal({totalGoal})<br />
                  &nbsp;.validators(3, [Δ-04, Σ-19, Ω-71])<br />
                  &nbsp;.metadata("ipfs://bafy…m9w2")
                </div>
              </div>
            )}

            {step === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <h2 className="display" style={{ fontSize: 36, margin: 0, color: "var(--earth-900)" }}>Ready to publish</h2>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>Three transactions, one root: pin to IPFS, deploy escrow, register in the EcoHub registry.</p>
                {[
                  { l: "Pin metadata to IPFS", s: "Free · ~3s", done: true },
                  { l: "Deploy stage-escrow contract", s: "0.0024 ETH · ~12s", done: false },
                  { l: "Register in EcoHub registry", s: "0.0008 ETH · ~6s", done: false },
                ].map((t) => (
                  <div key={t.l} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 14, background: "var(--bone-50)", border: "1px solid var(--line)" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center",
                      background: t.done ? "var(--verdant-500)" : "var(--bone-300)",
                      color: t.done ? "var(--bone-50)" : "var(--earth-700)",
                    }}>{t.done ? <CIcon.Check size={16} /> : "·"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{t.l}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{t.s}</div>
                    </div>
                  </div>
                ))}
                <CBtn variant="primary" size="lg" icon={<CIcon.Spark size={16} />} glow>Sign & publish</CBtn>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
              <CBtn variant="ghost" onClick={() => setStep(Math.max(1, step - 1))}>← Back</CBtn>
              <CBtn variant="primary" icon={<CIcon.Arrow size={14} />} onClick={() => setStep(Math.min(4, step + 1))}>
                {step === 4 ? "Publish project" : "Continue"}
              </CBtn>
            </div>
          </div>

          {/* Live preview side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 100, alignSelf: "start" }}>
            <CBadge tone="solar" dot>Live preview</CBadge>
            <div style={{ borderRadius: 28, overflow: "hidden", background: "var(--bone-50)", border: "1px solid var(--line)", boxShadow: "var(--shadow-bloom)" }}>
              <img src={CH.mangrove} style={{ width: "100%", height: 200, objectFit: "cover" }} />
              <div style={{ padding: 22 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "var(--ink-soft)", marginBottom: 8 }}>
                  {bio.toUpperCase()}
                </div>
                <h3 className="display" style={{ fontSize: 26, margin: "0 0 8px", color: "var(--earth-900)" }}>{title}</h3>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{tagline}</p>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                  {stages.map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                      <span style={{ color: "var(--earth-900)" }}>
                        <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink-soft)", marginRight: 8 }}>{String(i+1).padStart(2,"0")}</span>
                        {s.name}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--verdant-700)" }}>${Number(s.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, padding: 12, background: "var(--verdant-100)", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--verdant-800)" }}>Goal</span>
                  <span className="display" style={{ fontSize: 20, color: "var(--verdant-800)", lineHeight: 1 }}>${totalGoal.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: 18, borderRadius: 18, background: "var(--earth-900)", color: "var(--bone-100)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "var(--solar-300)", marginBottom: 8 }}>NETWORK</div>
              <div style={{ fontWeight: 500, marginBottom: 12 }}>{chain} · 3-of-5 validators</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "oklch(0.85 0.02 90 / 0.6)" }}>
                Est. gas · 0.0032 ETH<br />Est. publish time · 21s
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.EcoCreate = CreateProject;
