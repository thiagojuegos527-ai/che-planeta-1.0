import React, { useEffect, useState } from 'react';
import { Sparkles, Globe2, Leaf, Cpu } from 'lucide-react';

interface AnalyzingScreenProps {
  capturedImage: string;
}

const ANALYSIS_STEPS = [
  { text: 'Preparando el modelo visual en este dispositivo...', progress: 18 },
  { text: 'Comparando formas y características del objeto...', progress: 42 },
  { text: 'Buscando coincidencias entre materiales comunes...', progress: 68 },
  { text: 'Preparando recomendaciones de separación...', progress: 88 },
  { text: 'Finalizando el reconocimiento local...', progress: 96 },
];

const ECO_TRIVIA = [
  "¿Sabías que una botella plástica puede tardar hasta 500 años en descomponerse en la naturaleza?",
  "¡El vidrio se puede reciclar infinidad de veces sin perder nunca su calidad o transparencia!",
  "Reciclar una tonelada de papel salva 17 árboles adultos y ahorra más de 26.000 litros de agua.",
  "Las colillas de cigarrillo contienen acetato de celulosa y pueden contaminar hasta 50 litros de agua cada una."
];

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({ capturedImage }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    const triviaInterval = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % ECO_TRIVIA.length);
    }, 4500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(triviaInterval);
    };
  }, []);

  const currentStep = ANALYSIS_STEPS[stepIndex];

  return (
    <div className="min-h-[82vh] max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-between">
      {/* Top Header Badge */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs">
          <Cpu className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>Reconocimiento local · sin Gemini</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-stone-900 mt-2">
          Descifrando el objeto
        </h2>
        <p className="text-xs text-stone-600 mt-0.5">
          La foto se analiza en tu dispositivo
        </p>
      </div>

      {/* Central Visual: Photo preview with laser scan & planet radar ripple */}
      <div className="relative my-6 flex items-center justify-center">
        {/* Radar Waves / Ripple rings */}
        <div className="absolute w-64 h-64 rounded-full border-2 border-emerald-400/40 animate-radar-ripple pointer-events-none" />
        <div className="absolute w-52 h-52 rounded-full border-2 border-sky-400/40 animate-radar-ripple pointer-events-none" style={{ animationDelay: '0.9s' }} />

        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-3xl bg-emerald-300/30 blur-2xl pointer-events-none" />

        {/* Photo Card with Scanning Beam */}
        <div className="relative w-56 h-56 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-stone-950 flex items-center justify-center">
          <img
            src={capturedImage}
            alt="Objeto en escaneo"
            className="w-full h-full object-cover opacity-85 scale-105"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-emerald-950/40" />

          {/* High-tech Scanning Laser Beam */}
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-sky-300 to-emerald-400 shadow-[0_0_15px_#34D399] animate-scan-laser z-10" />

          {/* Center Holographic Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg animate-pulse">
              <Globe2 className="w-8 h-8 text-white drop-shadow-md" />
            </div>
            <span className="mt-2 text-[11px] font-extrabold text-white tracking-widest uppercase bg-black/50 px-2.5 py-0.5 rounded-full border border-white/20">
              Escaneo en curso
            </span>
          </div>
        </div>
      </div>

      {/* Status Progress & Messages */}
      <div className="w-full space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <span className="text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {currentStep.text}
            </span>
            <span className="text-emerald-700 font-extrabold">
              {currentStep.progress}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden p-0.5 border border-emerald-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${currentStep.progress}%` }}
            />
          </div>
        </div>

        {/* Rotating Trivia Card */}
        <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-200/80 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-900">
              ¿Sabías esto?
            </p>
            <p className="text-xs text-stone-700 mt-0.5 transition-all leading-relaxed">
              {ECO_TRIVIA[triviaIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
