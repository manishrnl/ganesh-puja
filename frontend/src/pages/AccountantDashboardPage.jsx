import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const exportCsv = (filename, rows, columns) => {
  const rowsWithHeaders = [columns, ...rows.map((row) => columns.map((column) => row[column]))];
  const csv = rowsWithHeaders
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default function AccountantDashboardPage() {
  const { selectedYear, donations, expenses, t } = useAppContext();

  const summary = useMemo(() => {
    const byYear = (item) => selectedYear === 'All Years' || item.year === selectedYear;
    const approvedDonations = donations.filter((item) => byYear(item) && item.status === 'Approved');
    const approvedExpenses = expenses.filter((item) => byYear(item) && item.status === 'Approved');

    return {
      donationTotal: approvedDonations.reduce((sum, item) => sum + item.amount, 0),
      expenseTotal: approvedExpenses.reduce((sum, item) => sum + item.amount, 0),
      pendingDonations: donations.filter((item) => byYear(item) && item.status === 'Pending Approval').length,
      pendingExpenses: expenses.filter((item) => byYear(item) && item.status === 'Pending Approval').length,
      receipts: approvedDonations.length,
      recentDonations: [...donations].filter((item) => byYear(item)).slice(0, 3),
      recentExpenses: [...expenses].filter((item) => byYear(item)).slice(0, 3),
    };
  }, [selectedYear, donations, expenses]);

  const handleExport = (type) => {
    const rows = type === 'donations'
      ? donations.filter((item) => selectedYear === 'All Years' || item.year === selectedYear)
      : expenses.filter((item) => selectedYear === 'All Years' || item.year === selectedYear);

    const columns = type === 'donations'
      ? ['receiptNo', 'donorName', 'phone', 'amount', 'paymentMode', 'date', 'status']
      : ['vendorName', 'category', 'amount', 'paymentMode', 'date', 'status'];

    exportCsv(`${selectedYear.replace(/\s+/g, '-').toLowerCase()}-${type}.csv`, rows, columns);
  };

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">{t.language === 'hi' ? 'लेखाकार पैनल' : t.language === 'mr' ? 'लेखाधिकारी पॅनेल' : 'Accountant Panel'}</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">{selectedYear} Finance Overview</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Record chanda, manage expenses, check pending approvals, export reports, and keep receipt history ready for devotees.
          </p>
        </div>
      </header>

      <section className="px-4 py-12">
        <div className="mx-auto w-[min(1240px,100%)]">
          <div className="grid gap-4 md:grid-cols-5">
            {[
              ['Approved Chanda', formatINR(summary.donationTotal)],
              ['Approved Expenses', formatINR(summary.expenseTotal)],
              ['Balance', formatINR(summary.donationTotal - summary.expenseTotal)],
              ['Receipts', summary.receipts],
              ['Pending', summary.pendingDonations + summary.pendingExpenses],
            ].map(([label, value]) => (
              <article key={label} className="rounded-3xl border border-orange-100 bg-white p-5 shadow-premium">
                <strong className="block text-2xl font-extrabold text-rose-900">{value}</strong>
                <span className="text-sm font-bold text-stone-500">{label}</span>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Link to="/accountant/records" className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Records</p>
              <h2 className="mt-3 text-2xl font-extrabold text-stone-950">Add donations and expenses</h2>
              <p className="mt-3 leading-7 text-stone-600">Use structured fields for donor, phone, receipt, vendor, category, payment mode, and status.</p>
            </Link>
            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Year-wise Export</p>
              <h2 className="mt-3 text-2xl font-extrabold text-stone-950">CSV ledger download</h2>
              <p className="mt-3 leading-7 text-stone-600">Download filtered donation and expense sheets for the active year or for all years combined.</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => handleExport('donations')} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-extrabold text-emerald-900">Export Donations</button>
                <button type="button" onClick={() => handleExport('expenses')} className="rounded-full bg-orange-100 px-4 py-2 text-sm font-extrabold text-orange-900">Export Expenses</button>
              </div>
            </article>
            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-800">Controls</p>
              <h2 className="mt-3 text-2xl font-extrabold text-stone-950">Locked year protection</h2>
              <p className="mt-3 leading-7 text-stone-600">Closed year edits require a Super Admin reopen flow to protect public totals.</p>
            </article>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Recent Donations</p>
              <div className="mt-5 grid gap-3">
                {summary.recentDonations.length ? summary.recentDonations.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl bg-orange-50 p-4">
                    <div>
                      <strong className="block text-stone-950">{item.donorName}</strong>
                      <span className="text-sm font-bold text-stone-600">{item.receiptNo} · {item.status}</span>
                    </div>
                    <strong className="text-rose-900">{formatINR(item.amount)}</strong>
                  </div>
                )) : <p className="text-stone-500">No donations in this period.</p>}
              </div>
            </article>
            <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-800">Recent Expenses</p>
              <div className="mt-5 grid gap-3">
                {summary.recentExpenses.length ? summary.recentExpenses.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl bg-rose-50 p-4">
                    <div>
                      <strong className="block text-stone-950">{item.vendorName}</strong>
                      <span className="text-sm font-bold text-stone-600">{item.category} · {item.status}</span>
                    </div>
                    <strong className="text-rose-900">{formatINR(item.amount)}</strong>
                  </div>
                )) : <p className="text-stone-500">No expenses in this period.</p>}
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
