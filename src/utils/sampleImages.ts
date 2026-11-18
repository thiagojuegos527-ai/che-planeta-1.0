// Preloaded sample images encoded as realistic SVG data URLs for instant testing without camera
export interface SampleObject {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  icon: string;
  dataUrl: string;
  userHint?: string;
}

function createSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const SAMPLE_OBJECTS: SampleObject[] = [
  {
    id: "pet-bottle",
    name: "Botella PET",
    subtitle: "Plástico descartable",
    category: "Plásticos",
    icon: "🍾",
    userHint: "Botella plástica transparente de agua mineral de 500ml",
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E0F2FE" />
            <stop offset="100%" stop-color="#BAE6FD" />
          </linearGradient>
          <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#67E8F9" stop-opacity="0.8" />
            <stop offset="40%" stop-color="#CFFAFE" stop-opacity="0.9" />
            <stop offset="60%" stop-color="#A5F3FC" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.8" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0284C7" />
            <stop offset="100%" stop-color="#0369A1" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#bgGrad)" rx="24" />
        <ellipse cx="200" cy="350" rx="90" ry="16" fill="#94A3B8" opacity="0.4" />
        <!-- Cap -->
        <rect x="175" y="45" width="50" height="24" rx="4" fill="url(#capGrad)" />
        <line x1="180" y1="52" x2="220" y2="52" stroke="#BAE6FD" stroke-width="2" />
        <!-- Neck -->
        <rect x="182" y="69" width="36" height="35" fill="url(#bottleGrad)" stroke="#0284C7" stroke-width="1.5" />
        <path d="M182 104 Q160 140 145 165 L145 330 Q145 345 200 345 Q255 345 255 330 L255 165 Q240 140 218 104 Z" fill="url(#bottleGrad)" stroke="#0284C7" stroke-width="2" />
        <!-- Label -->
        <rect x="145" y="200" width="110" height="55" fill="#10B981" rx="4" opacity="0.9" />
        <text x="200" y="234" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">AGUA PURA</text>
        <!-- PET Recycle Symbol -->
        <polygon points="190,285 210,285 200,270" fill="none" stroke="#0284C7" stroke-width="2" />
        <text x="200" y="283" font-family="sans-serif" font-size="9" font-weight="bold" fill="#0284C7" text-anchor="middle">♳ 1</text>
      </svg>
    `)
  },
  {
    id: "aluminum-can",
    name: "Lata de Aluminio",
    subtitle: "Gaseosa o bebida",
    category: "Metales",
    icon: "🥫",
    userHint: "Lata de aluminio de bebida carbonatada 354ml",
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="bgCan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FEF3C7" />
            <stop offset="100%" stop-color="#FDE68A" />
          </linearGradient>
          <linearGradient id="metalBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#EF4444" />
            <stop offset="35%" stop-color="#F87171" />
            <stop offset="65%" stop-color="#DC2626" />
            <stop offset="100%" stop-color="#B91C1C" />
          </linearGradient>
          <linearGradient id="silverRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#CBD5E1" />
            <stop offset="50%" stop-color="#F8FAFC" />
            <stop offset="100%" stop-color="#94A3B8" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#bgCan)" rx="24" />
        <ellipse cx="200" cy="345" rx="80" ry="16" fill="#D97706" opacity="0.3" />
        <!-- Top Rim -->
        <ellipse cx="200" cy="95" rx="60" ry="14" fill="url(#silverRim)" stroke="#64748B" stroke-width="2" />
        <!-- Pull tab -->
        <ellipse cx="200" cy="93" rx="18" ry="7" fill="none" stroke="#475569" stroke-width="3" />
        <!-- Can Body -->
        <path d="M140 100 Q145 120 142 135 L142 300 Q142 320 200 320 Q258 320 258 300 L258 135 Q255 120 260 100 Z" fill="url(#metalBody)" stroke="#991B1B" stroke-width="2" />
        <!-- Dynamic Wave Graphic -->
        <path d="M142 190 Q200 160 258 200 L258 240 Q200 200 142 230 Z" fill="#FFFFFF" opacity="0.85" />
        <text x="200" y="275" font-family="sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">COLA FRESH</text>
        <!-- Bottom Rim -->
        <path d="M146 305 Q200 325 254 305" stroke="url(#silverRim)" stroke-width="6" fill="none" />
        <text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="12" fill="#78350F" text-anchor="middle">ALUMINIO 100% RECICLABLE</text>
      </svg>
    `)
  },
  {
    id: "cardboard-box",
    name: "Caja de Cartón",
    subtitle: "Embalaje o delivery",
    category: "Papel y Cartón",
    icon: "📦",
    userHint: "Caja de cartón corrugado marrón limpia de encomienda",
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="#F0FDF4" rx="24" />
        <ellipse cx="200" cy="340" rx="110" ry="18" fill="#15803D" opacity="0.2" />
        <!-- 3D Box Top & Sides -->
        <polygon points="200,80 320,135 200,190 80,135" fill="#D97706" stroke="#92400E" stroke-width="3" />
        <polygon points="80,135 200,190 200,310 80,250" fill="#B45309" stroke="#78350F" stroke-width="3" />
        <polygon points="200,190 320,135 320,250 200,310" fill="#92400E" stroke="#78350F" stroke-width="3" />
        <!-- Flaps tape -->
        <line x1="140" y1="108" x2="260" y2="162" stroke="#78350F" stroke-width="6" stroke-dasharray="8 4" opacity="0.8" />
        <!-- Eco Label on Box -->
        <rect x="100" y="195" width="55" height="35" rx="4" fill="#FEF3C7" transform="skewY(22)" />
        <text x="125" y="215" font-family="sans-serif" font-weight="bold" font-size="12" fill="#B45309" transform="skewY(22)" text-anchor="middle">♻ BIO</text>
      </svg>
    `)
  },
  {
    id: "glass-jar",
    name: "Frasco de Vidrio",
    subtitle: "Mermelada o conserva",
    category: "Vidrio",
    icon: "🫙",
    userHint: "Frasco de vidrio transparente con tapa metálica dorada",
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="#F8FAFC" rx="24" />
        <ellipse cx="200" cy="345" rx="75" ry="14" fill="#64748B" opacity="0.2" />
        <!-- Golden Metal Lid -->
        <rect x="145" y="80" width="110" height="28" rx="6" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
        <line x1="150" y1="88" x2="250" y2="88" stroke="#FDE68A" stroke-width="3" />
        <!-- Glass Jar Body -->
        <path d="M150 110 L250 110 L260 140 L260 305 Q260 330 200 330 Q140 330 140 305 L140 140 Z" fill="#E2E8F0" fill-opacity="0.5" stroke="#94A3B8" stroke-width="3" />
        <!-- Glass Reflection -->
        <path d="M155 145 L155 295" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.8" />
        <path d="M170 160 L170 270" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.5" />
        <!-- Jam Label -->
        <rect x="165" y="180" width="70" height="60" rx="4" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5" />
        <circle cx="200" cy="202" r="10" fill="#EF4444" />
        <text x="200" y="228" font-family="sans-serif" font-size="10" font-weight="bold" fill="#991B1B" text-anchor="middle">MERMELADA</text>
      </svg>
    `)
  },
  {
    id: "battery",
    name: "Pila Alcalina AA",
    subtitle: "Residuo peligroso",
    category: "Residuo Especial",
    icon: "🔋",
    userHint: "Pila alcalina cilíndrica AA agotada",
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="#FFF1F2" rx="24" />
        <ellipse cx="200" cy="340" rx="60" ry="14" fill="#BE123C" opacity="0.2" />
        <!-- Terminal Nub -->
        <rect x="185" y="70" width="30" height="15" rx="3" fill="#E2E8F0" stroke="#64748B" stroke-width="2" />
        <!-- Top Metallic Band -->
        <rect x="150" y="85" width="100" height="50" fill="#CA8A04" stroke="#854D0E" stroke-width="2" />
        <text x="200" y="115" font-family="sans-serif" font-weight="bold" font-size="16" fill="#FEF08A" text-anchor="middle">+</text>
        <!-- Black Body -->
        <rect x="150" y="135" width="100" height="165" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
        <text x="200" y="210" font-family="sans-serif" font-weight="bold" font-size="22" fill="#E2E8F0" text-anchor="middle" letter-spacing="3">AA</text>
        <text x="200" y="240" font-family="sans-serif" font-weight="600" font-size="11" fill="#E11D48" text-anchor="middle">⚠ NO TIRAR EN LA BASURA</text>
        <!-- Bottom Base -->
        <rect x="150" y="300" width="100" height="20" rx="3" fill="#94A3B8" stroke="#475569" stroke-width="2" />
      </svg>
    `)
  },
  {
    id: "coffee-pod",
    name: "Cápsula de Café",
    subtitle: "Aluminio / plástico mixto",
    category: "Envases Monodosis",
    icon: "☕",
    userHint: "Cápsula de café monodosis usada de aluminio con café húmedo en su interior",
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="#FAF5FF" rx="24" />
        <ellipse cx="200" cy="335" rx="80" ry="14" fill="#7E22CE" opacity="0.2" />
        <!-- Flange rim -->
        <ellipse cx="200" cy="140" rx="90" ry="22" fill="#A855F7" stroke="#6B21A8" stroke-width="3" />
        <!-- Pod Body Tapering Down -->
        <path d="M130 148 L155 300 Q200 320 245 300 L270 148 Z" fill="#9333EA" stroke="#581C87" stroke-width="3" />
        <!-- Foil Lid Surface -->
        <ellipse cx="200" cy="138" rx="84" ry="18" fill="#E9D5FF" />
        <!-- Punctured holes illustration -->
        <circle cx="185" cy="135" r="4" fill="#3B0764" />
        <circle cx="215" cy="138" r="4" fill="#3B0764" />
        <circle cx="200" cy="142" r="3" fill="#3B0764" />
        <!-- Coffee Bean Graphic on body -->
        <circle cx="200" cy="225" r="18" fill="#581C87" />
        <path d="M192 215 Q200 225 208 235" stroke="#E9D5FF" stroke-width="3" stroke-linecap="round" fill="none" />
      </svg>
    `)
  }
];
