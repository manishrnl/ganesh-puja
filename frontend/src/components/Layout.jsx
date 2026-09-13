import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import YearSelector from './YearSelector';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/committee', key: 'committee' },
  { to: '/events', key: 'events' },
  { to: '/gallery', key: 'gallery' },
  { to: '/dashboard', key: 'dashboard' },
  { to: '/donate', key: 'donate' },
  { to: '/contact', key: 'contact' },
];

const themeClasses = {
  sunrise: 'bg-[radial-gradient(circle_at_15%_9%,rgba(250,204,21,0.16),transparent_20%),linear-gradient(135deg,#fff7ed,#fef3c7,#fffaf0)] text-stone-950',
  royal: 'bg-[radial-gradient(circle_at_15%_10%,rgba(34,197,94,0.18),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(251,191,36,0.22),transparent_22%),linear-gradient(135deg,#fff7ed,#f8fafc,#eff6ff)] text-slate-950',
  night: 'bg-[radial-gradient(circle_at_18%_8%,rgba(250,204,21,0.16),transparent_24%),radial-gradient(circle_at_80%_16%,rgba(244,63,94,0.12),transparent_20%),linear-gradient(135deg,#0b1020,#111827,#020817)] text-white',
  lotus: 'bg-[radial-gradient(circle_at_12%_12%,rgba(110,231,183,0.18),transparent_25%),radial-gradient(circle_at_78%_8%,rgba(251,191,36,0.15),transparent_22%),linear-gradient(135deg,#ecfeff,#f0fdf4,#fff7ed)] text-emerald-950',
};

