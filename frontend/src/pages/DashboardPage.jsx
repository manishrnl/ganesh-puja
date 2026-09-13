import { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppContext } from '../context/AppContext';

const COLORS = ['#f97316', '#be123c', '#0f766e', '#4f46e5', '#ca8a04', '#db2777'];
const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function DashboardPage() {
  const { selectedYear, donations, expenses, sponsors, auditLog } = useAppContext();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const byYear = (item) => selectedYear === 'All Years' || item.year === selectedYear;
    return {
      donations: donations.filter((item) => byYear(item)),
      expenses: expenses.filter((item) => byYear(item)),
    };
  }, [selectedYear, donations, expenses]);

  const approvedDonations = filtered.donations.filter((item) => item.status === 'Approved');
  const approvedExpenses = filtered.expenses.filter((item) => item.status === 'Approved');
  const totalChanda = approvedDonations.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = approvedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const publicDonors = approvedDonations.filter((item) => item.showOnPublicWall);
  const donorMatches = publicDonors.filter((item) => item.donorName.toLowerCase().includes(query.toLowerCase()));

  const categoryData = Object.values(
    approvedExpenses.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || { name: item.category, value: 0 };
      acc[item.category].value += item.amount;
      return acc;
    }, {})
  );

  const yearData = ['2024', '2025', '2026'].map((year) => ({
    year,
    chanda: donations.filter((item) => item.year === year && item.status === 'Approved').reduce((sum, item) => sum + item.amount, 0),
    expense: expenses.filter((item) => item.year === year && item.status === 'Approved').reduce((sum, item) => sum + item.amount, 0),
  }));

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Public Transparency</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">Festival Dashboard</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Year-wise chanda, approved expense categories, donor wall, sponsor tiers, and audit highlights for devotees who want clear festival stewardship.
          </p>
        </div>
      </header>

      <section className="px-4 py-12">
        <div className="mx-auto w-[min(1240px,100%)]">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Total Chanda', totalChanda, 'from approved public records'],
              ['Approved Expenses', totalExpenses, 'only verified expense entries'],
              ['Current Balance', totalChanda - totalExpenses, 'available for seva and operations'],
              ['Public Donors', publicDonors.length, 'opt-in donor wall entries'],
            ].map(([label, value, detail]) => (
              <article key={label} className="rounded-3xl border border-orange-100 bg-white p-5 shadow-premium">
                <span className="text-sm font-bold text-stone-500">{detail}</span>
                <strong className="mt-2 block text-3xl font-extrabold text-rose-900">
                  {typeof value === 'number' && label !== 'Public Donors' ? formatINR(value) : value}
                </strong>
                <h2 className="mt-1 font-extrabold text-stone-950">{label}</h2>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Compare Years</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-stone-950">Chanda vs expenses</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-extrabold text-emerald-800">Export CSV / PDF ready</span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearData}>
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                    <Tooltip formatter={(value) => formatINR(value)} />
                    <Bar dataKey="chanda" fill="#f97316" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="expense" fill="#be123c" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-800">Expense Categories</p>
              <h2 className="mt-2 text-2xl font-extrabold text-stone-950">Approved spend mix</h2>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={92} innerRadius={52}>
                      {categoryData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => formatINR(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-2">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3 text-sm">
                    <span className="font-bold text-stone-700"><span style={{ color: COLORS[index % COLORS.length] }}>●</span> {item.name}</span>
                    <strong className="text-stone-950">{formatINR(item.value)}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Donor Search & Wall</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-stone-950">Search opt-in contribution history</h2>
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search donor name"
                  className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 font-semibold outline-none focus:border-orange-400 md:w-72"
                />
              </div>
              <div className="mt-5 overflow-hidden rounded-2xl border border-orange-100">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-stone-950 text-white">
                    <tr>
                      <th className="px-4 py-3">Receipt</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Mode</th>
                      <th className="px-4 py-3">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donorMatches.map((donor) => (
                      <tr key={donor.id} className="border-t border-orange-100">
                        <td className="px-4 py-3 font-bold text-rose-900">{donor.receiptNo}</td>
                        <td className="px-4 py-3 font-bold text-stone-950">{donor.donorName}</td>
                        <td className="px-4 py-3">{formatINR(donor.amount)}</td>
                        <td className="px-4 py-3">{donor.paymentMode}</td>
                        <td className="px-4 py-3">{donor.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-800">Audit & Sponsors</p>
              <h2 className="mt-2 text-2xl font-extrabold text-stone-950">Trust signals</h2>
              <div className="mt-5 grid gap-3">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.name} className="rounded-2xl bg-amber-50 p-4">
                    <strong className="block text-stone-950">{sponsor.name}</strong>
                    <span className="text-sm font-extrabold text-orange-700">{sponsor.tier} sponsor, {formatINR(sponsor.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                {auditLog.map((log) => (
                  <div key={log.item} className="rounded-2xl bg-stone-50 p-4 text-sm">
                    <strong className="block text-stone-950">{log.item}</strong>
                    <span className="text-stone-600">{log.change}</span>
                    <em className="mt-1 block not-italic text-xs font-bold text-stone-500">{log.by} · {log.time}</em>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
