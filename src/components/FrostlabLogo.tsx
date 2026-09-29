import React from 'react';

interface FrostlabLogoProps {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  iconSize?: number;
  interactive?: boolean;
}

export const FrostlabLogo: React.FC<FrostlabLogoProps> = ({
  className = '',
  showWordmark = true,
  wordmarkClassName = 'text-xl tracking-wider font-extrabold',
  iconSize = 36,
  interactive = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Balaclava Polygonal Icon */}
      <div 
        className="relative transition-transform duration-300 ease-out group-hover:scale-105"
        style={{ width: iconSize, height: (iconSize * 42) / 36 }}
      >
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_10px_rgba(255,59,48,0.25)] transition-all duration-300"
        >
          <defs>
            <clipPath id="balaclava-silhouette">
              {/* Ergonomic Head + Balaclava Neck Silhouette */}
              <path d="M50 4 C32 4, 20 20, 20 38 C20 48, 22 55, 18 64 C16 68, 17 76, 22 80 C24 82, 28 84, 27 88 C25 93, 26 102, 36 108 C42 112, 58 112, 64 108 C74 102, 75 93, 73 88 C72 84, 76 82, 78 80 C83 76, 84 68, 82 64 C78 55, 80 48, 80 38 C80 20, 68 4, 50 4 Z" />
            </clipPath>

            <linearGradient id="frostlab-red-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff2a2a" />
              <stop offset="100%" stopColor="#b30909" />
            </linearGradient>

            <linearGradient id="frostlab-cyan-thermo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="100%" stopColor="#4facfe" />
            </linearGradient>
          </defs>

          {/* Mask Background Silhouette with faceted polygonal triangles */}
          <g clipPath="url(#balaclava-silhouette)">
            {/* Base Tone */}
            <rect width="100" height="120" fill="#2d333b" />

            {/* Faceted Grey / Charcoal Polygons */}
            <polygon points="50,4 20,38 50,45" fill="#444c56" />
            <polygon points="50,4 50,45 80,38" fill="#373e47" />
            <polygon points="20,38 35,60 50,45" fill="#22272e" />
            <polygon points="80,38 65,60 50,45" fill="#2d333b" />
            <polygon points="20,38 18,64 35,60" fill="#545d68" />
            <polygon points="80,38 82,64 65,60" fill="#444c56" />

            {/* Red Thermo / Tactical Accents (from original logo) */}
            <polygon points="28,14 42,12 36,28" fill="url(#frostlab-red-grad)" className="transition-all duration-300 group-hover:opacity-90" />
            <polygon points="62,18 74,22 66,34" fill="url(#frostlab-red-grad)" />
            <polygon points="20,44 32,50 25,62" fill="url(#frostlab-red-grad)" />
            <polygon points="70,44 80,56 68,60" fill="url(#frostlab-red-grad)" />
            <polygon points="40,56 60,56 50,75" fill="#1c2128" />

            {/* Mid Face & Chin Polygons */}
            <polygon points="35,60 50,75 18,64" fill="#373e47" />
            <polygon points="65,60 50,75 82,64" fill="#22272e" />
            <polygon points="18,64 50,85 27,88" fill="#2d333b" />
            <polygon points="82,64 50,85 73,88" fill="#444c56" />

            {/* Lower Neck Red Shards */}
            <polygon points="42,78 50,85 36,92" fill="url(#frostlab-red-grad)" />
            <polygon points="58,78 64,92 50,85" fill="url(#frostlab-red-grad)" />
            <polygon points="30,90 50,110 26,102" fill="url(#frostlab-red-grad)" />
            <polygon points="70,90 74,102 50,110" fill="url(#frostlab-red-grad)" />
            <polygon points="36,108 50,112 50,85" fill="#1c2128" />
            <polygon points="64,108 50,112 50,85" fill="#2d333b" />

            {/* Interactive Thermo Glow Pulse on Hover */}
            {interactive && (
              <circle
                cx="50"
                cy="60"
                r="45"
                fill="url(#frostlab-cyan-thermo)"
                opacity="0"
                className="transition-opacity duration-500 ease-out group-hover:opacity-30 mix-blend-screen pointer-events-none"
              />
            )}
          </g>

          {/* Iconic White Ski Eye Slits */}
          <path
            d="M26 49 C33 46, 42 46, 47 50 C44 54, 34 54, 26 49 Z"
            fill="#ffffff"
            className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          />
          <path
            d="M74 49 C67 46, 58 46, 53 50 C56 54, 66 54, 74 49 Z"
            fill="#ffffff"
            className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-display text-white tracking-[0.14em] font-black uppercase transition-colors duration-300 group-hover:text-[#00f2fe] ${wordmarkClassName}`}
          >
            FROSTLABS
          </span>
          <span className="text-[9px] tracking-[0.32em] font-medium text-slate-400 uppercase -mt-0.5">
            Alpine Techwear
          </span>
        </div>
      )}
    </div>
  );
};
