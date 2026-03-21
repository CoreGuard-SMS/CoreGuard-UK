"use client";

import { useEffect, useRef } from "react";

export function DirectionalFlare() {
  const flareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!flareRef.current) return;
      
      const { clientX, clientY } = e;
      const flare = flareRef.current;
      
      // Make the flare visible and move it with the cursor
      flare.style.opacity = "1";
      flare.style.transform = `translate(${
        clientX - flare.offsetWidth / 2
      }px, ${clientY - flare.offsetHeight / 2}px)`;
    };

    const handleMouseLeave = () => {
      if (!flareRef.current) return;
      flareRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .directional-flare {
          position: fixed;
          top: 0;
          left: 0;
          width: 400px;
          height: 400px;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.3s ease;
          background: radial-gradient(
            circle,
            rgba(120, 119, 198, 0.3) 0%,
            rgba(120, 119, 198, 0.2) 20%,
            rgba(120, 119, 198, 0.1) 40%,
            transparent 70%
          );
          filter: blur(40px);
          border-radius: 50%;
        }
        
        .dark .directional-flare {
          background: radial-gradient(
            circle,
            rgba(168, 85, 247, 0.3) 0%,
            rgba(168, 85, 247, 0.2) 20%,
            rgba(168, 85, 247, 0.1) 40%,
            transparent 70%
          );
        }
      `}</style>
      
      <div ref={flareRef} className="directional-flare" />
    </>
  );
}
