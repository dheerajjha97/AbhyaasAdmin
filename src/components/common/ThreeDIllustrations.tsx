import React from 'react';

/**
 * 3D Isometric Claymorphic Illustrated Visuals
 * Crafted with multi-layer SVG lighting, specular 3D highlights, clay gradients, and depth shadows.
 */

export const ThreeDExamIllustration: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_12px_24px_rgba(79,70,229,0.25)] ${className}`}
  >
    <defs>
      <radialGradient id="examBgGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="boardGrad" x1="20" y1="20" x2="140" y2="150" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="0.5" stopColor="#4f46e5" />
        <stop offset="1" stopColor="#3730a3" />
      </linearGradient>
      <linearGradient id="sheetGrad" x1="35" y1="35" x2="125" y2="135" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#f1f5f9" />
      </linearGradient>
      <linearGradient id="clipGrad" x1="60" y1="12" x2="100" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="pencilGrad" x1="100" y1="90" x2="145" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ec4899" />
        <stop offset="1" stopColor="#be185d" />
      </linearGradient>
      <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1e1b4b" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Background Glow */}
    <circle cx="80" cy="80" r="70" fill="url(#examBgGlow)" />

    {/* 3D Clipboard Base */}
    <g filter="url(#clayShadow)">
      <rect x="26" y="24" width="108" height="120" rx="18" fill="url(#boardGrad)" />
      {/* 3D Highlight top edge */}
      <rect x="28" y="26" width="104" height="6" rx="3" fill="#a5b4fc" fillOpacity="0.6" />
    </g>

    {/* Paper Sheet */}
    <g filter="url(#clayShadow)">
      <rect x="36" y="38" width="88" height="96" rx="12" fill="url(#sheetGrad)" />
      {/* Top Paper Highlight */}
      <rect x="38" y="40" width="84" height="4" rx="2" fill="#ffffff" />
      
      {/* Written Question Lines */}
      <rect x="46" y="52" width="45" height="5" rx="2.5" fill="#6366f1" />
      <rect x="46" y="62" width="68" height="4" rx="2" fill="#cbd5e1" />
      <rect x="46" y="70" width="60" height="4" rx="2" fill="#e2e8f0" />

      {/* MCQ Options with Checkmarks */}
      <circle cx="50" cy="86" r="5" fill="#10b981" />
      <path d="M48 86L50 88L53 84" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="58" y="84" width="48" height="4" rx="2" fill="#94a3b8" />

      <circle cx="50" cy="100" r="5" fill="#e2e8f0" />
      <rect x="58" y="98" width="40" height="4" rx="2" fill="#cbd5e1" />

      <circle cx="50" cy="114" r="5" fill="#e2e8f0" />
      <rect x="58" y="112" width="52" height="4" rx="2" fill="#cbd5e1" />
    </g>

    {/* 3D Gold Top Clip */}
    <g filter="url(#clayShadow)">
      <rect x="58" y="16" width="44" height="18" rx="7" fill="url(#clipGrad)" />
      <rect x="68" y="12" width="24" height="8" rx="4" fill="#fbbf24" />
      <circle cx="80" cy="25" r="3" fill="#78350f" />
    </g>

    {/* 3D Floating Pencil */}
    <g transform="rotate(-25 125 110)">
      <rect x="105" y="60" width="14" height="52" rx="4" fill="url(#pencilGrad)" />
      <polygon points="105,112 119,112 112,126" fill="#fde047" />
      <polygon points="110,122 114,122 112,126" fill="#1e293b" />
      <rect x="105" y="54" width="14" height="8" rx="2" fill="#f43f5e" />
    </g>

    {/* Floating 3D Golden Star Badge */}
    <g transform="translate(112, 30) scale(0.9)">
      <circle cx="16" cy="16" r="16" fill="#fbbf24" />
      <circle cx="16" cy="16" r="13" fill="#f59e0b" />
      <path
        d="M16 7L18.5 12.5L24.5 13.2L20 17.2L21.3 23L16 20L10.7 23L12 17.2L7.5 13.2L13.5 12.5L16 7Z"
        fill="#ffffff"
      />
    </g>
  </svg>
);

export const ThreeDSyllabusIllustration: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_12px_24px_rgba(16,185,129,0.25)] ${className}`}
  >
    <defs>
      <radialGradient id="sylBgGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="bookCoverGrad" x1="20" y1="40" x2="140" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10b981" />
        <stop offset="0.6" stopColor="#059669" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="pageGradL" x1="30" y1="45" x2="78" y2="125" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="pageGradR" x1="82" y1="45" x2="130" y2="125" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="75" y1="30" x2="90" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* Glow */}
    <circle cx="80" cy="80" r="70" fill="url(#sylBgGlow)" />

    {/* Open Book Outer Cover */}
    <path
      d="M20 120C45 110 75 116 80 128C85 116 115 110 140 120V46C115 36 85 42 80 54C75 42 45 36 20 46V120Z"
      fill="url(#bookCoverGrad)"
    />

    {/* Left Page Thick Stack */}
    <path
      d="M24 116C46 107 74 112 78 123V49C74 38 46 33 24 42V116Z"
      fill="url(#pageGradL)"
    />
    {/* Left Page Text Lines & Chapters */}
    <rect x="34" y="56" width="32" height="4" rx="2" fill="#059669" />
    <rect x="34" y="65" width="36" height="3" rx="1.5" fill="#94a3b8" />
    <rect x="34" y="73" width="30" height="3" rx="1.5" fill="#cbd5e1" />
    <rect x="34" y="81" width="34" height="3" rx="1.5" fill="#cbd5e1" />
    <rect x="34" y="93" width="28" height="4" rx="2" fill="#059669" />
    <rect x="34" y="102" width="36" height="3" rx="1.5" fill="#cbd5e1" />

    {/* Right Page Thick Stack */}
    <path
      d="M136 116C114 107 86 112 82 123V49C86 38 114 33 136 42V116Z"
      fill="url(#pageGradR)"
    />
    {/* Right Page Topic Badges */}
    <rect x="90" y="56" width="34" height="4" rx="2" fill="#059669" />
    <rect x="90" y="65" width="36" height="3" rx="1.5" fill="#cbd5e1" />
    <circle cx="94" cy="78" r="3" fill="#10b981" />
    <rect x="100" y="76" width="26" height="3" rx="1.5" fill="#94a3b8" />
    <circle cx="94" cy="88" r="3" fill="#10b981" />
    <rect x="100" y="86" width="24" height="3" rx="1.5" fill="#94a3b8" />
    <circle cx="94" cy="98" r="3" fill="#10b981" />
    <rect x="100" y="96" width="28" height="3" rx="1.5" fill="#94a3b8" />

    {/* Golden Bookmark Ribbon Hanging Out */}
    <path
      d="M77 40V136L82 130L87 136V40H77Z"
      fill="url(#ribbonGrad)"
    />

    {/* 3D Floating Graduation Cap */}
    <g transform="translate(100, 16) scale(0.8)">
      <polygon points="35,10 65,22 35,34 5,22" fill="#1e293b" />
      <polygon points="35,12 60,22 35,31 10,22" fill="#334155" />
      <path d="M20 28V42C20 48 50 48 50 42V28" fill="#1e293b" />
      {/* Tassel */}
      <circle cx="35" cy="22" r="3" fill="#f59e0b" />
      <path d="M35 22L52 35V45" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const ThreeDNotesIllustration: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_12px_24px_rgba(245,158,11,0.25)] ${className}`}
  >
    <defs>
      <radialGradient id="notesBgGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="spiralBook" x1="30" y1="30" x2="130" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="0.6" stopColor="#d97706" />
        <stop offset="1" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="bulbGrad" x1="85" y1="15" x2="135" y2="65" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.4" stopColor="#fde047" />
        <stop offset="1" stopColor="#eab308" />
      </linearGradient>
    </defs>

    {/* Glow */}
    <circle cx="80" cy="80" r="70" fill="url(#notesBgGlow)" />

    {/* Spiral Notebook Base */}
    <rect x="36" y="28" width="94" height="116" rx="16" fill="url(#spiralBook)" />
    {/* Page insert */}
    <rect x="44" y="36" width="80" height="100" rx="10" fill="#ffffff" />
    
    {/* Spiral Binder Rings */}
    {[42, 58, 74, 90, 106, 122].map((y, idx) => (
      <g key={idx}>
        <rect x="30" y={y} width="16" height="6" rx="3" fill="#64748b" />
        <rect x="32" y={y + 1} width="12" height="2" rx="1" fill="#cbd5e1" />
      </g>
    ))}

    {/* Notes Content */}
    <rect x="54" y="48" width="48" height="5" rx="2.5" fill="#f59e0b" />
    <rect x="54" y="58" width="62" height="3.5" rx="1.5" fill="#94a3b8" />
    <rect x="54" y="66" width="58" height="3.5" rx="1.5" fill="#cbd5e1" />

    {/* Formula Box Highlight */}
    <rect x="52" y="78" width="64" height="26" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
    <text x="58" y="95" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#b45309">
      E = mc² • F=ma
    </text>

    {/* Key Takeaway check */}
    <circle cx="58" cy="116" r="4" fill="#10b981" />
    <path d="M56 116L57.5 117.5L60 114.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="66" y="114" width="46" height="3.5" rx="1.5" fill="#64748b" />

    <circle cx="58" cy="126" r="4" fill="#10b981" />
    <path d="M56 126L57.5 127.5L60 124.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="66" y="124" width="40" height="3.5" rx="1.5" fill="#64748b" />

    {/* Floating 3D Glowing Idea Lightbulb */}
    <g transform="translate(102, 10) scale(0.9)">
      <circle cx="25" cy="25" r="22" fill="url(#bulbGrad)" filter="drop-shadow(0 6px 12px rgba(234,179,8,0.4))" />
      <circle cx="21" cy="18" r="4" fill="#ffffff" fillOpacity="0.8" />
      <path d="M19 40H31V45C31 46.5 29.5 48 28 48H22C20.5 48 19 46.5 19 45V40Z" fill="#71717a" />
      <rect x="21" y="42" width="8" height="2" rx="1" fill="#a1a1aa" />
      <path d="M22 24C22 21 24 19 25 19C26 19 28 21 28 24V28H22V24Z" stroke="#854d0e" strokeWidth="2" />
    </g>
  </svg>
);

export const ThreeDCloudPushIllustration: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_12px_24px_rgba(30,41,59,0.2)] ${className}`}
  >
    <defs>
      <radialGradient id="cloudGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cloudBody" x1="20" y1="50" x2="140" y2="130" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="0.6" stopColor="#f0f9ff" />
        <stop offset="1" stopColor="#e0f2fe" />
      </linearGradient>
      <linearGradient id="rocketGrad" x1="80" y1="20" x2="130" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ef4444" />
        <stop offset="1" stopColor="#dc2626" />
      </linearGradient>
      <linearGradient id="flameGrad" x1="75" y1="70" x2="85" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fbbf24" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Glow */}
    <circle cx="80" cy="80" r="70" fill="url(#cloudGlow)" />

    {/* 3D Fluffy Cloud Base */}
    <g filter="drop-shadow(0 10px 18px rgba(14,165,233,0.2))">
      <path
        d="M45 125H118C132 125 143 114 143 100C143 87 133 76 120 75C118 55 102 40 82 40C66 40 52 50 46 64C33 66 23 77 23 91C23 109 32 125 45 125Z"
        fill="url(#cloudBody)"
      />
      {/* Cloud Top Specular Highlight */}
      <path
        d="M82 43C99 43 113 56 116 73C117 76 120 77 122 77C133 78 140 87 140 98C140 100 139 102 138 104C137 92 128 82 116 80C113 79 111 77 111 74C108 59 95 48 80 48C67 48 56 56 51 68C49 71 46 72 43 72C33 74 26 82 26 92C26 90 26 89 26 88C26 77 34 68 45 66C50 53 65 43 82 43Z"
        fill="#ffffff"
        fillOpacity="0.9"
      />
    </g>

    {/* JSON Code Symbol on Cloud */}
    <rect x="52" y="85" width="56" height="24" rx="8" fill="#0f172a" />
    <text x="60" y="101" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#38bdf8">
      {'{ JSON }'}
    </text>

    {/* 3D Launching Rocket */}
    <g transform="translate(42, -5) rotate(32 80 50)">
      {/* Rocket Flame */}
      <path d="M76 68L80 88L84 68H76Z" fill="url(#flameGrad)" />
      <path d="M78 68L80 80L82 68H78Z" fill="#ffffff" />
      {/* Rocket Fins */}
      <polygon points="70,55 74,68 76,68 76,55" fill="#3b82f6" />
      <polygon points="90,55 86,68 84,68 84,55" fill="#3b82f6" />
      {/* Rocket Main Body */}
      <path d="M74 40C74 26 80 18 80 18C80 18 86 26 86 40V66H74V40Z" fill="url(#rocketGrad)" />
      {/* Porthole */}
      <circle cx="80" cy="38" r="4.5" fill="#ffffff" />
      <circle cx="80" cy="38" r="3" fill="#0284c7" />
    </g>

    {/* GitHub Octocat Badge */}
    <circle cx="120" cy="40" r="14" fill="#24292f" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))" />
    <path
      d="M120 29C114 29 109 34 109 40C109 45 112.5 49 117 50.5C117.5 50.6 117.7 50.3 117.7 50V48.5C114.5 49.2 113.8 47 113.8 47C113.3 45.7 112.5 45.4 112.5 45.4C111.5 44.7 112.6 44.7 112.6 44.7C113.7 44.8 114.3 45.8 114.3 45.8C115.3 47.5 116.9 47 117.5 46.7C117.6 46 117.9 45.5 118.2 45.2C115.6 44.9 112.9 43.9 112.9 39.4C112.9 38.1 113.4 37 114.2 36.2C114.1 35.9 113.7 34.6 114.3 33C114.3 33 115.3 32.7 117.6 34.3C118.6 34 119.6 33.9 120.6 33.9C121.6 33.9 122.6 34 123.6 34.3C125.9 32.7 126.9 33 126.9 33C127.5 34.6 127.1 35.9 127 36.2C127.8 37 128.3 38.1 128.3 39.4C128.3 43.9 125.6 44.9 123 45.2C123.4 45.5 123.7 46.2 123.7 47.3V50C123.7 50.3 123.9 50.6 124.4 50.5C128.9 49 132.4 45 132.4 40C132.4 34 126.8 29 120 29Z"
      fill="#ffffff"
    />
  </svg>
);
