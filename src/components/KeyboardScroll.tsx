"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";

const TOTAL_FRAMES = 192;
const CANVAS_BG = "#0d0d0f";

export default function KeyboardScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const sequencePath = isMobile ? "sequence_720p" : "sequence_4k";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    let loadedCount = 0;
    const imagesArray: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/${sequencePath}/frame_${i}_delay-0.04s.webp`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = imagesArray;
          setImagesLoaded(true);
          renderFrame(0);
        }
      };
      imagesArray.push(img);
    }
  }, []);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];

    if (!canvas || !ctx || !img) return;

    const dpr = isMobile ? 1 : (window.devicePixelRatio || 1);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, width, height);

    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let renderWidth = width;
    let renderHeight = height;
    let xOffset = 0;
    let yOffset = 0;

    if (canvasRatio > imgRatio) {
      renderHeight = height;
      renderWidth = height * imgRatio;
      xOffset = (width - renderWidth) / 2;
    } else {
      renderWidth = width;
      renderHeight = width / imgRatio;
      yOffset = (height - renderHeight) / 2;
    }

    ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
  };

  useEffect(() => {
    const handleResize = () => {
      const currentProgress = scrollYProgress.get();
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(currentProgress * TOTAL_FRAMES)
      );
      renderFrame(frameIndex);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded) return;

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.floor(latest * TOTAL_FRAMES)
    );

    requestAnimationFrame(() => renderFrame(frameIndex));

    if (latest < 0.15) {
      setCurrentSection(0);
    } else if (latest >= 0.15 && latest < 0.45) {
      setCurrentSection(1);
    } else if (latest >= 0.45 && latest < 0.8) {
      setCurrentSection(2);
    } else {
      setCurrentSection(-1);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-fog">

      <div className="sticky top-0 h-screen w-full overflow-hidden select-none pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 block" />

        {/* Bottom gradient overlay — ensures text readability on light frames */}
        <div className="absolute bottom-0 left-0 right-0 h-[25vh] bg-gradient-to-b from-transparent to-[#0d0d0f]/60 z-[4] pointer-events-none" />

        {/* Scroll-triggered annotation cards */}
        <AnimatePresence mode="wait">
          {currentSection === 0 && (
            <motion.div
              key="sec-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 z-10 flex items-center justify-center pt-14"
            >
              <div className="relative flex flex-col items-center">
                <div className="max-w-3xl w-full mx-6 bg-[#0d0d0f]/50 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <div className="flex">
                    <div className="w-[3px] flex-shrink-0 bg-[#e8b515] rounded-full" />
                    <div className="pl-4 md:pl-6">
                      <h1
                        className="font-[var(--font-display)] text-white leading-[1.05] tracking-[-0.02em] text-left"
                        style={{
                          fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                          textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                        }}
                      >
                        Every{" "}
                        <span className="relative">
                          keystroke
                          <span
                            className="absolute -bottom-1 left-0 right-0 h-[3px] md:h-[4px] rounded-full"
                            style={{ backgroundColor: "#e8b515" }}
                          />
                        </span>{" "}
                        is a <br className="hidden sm:block" />
                        decision.
                      </h1>
                      <p
                        className="mt-6 md:mt-8 text-[15px] md:text-[17px] text-[#d4d4d8] leading-[1.6] max-w-[480px] tracking-[-0.01em]"
                        style={{
                          textShadow: "0 4px 16px rgba(0,0,0,0.7)",
                        }}
                      >
                        Custom aluminum chassis, hand-selected switches, and hot-swap PCB
                        built for real work. Designed around how you work, not how
                        everyone else does.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mt-1">
                  <div className="w-px h-8 md:h-10 bg-gradient-to-b from-[#e8b515] to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-[#e8b515] -mt-px shadow-[0_0_6px_rgba(232,181,21,0.5)]" />
                </div>
              </div>
            </motion.div>
          )}

          {currentSection === 1 && (
            <motion.div
              key="sec-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute z-10"
              style={{ bottom: '22%', left: 'max(16px, 4%)' }}
            >
              <div className="relative flex items-end">
                <div className="flex bg-[#0d0d0f]/50 backdrop-blur-sm rounded-xl p-4 md:p-5">
                  <div className="w-[3px] flex-shrink-0 bg-[#e8b515] rounded-full" />
                  <div className="pl-3 md:pl-5">
                    <h2
                      className="font-[var(--font-display)] text-white leading-[1.07] tracking-[-0.02em]"
                      style={{
                        fontSize: "clamp(1.8rem, 4.5vw, 4rem)",
                        textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                      }}
                    >
                      Solid Foundation.
                    </h2>
                    <p className="mt-2 md:mt-3 text-[14px] md:text-[16px] text-[#d4d4d8] leading-[1.6] max-w-[400px] tracking-[-0.01em]" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.7)' }}>
                      CNC-machined aluminum chassis. Gasket-mounted plate. Precision starts at the base.
                    </p>
                  </div>
                </div>
                <div className="flex items-center ml-3 md:ml-4 mb-2 md:mb-3">
                  <div className="w-8 md:w-12 h-px bg-gradient-to-r from-[#e8b515] to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-[#e8b515] -ml-px shadow-[0_0_6px_rgba(232,181,21,0.5)]" />
                </div>
              </div>
            </motion.div>
          )}

          {currentSection === 2 && (
            <motion.div
              key="sec-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute z-10"
              style={{ top: '20%', right: 'max(16px, 4%)' }}
            >
              <div className="relative flex items-start">
                <div className="flex items-center mr-3 md:mr-4 mt-2 md:mt-3">
                  <div className="w-8 md:w-12 h-px bg-gradient-to-l from-[#e8b515] to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-[#e8b515] -mr-px shadow-[0_0_6px_rgba(232,181,21,0.5)]" />
                </div>
                <div className="flex bg-[#0d0d0f]/50 backdrop-blur-sm rounded-xl p-4 md:p-5">
                  <div className="w-[3px] flex-shrink-0 bg-[#e8b515] rounded-full" />
                  <div className="pl-3 md:pl-5">
                    <h2
                      className="font-[var(--font-display)] text-white leading-[1.07] tracking-[-0.02em]"
                      style={{
                        fontSize: "clamp(1.8rem, 4.5vw, 4rem)",
                        textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                      }}
                    >
                      Inside the Frame.
                    </h2>
                    <p className="mt-2 md:mt-3 text-[14px] md:text-[16px] text-[#d4d4d8] leading-[1.6] max-w-[420px] tracking-[-0.01em]" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.7)' }}>
                      The top case lifts to reveal a milled aluminum plate, precision-cut to hold every switch in perfect alignment. Beneath it, a hotswap PCB — no soldering required, swap switches in seconds. Three layers of sound-dampening foam isolate each keystroke, while screw-in stabilizers eliminate rattle on the larger keys. The bottom case, CNC'd from a single block of aluminum, anchors everything in place.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
