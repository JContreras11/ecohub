import { Metadata } from "next";
import { WindCanvas, WaterCursor } from "@/components/effects";
import CreateProjectForm from "@/components/CreateProjectForm";
import { brandTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: brandTitle("Sow your stage tree"),
  description:
    "Each stage is a milestone. Funds unlock only when validators attest. Define the path, and the forest will grow with you.",
};

const GREENHOUSE_IMAGE = "/images/create-greenhouse.jpg";

export default function CreatePage() {
  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,var(--verdant-50)_0%,var(--bg)_600px)]">
      {/* Subtle banner image */}
      <div className="absolute top-0 left-0 right-0 h-[480px] overflow-hidden z-0">
        <img 
          src={GREENHOUSE_IMAGE} 
          alt="Greenhouse"
          className="w-full h-full object-cover opacity-50" 
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.20_0.05_145/0.4),var(--verdant-50))]" />
      </div>

      <WindCanvas density={0.6} palette="forest" />
      <WaterCursor tint="bio" />

      <div className="relative z-10">
        {/* Navbar is handled by layout.tsx usually, but if we need a dark one here we can customize */}
        {/* However, the global layout has the NavBar. If I need a special one, I might need to hide the global one or pass props. */}
        {/* For now, I'll assume the global Navbar works or I'll add a local one if the user wants to override. */}
        
        <div className="max-w-[1320px] mx-auto px-8 pt-[160px] pb-20">
          <CreateProjectForm />
        </div>
      </div>
    </div>
  );
}
