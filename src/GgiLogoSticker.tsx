import React from "react";

interface GgiLogoStickerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showCaption?: boolean;
}

/**
 * GgiLogoSticker - Authentically styled vinyl sticker component for Gulzar Group of Institutes.
 * Designed with a glossy die-cut white outline, subtle realistic drop-shadow, specular shine streak,
 * and slight tactile tilt so it looks like a real physical vinyl sticker instead of a plain flat image.
 */
export default function GgiLogoSticker({
  size = "md",
  className = "",
  showCaption = false,
}: GgiLogoStickerProps) {
  const sizeClasses = {
    sm: "h-8 px-2 py-1",
    md: "h-11 px-2.5 py-1.5",
    lg: "h-16 px-4 py-2",
    xl: "h-24 px-5 py-3",
  };

  const imgSizeClasses = {
    sm: "h-6 max-w-[110px]",
    md: "h-8 max-w-[150px]",
    lg: "h-12 max-w-[210px]",
    xl: "h-16 max-w-[280px]",
  };

  return (
    <div
      className={`group relative inline-flex flex-col items-center select-none ${className}`}
      title="Official Gulzar Group of Institutes (GGI) Sticker Badge"
    >
      {/* Vinyl Sticker Wrapper with die-cut white border and physical sticker drop shadow */}
      <div
        className={`relative inline-flex items-center justify-center rounded-xl md:rounded-2xl bg-white border-2 border-white shadow-[0_6px_16px_rgba(0,0,0,0.16),0_2px_4px_rgba(0,0,0,0.08)] ring-1 ring-slate-900/5 transition-all duration-300 ease-out transform group-hover:scale-105 group-hover:-rotate-1 group-hover:shadow-[0_10px_24px_rgba(0,0,0,0.22)] -rotate-1 ${sizeClasses[size]}`}
        style={{
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.12))",
        }}
      >
        {/* Specular Gloss Overlay Streak */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden"
        >
          <div className="absolute -inset-x-full -top-full h-[300%] w-[300%] rotate-45 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-80 group-hover:translate-x-1/2 transition-transform duration-700" />
        </div>

        {/* Die-cut peeled corner accent */}
        <div
          aria-hidden="true"
          className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-bl from-slate-200 to-white rounded-bl-sm shadow-[0_1px_2px_rgba(0,0,0,0.25)] border-t border-r border-slate-300"
        />

        {/* GGI Logo Image */}
        <img
          src="/ggi-logo.png"
          alt="Gulzar Group of Institutions (GGI Khanna)"
          className={`object-contain transition-transform duration-200 ${imgSizeClasses[size]}`}
          loading="eager"
        />
      </div>

      {showCaption && (
        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full border border-indigo-200/50 shadow-xs">
          ★ Official GGI Sticker ★
        </span>
      )}
    </div>
  );
}
