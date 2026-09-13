import { useAppContext } from '../context/AppContext';

export default function EventsPage() {
  const { events, festivalInfo } = useAppContext();

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Festival Calendar</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">Events & Aarti Schedule</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Sthapana, daily aarti, cultural programs, maha prasad, seva activities, and visarjan route planning in one public schedule.
          </p>
        </div>
      </header>

      <section className="px-4 py-14">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-orange-700">Daily Rituals</p>
            <h2 className="mt-3 text-3xl font-extrabold text-stone-950">Aarti timings</h2>
            <div className="mt-5 grid gap-3">
              {[
                ['Sthapana', festivalInfo.sthapana],
                ['Morning Aarti', festivalInfo.morningAarti],
                ['Evening Aarti', festivalInfo.eveningAarti],
                ['Prasad Seva', festivalInfo.prasad],
                ['Visarjan', festivalInfo.visarjan],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-orange-50 p-4">
                  <span className="text-sm font-bold text-stone-500">{label}</span>
                  <strong className="block text-lg text-stone-950">{value}</strong>
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-4">
            {events.map((event, index) => (
              <article key={event.id} className="grid gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-lg md:grid-cols-[92px_1fr_auto] md:items-center">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-amber-300 via-orange-500 to-rose-700 text-center text-2xl font-extrabold text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-800">{event.type}</span>
                    <span className="text-sm font-bold text-stone-500">{event.date}</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-extrabold text-stone-950">{event.title}</h2>
                  <p className="mt-2 leading-7 text-stone-600">{event.description}</p>
                </div>
                <strong className="rounded-full bg-stone-950 px-4 py-2 text-center text-white">{event.time}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 px-4 py-14">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-6 lg:grid-cols-2">
          <img src={festivalInfo.processionImage} alt="Festival procession" className="h-full min-h-80 rounded-3xl object-cover shadow-premium" />
          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-premium">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-800">Visarjan Route</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-normal text-stone-950">Disciplined procession with public safety coordination.</h2>
            <p className="mt-4 leading-8 text-stone-600">
              Route volunteers manage dhol tasha placement, senior citizen access, water points, traffic support, and final immersion coordination. A live map embed can be connected through the configured map key in production.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
