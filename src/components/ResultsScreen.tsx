import React, { useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Lightbulb,
  Trash2,
  Globe2,
  BookOpen,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Leaf,
  Layers,
  Award
} from 'lucide-react';
import { EcoAnalysisResult, DiyIdea } from '../types/chePlaneta';
import { RecycleMapModal } from './RecycleMapModal';

interface ResultsScreenProps {
  result: EcoAnalysisResult;
  onScanAnother: () => void;
  onSaveToHistory: (result: EcoAnalysisResult) => void;
  isSaved: boolean;
}

type TabType = 'diy' | 'disposal' | 'impact' | 'sources';

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  onScanAnother,
  onSaveToHistory,
  isSaved
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('diy');
  const [showMapModal, setShowMapModal] = useState(false);
  const [expandedDiyId, setExpandedDiyId] = useState<string | null>(
    result.diyIdeas?.[0]?.id || null
  );
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});
  const [copiedShare, setCopiedShare] = useState(false);

  const toggleMaterialCheck = (mat: string) => {
    setCheckedMaterials((prev) => ({
      ...prev,
      [mat]: !prev[mat],
    }));
  };

  const handleShare = async () => {
    const textToShare = `¡Chequeá lo que aprendí con Che Planeta sobre "${result.objectName}"! Material: ${result.probableMaterial}. Tarda ${result.environmentalImpact.yearsToDegrade} en degradarse. ¡Reutilizalo o reciclalo!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Che Planeta — ${result.objectName}`,
          text: textToShare,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    // Fallback: clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(textToShare);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Recyclability badge style calculation
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Altamente Reciclable':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Reciclable con Preparación':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Reutilizable / Upcycling':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Residuo Especial / Peligroso':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-200 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-2 pb-28">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onScanAnother}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-emerald-50 border border-emerald-900/10 text-stone-700 text-xs font-semibold transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-emerald-50 border border-emerald-900/10 flex items-center justify-center text-stone-700 hover:text-emerald-800 transition-colors shadow-xs relative"
            title="Compartir reporte"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -bottom-7 right-0 text-[10px] font-bold bg-stone-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-30">
                ¡Copiado!
              </span>
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onSaveToHistory(result)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-xs ${
              isSaved
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white/90 hover:bg-emerald-50 border-emerald-900/10 text-stone-700 hover:text-emerald-800'
            }`}
            title={isSaved ? 'Guardado en historial' : 'Guardar reporte'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Object Identification Card */}
      <div className="rounded-3xl bg-white border border-emerald-900/10 shadow-sm overflow-hidden mb-4">
        <div className="relative h-44 bg-stone-950 flex items-center justify-center overflow-hidden">
          <img
            src={result.imageUrl}
            alt={result.objectName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Recyclability Score Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-2xl border border-white/60 shadow-md flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-bold text-stone-500 leading-none">Eco Score</span>
              <span className="text-xs font-extrabold text-emerald-800 leading-none">{result.recyclabilityScore}/100</span>
            </div>
          </div>

          {/* Bottom Object Title on Image */}
          <div className="absolute bottom-3 inset-x-3 text-white">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md mb-1 border border-emerald-800/60 backdrop-blur-xs">
              {result.category}
            </span>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl leading-tight drop-shadow-sm">
              {result.objectName}
            </h1>
          </div>
        </div>

        {/* GAMIFIED ECO REWARD BANNER */}
        <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <div>
              <p className="text-xs font-bold text-stone-900 leading-tight">
                ¡Acción ecológica registrada!
              </p>
              <p className="text-[10px] text-emerald-800 font-semibold">
                +60 XP para tu planeta &bull; +35 EcoPuntos
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
            ¡Completado!
          </span>
        </div>

        {/* Identified Material & Recyclability Badge */}
        <div className="p-4 bg-white">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${getBadgeStyle(
                result.recyclabilityBadge
              )}`}
            >
              {result.recyclabilityBadge}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              {result.probableMaterial}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            {result.materialDetails}
          </p>
        </div>
      </div>

      {/* Che Consejo Card */}
      {result.cheConsejo && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-sm mb-4 relative overflow-hidden">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-xs tracking-wider uppercase text-emerald-100">
                El Che Consejo
              </p>
              <p className="text-xs text-white/95 mt-0.5 leading-relaxed font-medium">
                {result.cheConsejo}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs for the 4 Key Sections */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-200/60 mb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('diy')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'diy'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Ideas DIY</span>
        </button>

        <button
          onClick={() => setActiveTab('disposal')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'disposal'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dónde desecharlo</span>
        </button>

        <button
          onClick={() => setActiveTab('impact')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'impact'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Impacto ambiental</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'sources'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          title="Fuentes de verificación"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Fuentes</span>
        </button>
      </div>

      {/* SECTION 1: IDEAS PARA REUTILIZAR (DIY) */}
      {activeTab === 'diy' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Proyectos creativos de Upcycling</span>
            </h2>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {result.diyIdeas.length} proyectos
            </span>
          </div>

          {result.diyIdeas.map((idea) => {
            const isExpanded = expandedDiyId === idea.id;
            return (
              <div
                key={idea.id}
                className="rounded-2xl bg-white border border-stone-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedDiyId(isExpanded ? null : idea.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-stone-50/70 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        Dificultad: {idea.difficulty}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {idea.timeMinutes} min
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-stone-900 leading-snug">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">{idea.subtitle}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-stone-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-stone-100 space-y-3.5 bg-stone-50/40">
                    {/* Materials checklist */}
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                        Materiales necesarios (Tildá los que ya tenés):
                      </p>
                      <div className="space-y-1.5">
                        {idea.materialsNeeded.map((mat, i) => {
                          const isChecked = !!checkedMaterials[`${idea.id}-${i}`];
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => toggleMaterialCheck(`${idea.id}-${i}`)}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white border border-stone-200 text-left hover:border-emerald-300 transition-colors cursor-pointer"
                            >
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                  isChecked
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-stone-300 bg-stone-50'
                                }`}
                              >
                                {isChecked && <CheckCircle2 className="w-3 h-3" />}
                              </div>
                              <span
                                className={`text-xs ${
                                  isChecked ? 'line-through text-stone-400' : 'text-stone-700 font-medium'
                                }`}
                              >
                                {mat}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step-by-step instructions */}
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                        Paso a paso:
                      </p>
                      <div className="space-y-2">
                        {idea.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200/80"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-xs text-stone-700 leading-relaxed font-medium">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eco Benefit Banner */}
                    <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-950 flex items-start gap-2">
                      <Leaf className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                          Impacto Positivo
                        </span>
                        <p className="text-xs font-medium mt-0.5 leading-snug">
                          {idea.ecoBenefit}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 2: DÓNDE DESECHARLO */}
      {activeTab === 'disposal' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Container Color Card */}
          <div
            className="p-4 rounded-3xl text-white shadow-sm"
            style={{
              backgroundColor: result.disposalGuide.containerColorHex || '#10B981',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20 text-white/90">
                  Contenedor Correcto
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl mt-1.5 leading-tight">
                  {result.disposalGuide.containerName}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs text-white/90 mt-2 font-medium">
              Categoría para recuperadores: {result.disposalGuide.recyclingCategory}
            </p>
          </div>

          {/* Preparation steps */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <h3 className="font-heading font-bold text-sm text-stone-900 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instrucciones de preparación antes de tirar</span>
            </h3>
            <div className="space-y-2">
              {result.disposalGuide.preparationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                  <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings & Mistakes to avoid */}
          {result.disposalGuide.warnings && result.disposalGuide.warnings.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-xs">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>¡Ojo! Errores comunes a evitar</span>
              </h3>
              <ul className="space-y-1.5">
                {result.disposalGuide.warnings.map((warn, i) => (
                  <li key={i} className="text-xs text-stone-700 flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-600 font-bold">&bull;</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nearby Green Points Trigger Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300/80 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Puntos de reciclaje cercanos</span>
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Lugar recomendado: {result.disposalGuide.recyclingCenterType}. Consultá campanas verdes y cooperativas cerca de tu ubicación.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowMapModal(true)}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Ver mapa y horarios de Puntos Verdes</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: IMPACTO AMBIENTAL */}
      {activeTab === 'impact' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Highlight metric: Years to degrade */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-white shadow-md text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
              Tiempo estimado de degradación
            </span>
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-white my-1.5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300">
              {result.environmentalImpact.yearsToDegrade}
            </div>
            <p className="text-xs text-stone-300 max-w-xs mx-auto">
              Si termina en un basural a cielo abierto o en la naturaleza sin tratamiento adecuado.
            </p>
          </div>

          {/* Carbon Footprint & Oceans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Carbon Card */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                Huella de Carbono
              </span>
              <p className="text-xs font-bold text-stone-900 mt-1 leading-snug">
                {result.environmentalImpact.carbonFootprint}
              </p>
            </div>

            {/* Ocean Threat */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600">
                Riesgo en Cuencas y Océanos
              </span>
              <p className="text-xs text-stone-700 mt-1 leading-snug">
                {result.environmentalImpact.oceanImpact}
              </p>
            </div>
          </div>

          {/* Wildlife Danger */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 shadow-xs">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-rose-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Amenaza a la fauna silvestre</span>
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              {result.environmentalImpact.wildlifeDanger}
            </p>
          </div>

          {/* Practical Conservation Tip */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-950">
                  Cómo reducir su consumo a futuro
                </h4>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed font-medium">
                  {result.environmentalImpact.conservationTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FUENTES CONFIABLES */}
      {activeTab === 'sources' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="px-1">
            <h2 className="font-heading font-extrabold text-sm text-stone-900">
              Fuentes Oficiales y Científicas
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Información contrastada con organismos ambientales verificados
            </p>
          </div>

          <div className="space-y-2.5">
            {result.reliableSources.map((source, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {source.organization}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verificado
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-stone-900 mt-1.5">
                    {source.name}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    «{source.fact}»
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 font-medium">Tema: {source.topic}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Consultar sitio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-[#FBF9F3]/95 backdrop-blur-md border-t border-emerald-900/10 p-3 z-40">
        <div className="max-w-md mx-auto flex items-center gap-2">
          {/* PRIMARY: Escanear otro objeto */}
          <button
            onClick={onScanAnother}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-heading font-bold text-sm shadow-md shadow-emerald-700/25 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-white" />
            <span>Escanear otro objeto</span>
          </button>

          {/* Quick save button */}
          <button
            onClick={() => onSaveToHistory(result)}
            className={`py-3 px-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center transition-colors shadow-xs ${
              isSaved
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-white text-stone-700 hover:bg-emerald-50 border-stone-200'
            }`}
            title="Guardar en historial"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-700" /> : <Bookmark className="w-4 h-4 text-stone-600" />}
          </button>
        </div>
      </div>

      {/* Nearby Green Points Modal */}
      <RecycleMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        preferredMaterial={result.category}
      />
    </div>
  );
};
