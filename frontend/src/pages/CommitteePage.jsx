import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const hierarchy = ['Founder & Patron', 'President', 'Vice-President', 'Secretary', 'Joint Secretary', 'Treasurer', 'Cultural Head', 'Media & Outreach', 'Volunteer Coordinator', 'Member'];
const rank = (designation) => {
  const index = hierarchy.indexOf(designation);
  return index === -1 ? 99 : index;
};

export default function CommitteePage() {
  const { selectedYear, committeeMembers } = useAppContext();

  const members = useMemo(() => {
    return committeeMembers
      .filter((member) => member.founder || selectedYear === 'All Years' || member.year === selectedYear)
      .sort((a, b) => rank(a.designation) - rank(b.designation) || a.displayOrder - b.displayOrder);
  }, [committeeMembers, selectedYear]);

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Leadership</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">Our Committee</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Current and past committee members grouped by responsibility, with founders and patrons visible across every year.
          </p>
        </div>
      </header>

      <section className="px-4 py-14">
        <div className="mx-auto w-[min(1240px,100%)]">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-premium">
            <p className="text-lg leading-8 text-stone-700">
              Every festival edition is guided by elders, professionals, youth volunteers, cultural organizers, and finance caretakers. Public profiles include phone and email actions so devotees can reach the right team quickly.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <article key={`${member.id}-${member.year}`} className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-premium">
                <img src={member.photo} alt={member.name} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-orange-800">{member.designation}</span>
                    <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-stone-400">{member.founder ? 'Always shown' : member.year}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold text-stone-950">{member.name}</h2>
                  <p className="mt-3 leading-7 text-stone-600">{member.bio}</p>
                  <div className="mt-5 flex gap-3">
                    <a href={`tel:${member.phone}`} className="rounded-full bg-stone-950 px-4 py-2 text-sm font-extrabold text-white">Call</a>
                    <a href={`mailto:${member.email}`} className="rounded-full border border-orange-200 px-4 py-2 text-sm font-extrabold text-orange-800">Email</a>
                    <a href={`https://wa.me/${member.phone.replace(/\D/g, '')}`} className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-extrabold text-emerald-800">WhatsApp</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