function HoverSelect({ label, value, options, onChange, mutedLabel, icon, theme }) {
  const selected = options.find((option) => option.value === value) || options[0];
  const [open, setOpen] = useState(false);
  const isDark = theme === 'night';

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onFocus={openMenu}
      onBlur={closeMenu}
    >
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => setOpen((current) => !current)}
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-2 text-[12px] font-bold shadow-[0_12px_28px_rgba(120,53,15,0.08)] backdrop-blur-xl transition hover:border-orange-200 ${
          isDark
            ? 'border-slate-700/80 bg-slate-900/85 text-slate-100'
            : 'border-white/50 bg-white/80 text-stone-800'
        }`}
      >
        <span className="text-base">{icon}</span>
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-stone-100 text-stone-900'}`}>
          {selected.name || selected}
        </span>
      </button>

      <div
        className={`absolute left-1/2 top-full z-40 mt-2 w-52 -translate-x-1/2 rounded-2xl border p-2 text-left shadow-[0_20px_40px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition-all duration-200 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        } ${isDark ? 'border-slate-700 bg-slate-900/95 text-slate-100' : 'border-orange-100 bg-white/95 text-stone-700'}`}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        <p className={`px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em] ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>{mutedLabel || label}</p>
        <div className="grid gap-1">
          {options.map((option) => (
            <button
              key={option.value || option}
              type="button"
              onClick={() => {
                onChange(option.value || option);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-left transition ${
                (option.value || option) === value
                  ? isDark
                    ? 'bg-orange-500/20 text-orange-200'
                    : 'bg-orange-100 text-orange-900'
                  : isDark
                    ? 'text-slate-200 hover:bg-slate-800'
                    : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span className="text-[11px] font-extrabold">{option.name || option}</span>
              <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>{option.native || option.accent || option.description || 'View'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, setTheme, language, setLanguage, t, festivalInfo, themeOptions, languageOptions } = useAppContext();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const internalLink = user?.role === 'accountant'
    ? { to: '/accountant', label: 'Accountant Panel' }
    : { to: '/admin', label: 'Admin Panel' };
  const isNight = theme === 'night';

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
    : 'U';

  return (
    <div className={`min-h-screen ${themeClasses[theme] || themeClasses.sunrise}`}>
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/70 shadow-[0_15px_35px_rgba(120,53,15,0.08)] backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-[1440px] flex-nowrap items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Home">
            <img
              src={festivalInfo.ganeshLogo}
              alt="Ganesh Ji"
              className="h-11 w-11 shrink-0 rounded-full border border-white/60 object-cover shadow-lg shadow-orange-900/20"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 overflow-hidden xl:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-2.5 py-1.5 text-[13px] font-bold transition ${
                    isActive ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 shadow-sm' : 'text-stone-700 hover:bg-white hover:text-rose-800'
                  }`
                }
              >
                {t.nav[item.key]}
              </NavLink>
            ))}
          </nav>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 xl:flex-none">
            <YearSelector />
            <HoverSelect label={t.theme || 'Theme'} value={theme} options={themeOptions} onChange={setTheme} mutedLabel={t.theme || 'Theme'} icon="🎨" theme={theme} />
            <HoverSelect label={t.language || 'Language'} value={language} options={languageOptions} onChange={setLanguage} mutedLabel={t.language || 'Language'} icon="🌐" theme={theme} />

            {!user && (
              <button type="button" className="hidden rounded-full bg-rose-800 px-3 py-1.5 text-[12px] font-extrabold text-white shadow-lg shadow-rose-900/20 md:inline-flex" onClick={() => setAuthOpen(true)}>
                {t.login}
              </button>
            )}

            <Link to="/donate" className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-700 px-3 py-1.5 text-[12px] font-extrabold text-white shadow-lg shadow-orange-700/25">
              {t.donate}
            </Link>

            {user ? (
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((current) => !current)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-amber-400 text-sm font-extrabold text-white shadow-lg shadow-orange-900/20 ring-2 ring-white/70 transition hover:scale-[1.02]"
                  aria-label="Open account menu"
                >
                  {initials}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-orange-100 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
                    <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-rose-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-amber-400 text-sm font-extrabold text-white">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-stone-900">{user.fullName}</p>
                          <p className="truncate text-[11px] text-stone-500">{user.email || 'committee@andahpuja.org'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        to={internalLink.to}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-stone-700 transition hover:bg-orange-50"
                      >
                        <span>{internalLink.label}</span>
                        <span>→</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-stone-700 transition hover:bg-orange-50"
                      >
                        <span>Dashboard</span>
                        <span>→</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                      >
                        <span>Logout</span>
                        <span>↗</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-2 xl:hidden">
          <nav className="flex gap-1 overflow-x-auto pb-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition ${
                    isActive ? 'bg-orange-100 text-orange-800' : 'bg-white/70 text-stone-700'
                  }`
                }
              >
                {t.nav[item.key]}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className={isNight ? 'text-white' : 'text-stone-950'}>{children}</main>

      <footer className="border-t border-white/10 bg-stone-950 px-4 py-12 text-white">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-8 md:grid-cols-[1.4fr_0.8fr_0.9fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-rose-700 font-extrabold">ॐ</span>
              <div>
                <strong className="block">{festivalInfo.shortName}</strong>
                <small className="text-amber-200">Established {festivalInfo.established}</small>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
              Devotion, culture, transparent stewardship, and year-wise public memories for every family connected to the mandal.
            </p>
          </div>
          <div>
            <h5 className="mb-3 font-extrabold text-amber-200">Explore</h5>
            <div className="grid gap-2 text-sm text-white/70">
              {navItems.slice(1, 6).map((item) => <Link key={item.to} to={item.to}>{t.nav[item.key]}</Link>)}
            </div>
          </div>
          <div>
            <h5 className="mb-3 font-extrabold text-amber-200">Festival Info</h5>
            <div className="grid gap-2 text-sm text-white/70">
              <span>Sthapana: {festivalInfo.sthapana}</span>
              <span>Morning Aarti: {festivalInfo.morningAarti}</span>
              <span>Evening Aarti: {festivalInfo.eveningAarti}</span>
              <span>Visarjan: {festivalInfo.visarjan}</span>
            </div>
          </div>
          <div>
            <h5 className="mb-3 font-extrabold text-amber-200">Contact</h5>
            <div className="grid gap-2 text-sm text-white/70">
              <span>{festivalInfo.location}</span>
              <span>{festivalInfo.phone}</span>
              <span>{festivalInfo.email}</span>
              <span>Instagram, Facebook, WhatsApp</span>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
