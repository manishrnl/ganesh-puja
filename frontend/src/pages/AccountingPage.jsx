import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const downloadCsv = (filename, rows, columns) => {
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

export default function AccountingPage() {
  const { selectedYear, donations, setDonations, expenses, setExpenses, t } = useAppContext();
  const [search, setSearch] = useState('');
  const [donationForm, setDonationForm] = useState({
    donorName: '',
    phone: '',
    email: '',
    amount: '',
    paymentMode: 'UPI',
    paymentReference: '',
    collectedBy: 'Accountant',
    showOnPublicWall: false,
  });
  const [expenseForm, setExpenseForm] = useState({
    vendorName: '',
    amount: '',
    category: 'Decoration',
    paymentMode: 'Bank Transfer',
    paidBy: 'Accountant',
    notes: '',
  });
  const [editingDonationId, setEditingDonationId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const visibleDonations = useMemo(
    () => donations
      .filter((item) => selectedYear === 'All Years' || item.year === selectedYear)
      .filter((item) => item.donorName.toLowerCase().includes(search.toLowerCase())),
    [donations, selectedYear, search]
  );

  const visibleExpenses = useMemo(
    () => expenses
      .filter((item) => selectedYear === 'All Years' || item.year === selectedYear)
      .filter((item) => item.vendorName.toLowerCase().includes(search.toLowerCase())),
    [expenses, selectedYear, search]
  );

  const submitDonation = (e) => {
    e.preventDefault();
    if (!donationForm.donorName.trim() || !donationForm.phone.trim() || !donationForm.amount) return;
    const year = selectedYear === 'All Years' ? '2026' : selectedYear;
    const sequence = donations.filter((item) => item.year === year).length + 1;

    if (editingDonationId) {
      setDonations((prev) => prev.map((item) => item.id === editingDonationId ? {
        ...item,
        ...donationForm,
        amount: Number(donationForm.amount),
        year: item.year,
        status: item.status,
      } : item));
      setEditingDonationId(null);
    } else {
      setDonations((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...donationForm,
          amount: Number(donationForm.amount),
          year,
          date: new Date().toISOString().slice(0, 10),
          receiptNo: `GP-${year}-${String(sequence).padStart(5, '0')}`,
          status: 'Approved',
        },
      ]);
    }
    setDonationForm({ donorName: '', phone: '', email: '', amount: '', paymentMode: 'UPI', paymentReference: '', collectedBy: 'Accountant', showOnPublicWall: false });
  };

  const submitExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.vendorName.trim() || !expenseForm.amount) return;
    const year = selectedYear === 'All Years' ? '2026' : selectedYear;

    if (editingExpenseId) {
      setExpenses((prev) => prev.map((item) => item.id === editingExpenseId ? {
        ...item,
        ...expenseForm,
        amount: Number(expenseForm.amount),
        year: item.year,
      } : item));
      setEditingExpenseId(null);
    } else {
      setExpenses((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...expenseForm,
          amount: Number(expenseForm.amount),
          year,
          status: 'Pending Approval',
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
    setExpenseForm({ vendorName: '', amount: '', category: 'Decoration', paymentMode: 'Bank Transfer', paidBy: 'Accountant', notes: '' });
  };

  const startEditDonation = (item) => {
    setEditingDonationId(item.id);
    setDonationForm({
      donorName: item.donorName,
      phone: item.phone,
      email: item.email || '',
      amount: String(item.amount),
      paymentMode: item.paymentMode,
      paymentReference: item.paymentReference || '',
      collectedBy: item.collectedBy || 'Accountant',
      showOnPublicWall: !!item.showOnPublicWall,
    });
  };

  const startEditExpense = (item) => {
    setEditingExpenseId(item.id);
    setExpenseForm({
      vendorName: item.vendorName,
      amount: String(item.amount),
      category: item.category,
      paymentMode: item.paymentMode,
      paidBy: item.paidBy || 'Accountant',
      notes: item.notes || '',
    });
  };

  const deleteDonation = (id) => setDonations((prev) => prev.filter((item) => item.id !== id));
  const deleteExpense = (id) => setExpenses((prev) => prev.filter((item) => item.id !== id));

  const exportYearData = () => {
    const donationRows = donations.filter((item) => selectedYear === 'All Years' || item.year === selectedYear);
    const expenseRows = expenses.filter((item) => selectedYear === 'All Years' || item.year === selectedYear);
    downloadCsv(
      `${selectedYear.replace(/\s+/g, '-').toLowerCase()}-finance-export.csv`,
      [
        ...donationRows.map((item) => ({ type: 'Donation', name: item.donorName, amount: item.amount, date: item.date, status: item.status, year: item.year })),
        ...expenseRows.map((item) => ({ type: 'Expense', name: item.vendorName, amount: item.amount, date: item.date, status: item.status, year: item.year })),
      ],
      ['type', 'name', 'amount', 'date', 'status', 'year']
    );
  };

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">{t.language === 'hi' ? 'वित्त मॉड्यूल' : t.language === 'mr' ? 'निधी मॉड्यूल' : 'Finance Module'}</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">Accounting & Receipts</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Add chanda and expense entries with searchable year-wise records, receipt numbers, approval status, and export-ready tables.
          </p>
        </div>
      </header>

      <section className="px-4 py-12">
        <div className="mx-auto w-[min(1240px,100%)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Finance Manager</p>
              <h2 className="mt-2 text-2xl font-extrabold text-stone-950">Year-wise ledger controls</h2>
            </div>
            <button type="button" onClick={exportYearData} className="rounded-full bg-stone-950 px-5 py-2.5 text-sm font-extrabold text-white">Export {selectedYear}</button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <form className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium" onSubmit={submitDonation}>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Donation CRUD</p>
              <h2 className="mt-2 text-2xl font-extrabold text-stone-950">{editingDonationId ? 'Update donate record' : 'Add devotee chanda'}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={donationForm.donorName} onChange={(e) => setDonationForm({ ...donationForm, donorName: e.target.value })} placeholder="Donor name" />
                <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={donationForm.phone} onChange={(e) => setDonationForm({ ...donationForm, phone: e.target.value })} placeholder="Phone" />
                <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={donationForm.email} onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })} placeholder="Email optional" />
                <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={donationForm.amount} onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })} placeholder="Amount" type="number" />
                <select className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={donationForm.paymentMode} onChange={(e) => setDonationForm({ ...donationForm, paymentMode: e.target.value })}>
                  {['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'].map((item) => <option key={item}>{item}</option>)}
                </select>
                <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={donationForm.paymentReference} onChange={(e) => setDonationForm({ ...donationForm, paymentReference: e.target.value })} placeholder="Reference / UTR" />
              </div>
              <label className="mt-4 flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 font-bold text-stone-700">
                <input type="checkbox" checked={donationForm.showOnPublicWall} onChange={(e) => setDonationForm({ ...donationForm, showOnPublicWall: e.target.checked })} />
                Show on public donor wall
              </label>
              <div className="mt-5 flex gap-3">
                <button type="submit" className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-700 px-6 py-3 font-extrabold text-white shadow-lg shadow-orange-700/25">
                  {editingDonationId ? 'Update Donation' : 'Save Donation'}
                </button>
                {editingDonationId ? (
                  <button type="button" onClick={() => { setEditingDonationId(null); setDonationForm({ donorName: '', phone: '', email: '', amount: '', paymentMode: 'UPI', paymentReference: '', collectedBy: 'Accountant', showOnPublicWall: false }); }} className="rounded-full border border-stone-200 px-6 py-3 font-extrabold text-stone-700">
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>

            <form className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium" onSubmit={submitExpense}>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-800">Expense CRUD</p>
              <h2 className="mt-2 text-2xl font-extrabold text-stone-950">{editingExpenseId ? 'Update vendor expense' : 'Add vendor expense'}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={expenseForm.vendorName} onChange={(e) => setExpenseForm({ ...expenseForm, vendorName: e.target.value })} placeholder="Vendor / payee name" />
                <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} placeholder="Amount" type="number" />
                <select className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
                  {['Decoration', 'Electrician', 'Priest/Pandit', 'Prasad', 'Sound & Lighting', 'Security', 'Tent/Mandap', 'Transport', 'Immersion/Visarjan', 'Miscellaneous'].map((item) => <option key={item}>{item}</option>)}
                </select>
                <select className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={expenseForm.paymentMode} onChange={(e) => setExpenseForm({ ...expenseForm, paymentMode: e.target.value })}>
                  {['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <textarea className="mt-4 min-h-24 w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={expenseForm.notes} onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} placeholder="Notes or invoice detail" />
              <div className="mt-5 flex gap-3">
                <button type="submit" className="rounded-full bg-stone-950 px-6 py-3 font-extrabold text-white shadow-lg">
                  {editingExpenseId ? 'Update Expense' : 'Save Expense'}
                </button>
                {editingExpenseId ? (
                  <button type="button" onClick={() => { setEditingExpenseId(null); setExpenseForm({ vendorName: '', amount: '', category: 'Decoration', paymentMode: 'Bank Transfer', paidBy: 'Accountant', notes: '' }); }} className="rounded-full border border-stone-200 px-6 py-3 font-extrabold text-stone-700">
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <article className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Name-wise Search</p>
                <h2 className="mt-2 text-2xl font-extrabold text-stone-950">Donation and vendor records</h2>
              </div>
              <input className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 font-semibold outline-none focus:border-orange-400 md:w-80" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search donor or vendor" />
            </div>
            <div className="mt-5 grid gap-6 xl:grid-cols-2">
              <div className="overflow-x-auto rounded-2xl border border-orange-100">
                <table className="min-w-[620px] w-full text-left text-sm">
                  <thead className="bg-stone-950 text-white">
                    <tr><th className="px-4 py-3">Receipt</th><th className="px-4 py-3">Donor</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
                  </thead>
                  <tbody>
                    {visibleDonations.map((item) => (
                      <tr key={item.id} className="border-t border-orange-100">
                        <td className="px-4 py-3 font-bold text-rose-900">{item.receiptNo}</td>
                        <td className="px-4 py-3 font-bold text-stone-950">{item.donorName}</td>
                        <td className="px-4 py-3">{formatINR(item.amount)}</td>
                        <td className="px-4 py-3">{item.status}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => startEditDonation(item)} className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-extrabold text-orange-900">Edit</button>
                            <button type="button" onClick={() => deleteDonation(item.id)} className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-extrabold text-rose-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-orange-100">
                <table className="min-w-[620px] w-full text-left text-sm">
                  <thead className="bg-stone-950 text-white">
                    <tr><th className="px-4 py-3">Vendor</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
                  </thead>
                  <tbody>
                    {visibleExpenses.map((item) => (
                      <tr key={item.id} className="border-t border-orange-100">
                        <td className="px-4 py-3 font-bold text-stone-950">{item.vendorName}</td>
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3">{formatINR(item.amount)}</td>
                        <td className="px-4 py-3">{item.status}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => startEditExpense(item)} className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-extrabold text-orange-900">Edit</button>
                            <button type="button" onClick={() => deleteExpense(item.id)} className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-extrabold text-rose-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
