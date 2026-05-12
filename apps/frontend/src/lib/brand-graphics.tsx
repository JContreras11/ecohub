import { BRAND } from "./brand";

const COLORS = {
  earth: "#082218",
  earthSoft: "#12382a",
  verdant: "#2fb160",
  verdantSoft: "#8be28f",
  solar: "#ffd166",
  bone: "#f8f4e8",
  mist: "#d9f2df",
  bio: "#5fcfb0",
};

interface IconArtProps {
  size: number;
}

export function BrandIconArt({ size }: IconArtProps) {
  const borderRadius = Math.round(size * 0.22);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        borderRadius,
        background: `linear-gradient(135deg, ${COLORS.earth} 0%, ${COLORS.earthSoft} 52%, ${COLORS.verdant} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${size * 0.16}px`,
          right: `${size * 0.16}px`,
          width: `${size * 0.16}px`,
          height: `${size * 0.16}px`,
          display: "flex",
          borderRadius: 9999,
          background: COLORS.solar,
        }}
      />

      <div
        style={{
          position: "relative",
          width: `${size * 0.58}px`,
          height: `${size * 0.58}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: `${size * 0.27}px`,
            height: `${size * 0.38}px`,
            display: "flex",
            background: `linear-gradient(180deg, ${COLORS.solar} 0%, ${COLORS.verdantSoft} 100%)`,
            border: `${Math.max(2, Math.round(size * 0.03))}px solid rgba(248, 244, 232, 0.95)`,
            borderRadius: `${size * 0.2}px 0 ${size * 0.2}px 0`,
            transform: "rotate(-45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: `${Math.max(4, Math.round(size * 0.03))}px`,
            height: `${size * 0.32}px`,
            display: "flex",
            background: COLORS.bone,
            borderRadius: 9999,
            transform: "rotate(-45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: `${size * 0.1}px`,
            left: `${size * 0.12}px`,
            width: `${size * 0.09}px`,
            height: `${size * 0.09}px`,
            display: "flex",
            borderRadius: 9999,
            background: COLORS.bio,
          }}
        />
      </div>
    </div>
  );
}

interface SocialCardProps {
  width: number;
  height: number;
}

export function BrandSocialCard({ width, height }: SocialCardProps) {
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${COLORS.earth} 0%, #103524 40%, #1e6b48 100%)`,
        color: COLORS.bone,
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-100px",
          width: "420px",
          height: "420px",
          display: "flex",
          borderRadius: 9999,
          background: "rgba(255, 209, 102, 0.22)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-160px",
          left: "-80px",
          width: "360px",
          height: "360px",
          display: "flex",
          borderRadius: 9999,
          background: "rgba(95, 207, 176, 0.16)",
        }}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "48px",
        }}
      >
        <div
          style={{
            width: "340px",
            height: "340px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "52px",
            background: "rgba(248, 244, 232, 0.08)",
            border: "1px solid rgba(248, 244, 232, 0.12)",
          }}
        >
          <BrandIconArt size={220} />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: COLORS.solar,
            }}
          >
            {BRAND.eyebrow}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 0.95,
              }}
            >
              <span>{BRAND.wordmark.leading}</span>
              <span style={{ color: COLORS.verdantSoft }}>{BRAND.wordmark.accent}</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                lineHeight: 1.15,
                color: COLORS.mist,
              }}
            >
              {BRAND.tagline}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              maxWidth: "620px",
              fontSize: 28,
              lineHeight: 1.45,
              color: "rgba(248, 244, 232, 0.9)",
            }}
          >
            Publish ecological projects, fund milestone-based releases, and verify impact with transparent on-chain roots.
          </div>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {["Milestone escrow", "Open ecology", "Wallet-first profiles"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 9999,
                  padding: "10px 18px",
                  fontSize: 22,
                  color: COLORS.bone,
                  background: "rgba(248, 244, 232, 0.08)",
                  border: "1px solid rgba(248, 244, 232, 0.12)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
