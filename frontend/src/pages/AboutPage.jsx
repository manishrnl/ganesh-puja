const milestones = [
  { year: '1988', title: 'First Sthapana', text: 'Local families installed the first community idol with a simple mandap, shared prasad, and open neighborhood participation.' },
  { year: '2003', title: 'Formal Committee', text: 'A yearly committee structure was introduced for accountable planning, volunteer duties, cultural programs, and public communication.' },
  { year: '2012', title: 'Seva Expansion', text: 'The mandal added community meals, student support, medical help desks, and structured festival logistics.' },
  { year: '2026', title: 'Digital Transparency', text: 'Year-wise committee, chanda, expenses, gallery, events, donors, and sponsors became visible through the public platform.' },
];

export default function AboutPage() {
  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Our Story</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">About Andah Ganesh Puja</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            A mandal shaped by devotion, public service, cultural pride, and accountable community stewardship since 1988.
          </p>
        </div>
      </header>

      <section className="px-4 py-14">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-premium">
            <p className="text-lg leading-9 text-stone-700">
              The Andah Ganesh Puja Committee brings together devotees, families, students, working professionals, and sevaks during Ganeshotsav. What began as a small public gathering has grown into a full festival experience with daily aarti, cultural programs, food seva, volunteer support, and transparent year-wise financial reporting.
            </p>
            <p className="mt-5 text-lg leading-9 text-stone-700">
              The committee’s mission is simple: preserve the spiritual depth of Ganesh worship, keep the festival inclusive and orderly, and make every rupee of public support visible through accountable records.
            </p>
          </article>

          <div className="grid gap-4">
            {['Devotion-first rituals', 'Youth and family participation', 'Public donor transparency', 'Seva beyond festival week'].map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-rose-700 font-extrabold text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong className="text-lg text-stone-950">{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 px-4 py-14">
        <div className="mx-auto w-[min(1000px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-orange-700">Year By Year</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-normal text-stone-950">Milestones that built the mandal</h2>
          <div className="mt-8 grid gap-4">
            {milestones.map((item) => (
              <article key={item.year} className="grid gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-lg md:grid-cols-[120px_1fr]">
                <div className="rounded-2xl bg-gradient-to-br from-amber-300 via-orange-500 to-rose-700 p-4 text-center text-2xl font-extrabold text-white">
                  {item.year}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-stone-950">{item.title}</h3>
                  <p className="mt-2 leading-7 text-stone-600">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
