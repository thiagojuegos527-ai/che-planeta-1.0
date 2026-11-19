import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface OnboardingSliderProps {
  onComplete: () => void;
  username?: string;
}

interface SlideConfig {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlights: { icon: string; text: string }[];
  accentBg: string;
  illustration: React.ReactNode;
}

export const OnboardingSlider: React.FC<OnboardingSliderProps> = ({
  onComplete,
  username,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const slides: SlideConfig[] = [
    {
      id: 'ai-scanner',
      badge: '1 de 3 • Escáner Inteligente',
      title: 'Escaneá objetos con IA',
      description:
        'Sacale una foto a cualquier envase o residuo. Nuestra inteligencia artificial identifica el material, te sugiere ideas creativas DIY y te muestra su impacto ambiental.',
      highlights: [
        { icon: '📸', text: 'Identificación visual instantánea' },
        { icon: '💡', text: 'Ideas de manualidades y upcycling' },
        { icon: '🌍', text: 'Datos verificados de degradación' },
      ],
      accentBg: 'from-emerald-100/70 via-teal-50 to-sky-100/70',
      illustration: (
        <svg viewBox="0 0 260 210" className="w-60 h-48 mx-auto drop-shadow-sm">
          {/* Soft ambient circle */}
          <circle cx="130" cy="105" r="88" fill="#D1FAE5" opacity="0.7" />
          <circle cx="130" cy="105" r="70" fill="#BAE6FD" opacity="0.45" />

          {/* Floating eco sparkles */}
          <circle cx="52" cy="52" r="5" fill="#10B981" opacity="0.6" />
          <circle cx="212" cy="48" r="7" fill="#38BDF8" opacity="0.7" />
          <circle cx="204" cy="158" r="4" fill="#F59E0B" opacity="0.7" />

          {/* Smartphone frame */}
          <rect
            x="80"
            y="24"
            width="100"
            height="162"
            rx="20"
            fill="#FFFFFF"
            stroke="#065F46"
            strokeWidth="4"
          />
          {/* Screen */}
          <rect x="88" y="36" width="84" height="126" rx="12" fill="#F0FDF4" />
          {/* Top speaker notch */}
          <rect x="116" y="28" width="28" height="4" rx="2" fill="#065F46" opacity="0.3" />

          {/* Cute PET bottle inside viewfinder */}
          <rect x="122" y="62" width="16" height="8" rx="2" fill="#0284C7" />
          <path
            d="M118 74 L142 74 L148 92 L148 134 Q148 140 130 140 Q112 140 112 134 L112 92 Z"
            fill="#7DD3FC"
            stroke="#0284C7"
            strokeWidth="2.5"
          />
          <rect x="112" y="102" width="36" height="18" fill="#10B981" opacity="0.9" />
          <circle cx="123" cy="92" r="2.2" fill="#064E3B" />
          <circle cx="137" cy="92" r="2.2" fill="#064E3B" />
          <path
            d="M126 96 Q130 100 134 96"
            stroke="#064E3B"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Scanner corner brackets */}
          <path d="M98 62 L98 52 L108 52" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M162 62 L162 52 L152 52" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M98 140 L98 150 L108 150" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M162 140 L162 150 L152 150" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Glowing laser scan line */}
          <line x1="96" y1="100" x2="164" y2="100" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />

          {/* Shutter button */}
          <circle cx="130" cy="173" r="6" fill="#10B981" />

          {/* Friendly floating leaf badge */}
          <g transform="translate(172, 74)">
            <circle cx="18" cy="18" r="18" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
            <path
              d="M12 24 Q12 12 25 10 Q24 23 12 24 Z"
              fill="#10B981"
            />
            <path d="M12 24 L20 15" stroke="#ECFDF5" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>
      ),
    },
    {
      id: 'san-luis-points',
      badge: '2 de 3 • San Luis Capital',
      title: 'Puntos Verdes de San Luis',
      description:
        'Consultá en qué contenedor separar cada material y ubicá los Puntos Verdes y CAV municipales reales de San Luis Capital para reciclar sin dudas.',
      highlights: [
        { icon: '📍', text: 'CAV Domeniconi, Rawson, Jardín San Luis y más' },
        { icon: '🌳', text: 'Punto Verde Parque de las Naciones' },
        { icon: '♻️', text: 'Horarios y materiales aceptados confirmados' },
      ],
      accentBg: 'from-sky-100/70 via-emerald-50 to-teal-100/60',
      illustration: (
        <svg viewBox="0 0 260 210" className="w-60 h-48 mx-auto drop-shadow-sm">
          {/* Sky & Sun */}
          <circle cx="130" cy="105" r="88" fill="#E0F2FE" opacity="0.85" />
          <circle cx="195" cy="52" r="18" fill="#FDE68A" />
          <circle cx="195" cy="52" r="12" fill="#FBBF24" />

          {/* Stylized Sierras de San Luis in background */}
          <path
            d="M42 145 Q78 82 115 128 Q152 74 195 125 Q210 112 222 145 Z"
            fill="#6EE7B7"
            opacity="0.75"
          />
          <path
            d="M52 150 Q92 98 134 136 Q172 95 212 150 Z"
            fill="#10B981"
            opacity="0.65"
          />

          {/* Rolling green ground */}
          <ellipse cx="130" cy="155" rx="84" ry="26" fill="#34D399" />
          <ellipse cx="130" cy="158" rx="72" ry="18" fill="#10B981" />

          {/* Winding Path */}
          <path
            d="M105 174 Q126 156 132 142"
            stroke="#FEF3C7"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />

          {/* Little Trees */}
          <g transform="translate(65, 112)">
            <rect x="10" y="22" width="5" height="14" rx="2" fill="#78350F" />
            <circle cx="12.5" cy="16" r="14" fill="#059669" />
            <circle cx="9" cy="12" r="6" fill="#34D399" opacity="0.6" />
          </g>
          <g transform="translate(174, 116)">
            <rect x="8" y="18" width="4" height="12" rx="2" fill="#78350F" />
            <circle cx="10" cy="14" r="11" fill="#047857" />
          </g>

          {/* Big Friendly Eco Map Pin */}
          <g transform="translate(96, 42)">
            <path
              d="M34 4 C16 4 4 17 4 34 C4 56 34 86 34 86 C34 86 64 56 64 34 C64 17 52 4 34 4 Z"
              fill="#059669"
              stroke="#FFFFFF"
              strokeWidth="4"
            />
            <circle cx="34" cy="34" r="18" fill="#FFFFFF" />
            {/* Recycle / Leaf emblem inside pin */}
            <path
              d="M27 40 Q27 26 42 25 Q41 39 27 40 Z"
              fill="#10B981"
            />
            <path d="M27 40 L36 31" stroke="#ECFDF5" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Little San Luis city label pill */}
          <rect x="82" y="162" width="96" height="22" rx="11" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
          <text
            x="130"
            y="177"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#065F46"
            fontFamily="sans-serif"
          >
            San Luis Capital
          </text>
        </svg>
      ),
    },
    {
      id: 'cozy-pet',
      badge: '3 de 3 • Tu Compañero Ecológico',
      title: 'Cuidá a tu mascota planetaria',
      description:
        'Cada acción real suma experiencia y Puntos Verdes. Mimá a tu planeta, equipale accesorios tiernos, decorá su espacio y miralo evolucionar con vos.',
      highlights: [
        { icon: '🌱', text: '4 etapas de evolución al subir de nivel' },
        { icon: '👒', text: 'Accesorios y colores desbloqueables' },
        { icon: '🔥', text: 'Racha diaria amigable con pausas y escudos' },
      ],
      accentBg: 'from-amber-100/60 via-emerald-50 to-sky-100/70',
      illustration: (
        <svg viewBox="0 0 260 210" className="w-60 h-48 mx-auto drop-shadow-sm">
          {/* Soft Cozy Aura */}
          <circle cx="130" cy="110" r="88" fill="#FEF3C7" opacity="0.7" />
          <circle
            cx="130"
            cy="110"
            r="74"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeDasharray="7 6"
            opacity="0.5"
          />

          {/* Orbiting Butterflies & Hearts */}
          <text x="50" y="72" fontSize="22">🦋</text>
          <text x="190" y="75" fontSize="20">✨</text>
          <text x="58" y="164" fontSize="18">🌸</text>
          <text x="188" y="162" fontSize="20">💚</text>

          {/* Cute Planet Body */}
          <circle
            cx="130"
            cy="112"
            r="52"
            fill="#38BDF8"
            stroke="#FFFFFF"
            strokeWidth="5"
          />
          {/* Continents */}
          <path
            d="M84 95 Q102 74 122 86 Q134 96 116 112 Q95 118 84 95 Z"
            fill="#10B981"
          />
          <path
            d="M138 118 Q160 105 176 122 Q170 152 142 156 Q128 144 138 118 Z"
            fill="#10B981"
          />
          <circle cx="152" cy="84" r="11" fill="#10B981" opacity="0.85" />

          {/* Sprout on top of head */}
          <path d="M130 60 Q130 42 130 40" stroke="#065F46" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M130 44 Q115 32 112 45 Q118 53 130 46 Z" fill="#34D399" stroke="#065F46" strokeWidth="1.5" />
          <path d="M130 43 Q146 30 148 44 Q142 52 130 46 Z" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />

          {/* Cute Eyes & Blush */}
          <circle cx="114" cy="108" r="5" fill="#1F2937" />
          <circle cx="112.5" cy="106.5" r="1.8" fill="#FFFFFF" />
          <circle cx="146" cy="108" r="5" fill="#1F2937" />
          <circle cx="144.5" cy="106.5" r="1.8" fill="#FFFFFF" />

          <ellipse cx="105" cy="117" rx="6" ry="3" fill="#FB7185" opacity="0.7" />
          <ellipse cx="155" cy="117" rx="6" ry="3" fill="#FB7185" opacity="0.7" />

          {/* Happy Smile */}
          <path
            d="M123 117 Q130 124 137 117"
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* XP Level Pill below pet */}
          <rect x="86" y="170" width="88" height="22" rx="11" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
          <text
            x="130"
            y="185"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#065F46"
            fontFamily="sans-serif"
          >
            Nivel 1 • +XP 🌱
          </text>
        </svg>
      ),
    },
  ];

  const isLastSlide = currentSlide === slides.length - 1;
  const activeSlide = slides[currentSlide];

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45 && !isLastSlide) {
      setCurrentSlide((prev) => prev + 1);
    } else if (diff < -45 && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="min-h-screen bg-[#FBF9F3] text-stone-900 flex flex-col justify-between px-4 py-5 relative overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative soft atmosphere blobs */}
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-64 h-64 rounded-full bg-sky-200/35 blur-3xl pointer-events-none" />

      {/* Top Bar: Official Logo + Skip */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white p-0.5 shadow-sm border border-emerald-900/10 flex items-center justify-center overflow-hidden">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_12.43.19_PM_8a61524e.jpeg"
              alt="Che Planeta"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-heading font-extrabold text-base text-emerald-950 block leading-tight">
              Che<span className="text-emerald-600">Planeta</span>
            </span>
            {username && (
              <span className="text-[11px] font-medium text-stone-600 block">
                ¡Hola, {username}!
              </span>
            )}
          </div>
        </div>

        {!isLastSlide && (
          <button
            type="button"
            onClick={onComplete}
            className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-stone-100 border border-stone-200 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            Omitir
          </button>
        )}
      </div>

      {/* Center Slide Card */}
      <div className="max-w-md w-full mx-auto my-auto py-4 relative z-10">
        <div
          key={activeSlide.id}
          className="rounded-3xl bg-white border border-emerald-900/10 shadow-md overflow-hidden animate-in fade-in duration-300"
        >
          {/* Illustration Stage */}
          <div
            className={`p-5 bg-gradient-to-br ${activeSlide.accentBg} border-b border-emerald-900/10 flex flex-col items-center`}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs mb-2">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{activeSlide.badge}</span>
            </span>

            {activeSlide.illustration}
          </div>

          {/* Slide Text Content */}
          <div className="p-5 text-center">
            <h2 className="font-heading font-extrabold text-2xl text-stone-900 tracking-tight leading-tight">
              {activeSlide.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {activeSlide.description}
            </p>

            {/* Friendly Feature Highlights */}
            <div className="mt-4 space-y-2 text-left">
              {activeSlide.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FBF9F3] border border-emerald-900/10"
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className="text-xs font-semibold text-stone-800">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dots & Navigation Controls */}
      <div className="max-w-md w-full mx-auto space-y-4 relative z-10">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Ir a paso ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-emerald-600'
                  : 'w-2.5 bg-emerald-200 hover:bg-emerald-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2.5">
          {currentSlide > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-heading font-bold text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-heading font-bold text-base shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLastSlide ? (
              <>
                <Check className="w-5 h-5" />
                <span>Comenzar</span>
              </>
            ) : (
              <>
                <span>Siguiente</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
