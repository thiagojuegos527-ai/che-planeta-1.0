import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Zap, ZapOff, Image as ImageIcon, X, AlertCircle, Sparkles } from 'lucide-react';
import { SAMPLE_OBJECTS, SampleObject } from '../utils/sampleImages';

interface CameraScreenProps {
  onCapture: (base64Image: string, userHint?: string) => void;
  onCancel: () => void;
  onSelectSample: (sample: SampleObject) => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  onCapture,
  onCancel,
  onSelectSample
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showSamplesDrawer, setShowSamplesDrawer] = useState(false);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      try {
        setCameraError(null);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = newStream;
        setStream(newStream);
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch((err) => {
            console.warn("Video play error:", err);
          });
        }
      } catch (err: any) {
        console.warn("Camera access failed or unavailable:", err);
        setHasCameraPermission(false);
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Permiso de cámara denegado. Podés habilitarlo en tu navegador o subir una foto.'
            : 'No se pudo acceder a la cámara en este dispositivo. Podés subir una foto o usar los objetos de prueba.'
        );
      }
    }

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Toggle Torch/Flash
  const toggleTorch = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const capabilities = (videoTrack.getCapabilities && videoTrack.getCapabilities()) as any;
      if (capabilities && capabilities.torch) {
        const nextState = !torchEnabled;
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setTorchEnabled(nextState);
      } else {
        // Fallback: visual flash simulation toggle
        setTorchEnabled(!torchEnabled);
      }
    } catch (e) {
      setTorchEnabled(!torchEnabled);
    }
  };

  // Flip Camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Shutter capture handler
  const handleShutter = () => {
    if (isCapturing) return;
    setIsCapturing(true);

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        onCapture(dataUrl);
        return;
      }
    }

    // Fallback if video isn't capturing: use first sample
    onSelectSample(SAMPLE_OBJECTS[0]);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onCapture(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none">
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Camera Controls Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          title="Cerrar cámara"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Apuntá al objeto</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Torch button */}
          <button
            onClick={toggleTorch}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              torchEnabled
                ? 'bg-amber-400 text-stone-900 shadow-md shadow-amber-400/30'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title="Linterna"
          >
            {torchEnabled ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
          </button>

          {/* Switch Camera */}
          <button
            onClick={toggleFacingMode}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            title="Cambiar de cámara"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {hasCameraPermission === false || cameraError ? (
          /* Camera Fallback View */
          <div className="max-w-xs mx-auto p-6 rounded-2xl bg-stone-900/90 border border-stone-800 text-center text-white">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-2">
              Visor de Cámara no disponible
            </h3>
            <p className="text-xs text-stone-300 mb-5 leading-relaxed">
              {cameraError || 'Tu navegador no otorgó acceso a la cámara o estás en un entorno de prueba.'}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Subir foto desde tus archivos</span>
              </button>

              <button
                onClick={() => setShowSamplesDrawer(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-stone-700"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Elegir un objeto de muestra</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Camera Stream */
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Simulated Torch Screen Highlight */}
            {torchEnabled && (
              <div className="absolute inset-0 bg-white/20 pointer-events-none transition-opacity" />
            )}

            {/* Target Reticle / Scanning Framing Guide */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 aspect-square max-w-xs mx-auto pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl shadow-sm shadow-emerald-500/50" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl shadow-sm shadow-emerald-500/50" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl shadow-sm shadow-emerald-500/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl shadow-sm shadow-emerald-500/50" />

              {/* Center reticle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                </div>
              </div>

              {/* Scanning laser animation beam */}
              <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10B981] animate-scan-laser pointer-events-none opacity-80" />
            </div>

            {/* Bottom Tip Overlay */}
            <div className="absolute bottom-24 inset-x-4 text-center pointer-events-none">
              <span className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium shadow-md">
                Centrá el envase o residuo dentro del marco
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Shutter & Action Bar */}
      <div className="relative z-20 px-6 py-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-3">
        {/* Sample objects drawer toggle button */}
        <button
          onClick={() => setShowSamplesDrawer(!showSamplesDrawer)}
          className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white/90 text-xs font-medium backdrop-blur-md border border-white/10 flex items-center gap-1.5 transition-colors mb-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{showSamplesDrawer ? 'Ocultar muestras' : '¿Sin objeto a mano? Ver ejemplos'}</span>
        </button>

        {/* Samples Horizontal Tray if Open */}
        {showSamplesDrawer && (
          <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
            {SAMPLE_OBJECTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-emerald-500/40 text-white text-xs backdrop-blur-md border border-white/20 transition-colors"
              >
                <span>{sample.icon}</span>
                <span className="font-semibold">{sample.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Shutter row */}
        <div className="w-full flex items-center justify-around max-w-xs mt-1">
          {/* Gallery Picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            title="Elegir de galería"
          >
            <ImageIcon className="w-6 h-6" />
          </button>

          {/* MAIN BIG SHUTTER BUTTON */}
          <button
            onClick={handleShutter}
            disabled={isCapturing}
            className="relative w-20 h-20 rounded-full p-1 border-4 border-emerald-400 bg-transparent flex items-center justify-center group active:scale-95 transition-transform cursor-pointer shadow-lg shadow-emerald-500/40"
            title="Sacar foto y analizar"
          >
            <div className="w-full h-full rounded-full bg-white group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
              <Camera className="w-8 h-8 text-emerald-800" />
            </div>
            {/* Ping aura */}
            <div className="absolute inset-0 rounded-full border border-emerald-300/40 animate-ping pointer-events-none" />
          </button>

          {/* Samples quick button */}
          <button
            onClick={() => onSelectSample(SAMPLE_OBJECTS[0])}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors text-lg"
            title="Analizar muestra rápida"
          >
            🌱
          </button>
        </div>
      </div>
    </div>
  );
};
