import React, { useState } from 'react';
import { X, MapPin, Clock, Phone, ExternalLink, Search, CheckCircle2, Navigation } from 'lucide-react';
import { LOCAL_GREEN_POINTS } from '../utils/greenPoints';
import { GreenPoint } from '../types/chePlaneta';

interface RecycleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredMaterial?: string;
}

export const RecycleMapModal: React.FC<RecycleMapModalProps> = ({
  isOpen,
  onClose,
  preferredMaterial
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<GreenPoint | null>(LOCAL_GREEN_POINTS[0]);

  if (!isOpen) return null;

  const filteredPoints = LOCAL_GREEN_POINTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.acceptedMaterials.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-[#FBF9F3] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-emerald-900/10">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Puntos Verdes y Reciclaje
              </h3>
              <p className="text-xs text-emerald-200">
                Centros CAV y Puntos Verdes &bull; San Luis Capital
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-900 flex items-center justify-center text-emerald-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-white border-b border-stone-200 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por barrio (Centro, Rawson, Jardín...), calle o material..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-stone-800"
            />
          </div>
        </div>

        {/* Map Simulation Graphic Banner */}
        <div className="h-32 bg-emerald-950 relative overflow-hidden shrink-0">
          {/* Stylized vector map pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#34D399" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Interactive Map Points */}
          <div className="absolute inset-0 flex items-center justify-around px-8">
            {LOCAL_GREEN_POINTS.slice(0, 4).map((pt, i) => (
              <button
                key={pt.id}
                onClick={() => setSelectedPoint(pt)}
                className={`flex flex-col items-center group transition-transform ${
                  selectedPoint?.id === pt.id ? 'scale-110' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    selectedPoint?.id === pt.id
                      ? 'bg-emerald-400 text-stone-900 ring-4 ring-emerald-500/40'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-100 mt-1 max-w-[70px] truncate text-center">
                  {pt.neighborhood}
                </span>
              </button>
            ))}
          </div>

          <div className="absolute bottom-1 right-2 text-[9px] text-emerald-400 font-mono">
            Puntos Verdes y CAV &bull; San Luis Capital (Municipalidad de San Luis)
          </div>
        </div>

        {/* Selected Point Detail Card & List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedPoint && (
            <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-500/40 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {selectedPoint.distanceKm} km de vos
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {selectedPoint.neighborhood}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-stone-900 mt-1">
                    {selectedPoint.name}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{selectedPoint.address}</span>
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${selectedPoint.name} ${selectedPoint.address} ${selectedPoint.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Cómo llegar</span>
                </a>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-col gap-1.5 text-xs text-stone-700">
                <div className="flex items-center gap-2 text-stone-600">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{selectedPoint.schedule}</span>
                </div>
                {selectedPoint.phone && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Atención: {selectedPoint.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Materiales Aceptados:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPoint.acceptedMaterials.map((mat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other points list */}
          <div>
            <h5 className="font-heading font-bold text-xs uppercase text-stone-500 tracking-wider mb-2 px-1">
              Todos los puntos verdes ({filteredPoints.length})
            </h5>
            <div className="space-y-2">
              {filteredPoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setSelectedPoint(point)}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selectedPoint?.id === point.id
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-white hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div>
                    <h6 className="font-bold text-xs text-stone-900">{point.name}</h6>
                    <p className="text-[11px] text-stone-500">{point.address} &bull; {point.neighborhood}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-stone-200 shrink-0">
                    {point.distanceKm} km
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
