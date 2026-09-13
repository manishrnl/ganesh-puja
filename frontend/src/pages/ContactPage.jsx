import { useAppContext } from '../context/AppContext';

export default function ContactPage() {
  const { festivalInfo } = useAppContext();

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Get In Touch</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">Contact Us</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Reach the committee for darshan, seva registration, donation receipts, vendor coordination, media, and festival announcements.
          </p>
        </div>
      </header>

      <section className="px-4 py-14">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-premium">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-orange-700">Mandal Office</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-normal text-stone-950">Andah Ganesh Puja Mandal</h2>
            <div className="mt-6 grid gap-3">
              {[
                ['Address', festivalInfo.location],
                ['Phone', festivalInfo.phone],
                ['Email', festivalInfo.email],
                ['Office Hours', '9:00 AM to 9:00 PM during festival week'],
                ['Social Channels', 'Instagram, Facebook, WhatsApp, public announcement board'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-orange-50 p-4">
                  <span className="text-sm font-bold text-stone-500">{label}</span>
                  <strong className="block text-lg text-stone-950">{value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-premium">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-800">Volunteer / Sevak Registration</p>
            <form className="mt-5 grid gap-4">
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" placeholder="Full name" />
              <input className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" placeholder="Phone number" />
              <select className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" defaultValue="Darshan queue support">
                <option>Darshan queue support</option>
                <option>Prasad seva</option>
                <option>Cultural event team</option>
                <option>Visarjan route team</option>
                <option>Donation desk</option>
              </select>
              <textarea className="min-h-32 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 outline-none focus:border-orange-400" placeholder="Availability or message" />
              <button type="button" className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-700 px-6 py-3 font-extrabold text-white shadow-lg shadow-orange-700/25">
                Register Interest
              </button>
            </form>
          </article>
        </div>
      </section>
    </div>
  );
}
