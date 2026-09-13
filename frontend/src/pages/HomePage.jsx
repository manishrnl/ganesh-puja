import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const featureCards = [
  {
    title: 'Public Transparency',
    text: 'Year-wise chanda, approved expenses, balance, receipt records, and sponsor recognition remain easy for devotees to inspect.',
    tone: 'from-emerald-500 to-teal-700',
  },
  {
    title: 'Ritual & Culture',
    text: 'Daily aarti, sthapana, bhajan sandhya, cultural evenings, prasad seva, and visarjan route planning are presented clearly.',
    tone: 'from-orange-500 to-rose-700',
  },
  {
    title: 'Committee History',
    text: 'Founder, patron, current committee, and past committees stay searchable across every festival edition.',
    tone: 'from-indigo-500 to-sky-700',
  },
];

export default function HomePage() {
  const { festivalInfo, t, selectedYear, donations, expenses, events, sponsors } = useAppContext();

  const totals = useMemo(() => {
    const yearFilter = (item) => selectedYear === 'All Years' || item.year === selectedYear;
    const approvedDonations = donations.filter((item) => yearFilter(item) && item.status === 'Approved');
    const approvedExpenses = expenses.filter((item) => yearFilter(item) && item.status === 'Approved');
    const donationTotal = approvedDonations.reduce((sum, item) => sum + item.amount, 0);
    const expenseTotal = approvedExpenses.reduce((sum, item) => sum + item.amount, 0);
    return {
      donationTotal,
      expenseTotal,
      balance: donationTotal - expenseTotal,
      donors: approvedDonations.length,
    };
  }, [selectedYear, donations, expenses]);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={festivalInfo.heroImage}
          alt="Ganesh puja mandap with lamps and flowers"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-festival" />
        <div className="mx-auto grid min-h-[calc(100vh-76px)] w-[min(1240px,calc(100%-32px))] items-center gap-10 py-16 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">{t.heroKicker}</p>
            <h1 className="font-display text-6xl font-bold leading-[0.95] sm:text-7xl lg:text-8xl">{t.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88">{t.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/events" className="rounded-full bg-amber-300 px-6 py-3 font-extrabold text-stone-950 shadow-xl shadow-amber-900/20">
                {t.explore}
              </Link>
              <Link to="/donate" className="rounded-full border border-white/35 bg-white/15 px-6 py-3 font-extrabold text-white backdrop-blur">
                {t.support}
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/20 bg-white/16 p-6 text-white shadow-2xl backdrop-blur-xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Festival Edition</p>
              <h2 className="mt-3 text-3xl font-extrabold">{selectedYear} Ganeshotsav</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/14 p-4">
                  <span className="text-sm text-white/70">Sthapana</span>
                  <strong className="mt-1 block text-xl">{festivalInfo.sthapana}</strong>
                </div>
                <div className="rounded-2xl bg-white/14 p-4">
                  <span className="text-sm text-white/70">Visarjan</span>
                  <strong className="mt-1 block text-xl">{festivalInfo.visarjan}</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
              {[
                ['Chanda', formatINR(totals.donationTotal)],
                ['Expenses', formatINR(totals.expenseTotal)],
                ['Balance', formatINR(totals.balance)],
                ['Donors', `${totals.donors}+`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/20 bg-white/90 p-5 shadow-premium">
                  <strong className="block text-2xl font-extrabold text-rose-900">{value}</strong>
                  <span className="text-sm font-bold text-stone-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto w-[min(1240px,100%)]">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-orange-700">Complete Platform</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-normal text-stone-950">Built like a real mandal website, not a demo shell.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featureCards.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-premium">
                <div className={`h-2 bg-gradient-to-r ${card.tone}`} />
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-stone-950">{card.title}</h3>
                  <p className="mt-3 leading-7 text-stone-600">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 px-4 py-16 backdrop-blur">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-800">Daily Aarti & Puja</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-normal text-stone-950">Schedule devotees can rely on during festival week.</h2>
            <p className="mt-4 leading-7 text-stone-600">
              Morning darshan, evening aarti, prasad timing, special puja days, volunteer briefings, and visarjan planning are all visible up front.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <article key={event.id} className="rounded-3xl border border-amber-100 bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-orange-800">{event.type}</span>
                  <span className="text-sm font-bold text-stone-500">{event.time}</span>
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-stone-950">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{event.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-stone-950 p-6 text-white shadow-premium lg:col-span-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-200">President's Message</p>
            <blockquote className="mt-5 text-2xl font-bold leading-10">
              "Every receipt, every diya, every seva counter, and every cultural program belongs to the community. This platform keeps our devotion visible and our responsibility clear."
            </blockquote>
            <p className="mt-5 font-extrabold text-amber-200">Sanjay Kulkarni, President 2026</p>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-premium">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-800">Sponsor Wall</p>
            <div className="mt-4 grid gap-3">
              {sponsors.map((sponsor) => (
                <div key={sponsor.name} className="flex items-center justify-between rounded-2xl bg-orange-50 p-4">
                  <div>
                    <strong className="block text-stone-950">{sponsor.name}</strong>
                    <span className="text-sm font-bold text-orange-700">{sponsor.tier}</span>
                  </div>
                  <span className="font-extrabold text-rose-800">{formatINR(sponsor.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
