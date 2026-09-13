import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const exportCsv = (filename, rows, columns) => {
  const csv = [columns, ...rows.map((row) => columns.map((column) => `"${String(row[column] ?? '').replace(/"/g, '""')}"`))]
    .map((row) => row.join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default function AdminDashboardPage() {
  const { selectedYear, committeeMembers, donations, expenses, events, auditLog, t } = useAppContext();

  const totals = useMemo(() => {
    const byYear = (item) => selectedYear === 'All Years' || item.year === selectedYear;
    const approvedDonations = donations.filter((item) => byYear(item) && item.status === 'Approved');
    const approvedExpenses = expenses.filter((item) => byYear(item) && item.status === 'Approved');

    return {
      donationTotal: approvedDonations.reduce((sum, item) => sum + item.amount, 0),
      expenseTotal: approvedExpenses.reduce((sum, item) => sum + item.amount, 0),
      pendingDonations: donations.filter((item) => byYear(item) && item.status === 'Pending Approval').length,
      pendingExpenses: expenses.filter((item) => byYear(item) && item.status === 'Pending Approval').length,
      activeMembers: committeeMembers.filter((item) => item.founder || byYear(item)).length,
      treasuryReady: approvedDonations.length > 0 || approvedExpenses.length > 0,
    };
  }, [selectedYear, committeeMembers, donations, expenses]);

  const handleExport = () => {
    const rows = [...donations, ...expenses].filter((item) => selectedYear === 'All Years' || item.year === selectedYear);
    exportCsv(`${selectedYear.replace(/\s+/g, '-').toLowerCase()}-finance-summary.csv`, rows.map((item) => ({
      type: item.donorName ? 'Donation' : 'Expense',
      name: item.donorName || item.vendorName,
      amount: item.amount,
      date: item.date,
      status: item.status,
      year: item.year,
    })), ['type', 'name', 'amount', 'date', 'status', 'year']);
  };

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">{t.language === 'hi' ? 'एडमिन पैनल' : t.language === 'mr' ? 'प्रशासक पॅनेल' : 'Admin Panel'}</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">{selectedYear} Committee Dashboard</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Manage public content, committee records, approval queues, yearly editions, events, sponsors, and transparent publishing.
          </p>
        </div>
      </header>

      <section className="px-4 py-12">
        <div className="mx-auto w-[min(1240px,100%)]">
          <div className="grid gap-4 md:grid-cols-5">
            {[
              ['Total Chanda', formatINR(totals.donationTotal)],
              ['Approved Expenses', formatINR(totals.expenseTotal)],
              ['Balance', formatINR(totals.donationTotal - totals.expenseTotal)],
              ['Pending Items', totals.pendingDonations + totals.pendingExpenses],
              ['Committee', totals.activeMembers],
            ].map(([label, value]) => (
              <article key={label} className="rounded-3xl border border-orange-100 bg-white p-5 shadow-premium">
                <strong className="block text-2xl font-extrabold text-rose-900">{value}</strong>
                <span className="mt-1 block text-sm font-bold text-stone-500">{label}</span>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Quick Actions</p>
              <div className="mt-5 grid gap-3">
                <Link to="/admin/committee" className="rounded-2xl bg-stone-950 px-4 py-3 font-extrabold text-white">Manage Committee</Link>
                <Link to="/accountant/records" className="rounded-2xl bg-orange-100 px-4 py-3 font-extrabold text-orange-900">Open Finance Records</Link>
                <button type="button" className="rounded-2xl bg-emerald-100 px-4 py-3 text-left font-extrabold text-emerald-900">Copy committee from last year</button>
                <button type="button" onClick={handleExport} className="rounded-2xl bg-rose-100 px-4 py-3 text-left font-extrabold text-rose-900">Export year-wise summary</button>
              </div>
            </article>

            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium lg:col-span-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-800">Approval Queue</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {donations.filter((item) => selectedYear === 'All Years' || item.year === selectedYear).filter((item) => item.status === 'Pending Approval').map((item) => (
                  <div key={item.id} className="rounded-2xl bg-orange-50 p-4">
                    <strong className="block text-stone-950">{item.donorName}</strong>
                    <span className="text-sm font-bold text-stone-600">Donation {formatINR(item.amount)} · {item.paymentMode}</span>
                  </div>
                ))}
                {expenses.filter((item) => selectedYear === 'All Years' || item.year === selectedYear).filter((item) => item.status === 'Pending Approval').map((item) => (
                  <div key={item.id} className="rounded-2xl bg-rose-50 p-4">
                    <strong className="block text-stone-950">{item.vendorName}</strong>
                    <span className="text-sm font-bold text-stone-600">Expense {formatINR(item.amount)} · {item.category}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Content Calendar</p>
              <div className="mt-5 grid gap-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between rounded-2xl bg-stone-50 p-4">
                    <div>
                      <strong className="block text-stone-950">{event.title}</strong>
                      <span className="text-sm text-stone-600">{event.date} at {event.time}</span>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-orange-800">{event.type}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-800">Audit Log</p>
              <div className="mt-5 grid gap-3">
                {auditLog.map((log) => (
                  <div key={log.item} className="rounded-2xl bg-stone-50 p-4">
                    <strong className="block text-stone-950">{log.item}</strong>
                    <span className="text-sm text-stone-600">{log.change}</span>
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
