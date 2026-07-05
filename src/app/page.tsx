import KeyboardScroll from "@/components/KeyboardScroll";

export const metadata = {
  title: "Precision Engineered Keyboard",
  description: "A mechanical keyboard built from the inside out. Exploded view scrollytelling experience.",
};

export default function Home() {
  return (
    <main className="relative w-full bg-[#0d0d0f]">
      <KeyboardScroll />

      <footer className="border-t border-[#2d2d2f] bg-[#0d0d0f]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-4 md:gap-8 text-[11px] md:text-[12px] text-[#555558] tracking-[0.03em]">
            <span className="text-[#d4d4d8] font-[500]">ANSI 75%</span>
            <span className="w-px h-3 bg-[#2d2d2f]" />
            <span>CNC Aluminum</span>
            <span className="w-px h-3 bg-[#2d2d2f] hidden sm:block" />
            <span className="hidden sm:inline">Hot-swap PCB</span>
            <span className="w-px h-3 bg-[#2d2d2f] hidden md:block" />
            <span className="hidden md:inline">Gasket Mount</span>
          </div>

          <button className="flex items-center gap-1.5 px-4 md:px-5 py-1.5 md:py-2 rounded-full border border-[#e8b515]/40 text-[12px] md:text-[13px] font-[500] text-[#e8b515] hover:bg-[#e8b515]/10 transition-all tracking-[0.02em]">
            Explore Builds
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer>
    </main>
  );
}
