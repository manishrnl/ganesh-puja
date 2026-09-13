import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const designations = ['President', 'Vice-President', 'Secretary', 'Joint Secretary', 'Treasurer', 'Cultural Head', 'Media & Outreach', 'Volunteer Coordinator', 'Member'];

export default function AdminCommitteePage() {
  const { selectedYear, committeeMembers, setCommitteeMembers } = useAppContext();
  const [form, setForm] = useState({
    name: '',
    designation: 'Member',
    phone: '',
    email: '',
    bio: '',
    active: true,
    founder: false,
  });

  const filteredMembers = useMemo(
    () => committeeMembers.filter((member) => member.founder || selectedYear === 'All Years' || member.year === selectedYear),
    [committeeMembers, selectedYear]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) return;

    setCommitteeMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...form,
        year: selectedYear === 'All Years' ? '2026' : selectedYear,
        displayOrder: prev.length + 1,
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
      },
    ]);
    setForm({ name: '', designation: 'Member', phone: '', email: '', bio: '', active: true, founder: false });
  };

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Admin Access</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">Manage Committee Members</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Add yearly members, set founder or patron visibility, maintain contact details, and prepare records to copy forward.
          </p>
        </div>
      </header>

      <section className="px-4 py-12">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <form className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium" onSubmit={handleSubmit}>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-700">Member Form</p>
            <h2 className="mt-2 text-2xl font-extrabold text-stone-950">Add committee profile</h2>
            <div className="mt-5 grid gap-4">
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
              <select className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })}>
                {designations.map((item) => <option key={item}>{item}</option>)}
              </select>
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
              <textarea className="min-h-28 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short bio or message" />
              <label className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 font-bold text-stone-700">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active member
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 font-bold text-stone-700">
                <input type="checkbox" checked={form.founder} onChange={(e) => setForm({ ...form, founder: e.target.checked })} />
                Founder or Patron, always visible
              </label>
              <button type="submit" className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-700 px-6 py-3 font-extrabold text-white shadow-lg shadow-orange-700/25">
                Add Member
              </button>
            </div>
          </form>

          <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-800">Committee List</p>
                <h2 className="mt-2 text-2xl font-extrabold text-stone-950">{selectedYear} profiles</h2>
              </div>
              <button type="button" className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-extrabold text-emerald-900">Copy Forward</button>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-orange-100">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-stone-950 text-white">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Scope</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-t border-orange-100">
                      <td className="px-4 py-3 font-extrabold text-stone-950">{member.name}</td>
                      <td className="px-4 py-3">{member.designation}</td>
                      <td className="px-4 py-3">{member.phone}</td>
                      <td className="px-4 py-3">{member.active ? 'Active' : 'Inactive'}</td>
                      <td className="px-4 py-3">{member.founder ? 'All years' : member.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
