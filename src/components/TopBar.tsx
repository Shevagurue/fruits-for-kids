import { Home, Volume2, VolumeX } from 'lucide-react';
import { ScreenId } from '../types';

interface TopBarProps {
  currentScreen: ScreenId;
  soundEnabled: boolean;
  onNavigate: (screen: ScreenId) => void;
  onToggleSound: () => void;
}

const NAV_ITEMS: Array<{ id: ScreenId; label: string }> = [
  { id: 'learn', label: "Let's Learn" },
  { id: 'listen', label: 'Listen & Repeat' },
  { id: 'play', label: "Let's Play" },
  { id: 'quiz', label: 'Quiz Time' },
  { id: 'score', label: 'My Score' }
];

export function TopBar({
  currentScreen,
  soundEnabled,
  onNavigate,
  onToggleSound
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: HOME / Brand */}
        <button
          type="button"
          onClick={() => onNavigate('menu')}
          className="flex items-center gap-2 text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-lg px-2 py-1"
          aria-label="HOME — Kembali ke Menu Utama"
        >
          <Home className="w-5 h-5 text-emerald-600" />
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight">
            HOME
          </span>
        </button>

        {/* Zone 2: 5 Main Menu Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600" aria-label="Navigasi Utama">
          {NAV_ITEMS.map((item) => {
            const active = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: SOUND ON / OFF Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span>SOUND OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Compact single-row mobile quick nav when inside sub-pages */}
      <nav
        className="md:hidden border-t border-slate-100 px-3 py-1.5 flex items-center gap-2 overflow-x-auto"
        aria-label="Navigasi Mobile"
      >
        {NAV_ITEMS.map((item) => {
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
