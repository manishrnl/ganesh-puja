import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function GalleryPage() {
  const { selectedYear, setSelectedYear, gallery, yearOptions } = useAppContext();

  const years = useMemo(
    () =>
      [...new Set([...yearOptions.filter((year) => year !== 'All Years'), ...gallery.map((item) => item.year)])]
        .map((year) => String(year))
        .sort((a, b) => Number(b) - Number(a)),
    [gallery, yearOptions]
  );

  const activeYear = selectedYear === 'All Years' ? (years[0] || '2026') : selectedYear;

  const visibleYears = useMemo(() => {
    const current = Number(activeYear);
    const availableYears = years
      .map((year) => Number(year))
      .filter((year) => year >= current - 2 && year <= current)
      .sort((a, b) => a - b);

    return availableYears.length ? availableYears.map(String) : [String(activeYear)];
  }, [activeYear, years]);

  const items = useMemo(
    () => gallery.filter((item) => item.year === activeYear).sort((a, b) => Number(a.id) - Number(b.id)),
    [gallery, activeYear]
  );

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Memories</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">Photo & Video Gallery</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Year-wise memories from sthapana, aarti, cultural nights, seva, prasad counters, committee work, and visarjan.
          </p>
        </div>
      </header>

      <section className="px-4 py-14">
        <div className="mx-auto w-[min(1240px,100%)]">
          <div className="mt-10 flex flex-wrap items-center justify-end gap-2">
            {visibleYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                  activeYear === year
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-700 text-white shadow-lg shadow-orange-700/20'
                    : 'border border-orange-200 bg-white text-stone-700 hover:bg-orange-50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="mt-8 grid auto-rows-[280px] gap-5 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item, index) => (
              <Link
                key={item.id}
                to={`/gallery/${item.id}`}
                className={`group relative block overflow-hidden rounded-3xl shadow-premium ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/88 via-stone-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold text-stone-950">{item.year}</span>
                  <h2 className="mt-3 text-2xl font-extrabold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/78">{item.detail}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
