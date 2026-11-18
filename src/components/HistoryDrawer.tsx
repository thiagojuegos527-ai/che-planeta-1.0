import React from 'react';
import { X, Trash2, ArrowRight, Award, Calendar, ExternalLink } from 'lucide-react';
import { EcoAnalysisResult } from '../types/chePlaneta';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: EcoAnalysisResult[];
  onSelectResult: (result: EcoAnalysisResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-sm bg-[#FBF9F3] h-full shadow-2xl flex flex-col border-l border-emerald-900/10">
        {/* Header */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-heading font-extrabold text-base text-stone-900">
              Historial de Escaneos
            </h3>
            <p className="text-xs text-stone-500">
              {history.length} {history.length === 1 ? 'objeto analizado' : 'objetos analizados'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <span className="text-4xl mb-2">🌱</span>
              <p className="font-heading font-bold text-sm text-stone-800">
                Aún no tenés escaneos guardados
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                Cada objeto que escanees o selecciones podrá guardarse acá para consultar sus ideas DIY y reciclaje en cualquier momento.
              </p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="group p-3 rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 flex items-center gap-3 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.objectName}
                  className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 truncate">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.recyclabilityScore}/100
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-stone-900 group-hover:text-emerald-700 truncate mt-1">
                    {item.objectName}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    {item.probableMaterial}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer with Clear option */}
        {history.length > 0 && (
          <div className="p-4 bg-white border-t border-stone-200 shrink-0">
            <button
              onClick={onClearHistory}
              className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar historial</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
