import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function YearSelector() {
  const { selectedYear, setSelectedYear, yearOptions, t, theme } = useAppContext();
  const [open, setOpen] = useState(false);
  const selected = yearOptions.find((year) => year === selectedYear) || yearOptions[0];
  const isDark = theme === 'night';

  return (
    <div className="relative shrink-0" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={t.year || 'Year'}
        title={t.year || 'Year'}
        onClick={() => setOpen((current) => !current)}
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-2 text-[12px] font-bold shadow-[0_10px_25px_rgba(120,53,15,0.12)] backdrop-blur-xl transition hover:border-orange-200 ${
          isDark
            ? 'border-slate-700/80 bg-slate-900/85 text-slate-100'
            : 'border-white/50 bg-white/80 text-stone-800'
        }`}
      >
        <span className="text-base">📅</span>
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-stone-100 text-stone-900'}`}>
          {selected}
        </span>
      </button>

      <div
        className={`absolute left-1/2 top-full z-40 mt-2 w-44 -translate-x-1/2 rounded-2xl border p-2 text-left shadow-[0_18px_34px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition-all duration-200 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        } ${isDark ? 'border-slate-700 bg-slate-900/95 text-slate-100' : 'border-orange-100 bg-white/95 text-stone-700'}`}
      >
        <p className={`px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em] ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>{t.year || 'Year'}</p>
        <div className="grid gap-1">
          {yearOptions.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                setSelectedYear(year);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left transition ${
                year === selectedYear
                  ? isDark
                    ? 'bg-orange-500/20 text-orange-200'
                    : 'bg-orange-100 text-orange-900'
                  : isDark
                    ? 'text-slate-200 hover:bg-slate-800'
                    : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span className="text-[11px] font-extrabold">{year}</span>
              <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{year === 'All Years' ? 'All' : 'Data'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
