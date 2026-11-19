import React, { useState } from 'react';
import {
  UserPlus,
  LogIn,
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  Compass,
  CheckCircle2,
  AlertCircle,
  Leaf,
} from 'lucide-react';
import { UserAccountRecord } from '../types/gamification';

export type AuthMode = 'welcome' | 'register' | 'login';

interface AuthScreenProps {
  initialMode?: AuthMode;
  savedAccounts: UserAccountRecord[];
  onRegister: (username: string, email: string, password: string) => { ok: boolean; error?: string };
  onLogin: (identifier: string, password: string) => { ok: boolean; error?: string };
  onContinueAsGuest: () => void;
  onCancel?: () => void;
  isConvertingGuest?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'welcome',
  savedAccounts,
  onRegister,
  onLogin,
  onContinueAsGuest,
  onCancel,
  isConvertingGuest = false,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = (nextMode: AuthMode) => {
    setErrorMsg(null);
    setMode(nextMode);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || username.trim().length < 2) {
      setErrorMsg('Ingresá un nombre de usuario de al menos 2 caracteres.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Ingresá un correo electrónico válido.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const res = onRegister(username.trim(), email.trim().toLowerCase(), password);
    if (!res.ok && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Completá tu correo (o usuario) y contraseña para ingresar.');
      return;
    }

    const res = onLogin(email.trim(), password);
    if (!res.ok && res.error) {
      setErrorMsg(res.error);
    }
  };

  const nonGuestAccounts = savedAccounts.filter((acc) => !acc.isGuest);

  return (
    <div className="min-h-screen bg-[#FBF9F3] text-stone-900 flex flex-col justify-between px-4 py-6 relative overflow-hidden">
      {/* Subtle decorative eco blobs matching existing palette */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center relative z-10">
        {/* Back button when in sub-views or converting guest */}
        {(mode !== 'welcome' || onCancel) && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => {
                if (mode !== 'welcome' && !isConvertingGuest) {
                  resetForm('welcome');
                } else if (onCancel) {
                  onCancel();
                } else {
                  resetForm('welcome');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-emerald-50 border border-emerald-900/10 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{mode !== 'welcome' && !isConvertingGuest ? 'Volver' : 'Cancelar'}</span>
            </button>
          </div>
        )}

        {/* WELCOME SCREEN */}
        {mode === 'welcome' && (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
            {/* Official Che Planeta Logo */}
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg shadow-emerald-900/10 border border-emerald-900/10 flex items-center justify-center overflow-hidden mb-4">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_12.43.19_PM_8a61524e.jpeg"
                alt="Che Planeta - Menos residuos, más futuro"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-semibold mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tu espacio ecológico personal</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl text-stone-900 tracking-tight leading-tight">
              ¡Bienvenido/a a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
                Che Planeta
              </span>
            </h1>

            <p className="mt-2 text-stone-600 text-sm max-w-xs leading-relaxed">
              Escaneá objetos con IA, cuidá tu mascota planetaria y guardá tus puntos verdes, racha y logros en tu perfil.
            </p>

            {/* Quick feature highlights */}
            <div className="w-full grid grid-cols-3 gap-2 my-6">
              <div className="p-2.5 rounded-2xl bg-white/90 border border-emerald-900/10 shadow-2xs flex flex-col items-center">
                <span className="text-xl mb-1">📷</span>
                <span className="text-[11px] font-bold text-stone-800 leading-tight">Escaneo IA</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/90 border border-emerald-900/10 shadow-2xs flex flex-col items-center">
                <span className="text-xl mb-1">🌍</span>
                <span className="text-[11px] font-bold text-stone-800 leading-tight">Tu Mascota</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/90 border border-emerald-900/10 shadow-2xs flex flex-col items-center">
                <span className="text-xl mb-1">🏆</span>
                <span className="text-[11px] font-bold text-stone-800 leading-tight">Tu Progreso</span>
              </div>
            </div>

            {/* 3 Primary Welcome Options */}
            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={() => resetForm('register')}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-heading font-bold text-base shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                <span>Crear cuenta</span>
              </button>

              <button
                type="button"
                onClick={() => resetForm('login')}
                className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-emerald-600/25 text-emerald-900 font-heading font-bold text-base shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <LogIn className="w-5 h-5 text-emerald-600" />
                <span>Iniciar sesión</span>
              </button>

              <button
                type="button"
                onClick={onContinueAsGuest}
                className="w-full py-3 px-5 rounded-2xl bg-stone-100/80 hover:bg-stone-200/70 border border-stone-200 text-stone-700 font-heading font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-sky-600" />
                <span>Continuar como invitado</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-500 mt-4 leading-relaxed max-w-xs">
              Como invitado podés probar toda la app al instante. Si creás una cuenta, tu progreso queda guardado en tu perfil.
            </p>
          </div>
        )}

        {/* REGISTER SCREEN */}
        {mode === 'register' && (
          <div className="w-full p-5 rounded-3xl bg-white border border-emerald-900/10 shadow-md animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-emerald-900/10 shadow-xs shrink-0">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_12.43.19_PM_8a61524e.jpeg"
                  alt="Logo Che Planeta"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-xl text-stone-900">
                  {isConvertingGuest ? 'Guardar tu progreso' : 'Crear cuenta'}
                </h2>
                <p className="text-xs text-stone-600">
                  {isConvertingGuest
                    ? 'Convertí tu sesión de invitado en una cuenta personal'
                    : 'Armá tu perfil ecológico y adoptá tu mascota'}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. ValentinaVerde"
                    maxLength={24}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-stone-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isConvertingGuest
                    ? 'Se mantendrán todos tus puntos, racha, mascota e insignias.'
                    : 'Incluye mascota planetaria inicial y +80 puntos verdes de bienvenida.'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-heading font-bold text-sm shadow-md shadow-emerald-700/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isConvertingGuest ? 'Guardar cuenta ahora' : 'Crear mi cuenta'}</span>
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-600">
                ¿Ya tenés una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => resetForm('login')}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          </div>
        )}

        {/* LOGIN SCREEN */}
        {mode === 'login' && (
          <div className="w-full p-5 rounded-3xl bg-white border border-emerald-900/10 shadow-md animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-emerald-900/10 shadow-xs shrink-0">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_12.43.19_PM_8a61524e.jpeg"
                  alt="Logo Che Planeta"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-xl text-stone-900">
                  Iniciar sesión
                </h2>
                <p className="text-xs text-stone-600">
                  Recuperá tu perfil, mascota y racha ecológica
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Correo electrónico o usuario
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com o EcoAmigo"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-stone-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-heading font-bold text-sm shadow-md shadow-emerald-700/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar a Che Planeta</span>
              </button>
            </form>

            {/* Quick select saved prototype accounts */}
            {nonGuestAccounts.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Cuentas guardadas en este dispositivo (Acceso rápido):
                </p>
                <div className="space-y-1.5">
                  {nonGuestAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword(acc.password);
                        setErrorMsg(null);
                      }}
                      className="w-full p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-sm shrink-0">
                          {acc.profile.avatarEmoji}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {acc.username}
                          </p>
                          <p className="text-[10px] text-stone-600 truncate">
                            {acc.email} &bull; Nv. {acc.pet.level}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-700 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 shrink-0">
                        Completar
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-stone-100 text-center space-y-2">
              <p className="text-xs text-stone-600">
                ¿Todavía no tenés cuenta?{' '}
                <button
                  type="button"
                  onClick={() => resetForm('register')}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Crear cuenta
                </button>
              </p>
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
              >
                O continuar como invitado
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer credit */}
      <div className="max-w-md w-full mx-auto text-center mt-6 relative z-10">
        <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
          <Leaf className="w-3 h-3 text-emerald-600" />
          <span>Che Planeta &bull; Menos residuos, más futuro</span>
        </p>
      </div>
    </div>
  );
};
