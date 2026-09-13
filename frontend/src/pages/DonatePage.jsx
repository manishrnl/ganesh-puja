import { useAppContext } from '../context/AppContext';

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function DonatePage() {
  const { festivalInfo, sponsors } = useAppContext();

  return (
    <div>
      <header className="bg-festival px-4 py-14 text-white">
        <div className="mx-auto w-[min(1240px,100%)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-200">Support The Festival</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-normal">Online Donation</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/82">
            Contribute through UPI, bank transfer, cheque, card, or sponsor support. Receipts are tracked year-wise with verification-ready records.
          </p>
        </div>
      </header>

      <section className="px-4 py-14">
        <div className="mx-auto grid w-[min(1240px,100%)] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-premium">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-orange-700">Payment Details</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-normal text-stone-950">Every contribution supports rituals, seva, and public safety.</h2>
            <div className="mt-6 grid gap-3">
              {[
                ['UPI ID', festivalInfo.upi],
                ['PhonePe / Google Pay', festivalInfo.phone],
                ['Bank', festivalInfo.bank],
                ['Account', festivalInfo.account],
                ['IFSC', festivalInfo.ifsc],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-orange-50 p-4">
                  <span className="text-sm font-bold text-stone-500">{label}</span>
                  <strong className="block break-words text-lg text-stone-950">{value}</strong>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-800">UPI QR</p>
              <div className="mt-5 grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
                <div className="grid aspect-square place-items-center rounded-3xl border-8 border-amber-100 bg-[linear-gradient(45deg,#111_25%,transparent_25%),linear-gradient(-45deg,#111_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#111_75%),linear-gradient(-45deg,transparent_75%,#111_75%)] bg-[length:28px_28px] bg-[position:0_0,0_14px,14px_-14px,-14px_0]">
                  <div className="rounded-2xl bg-white px-4 py-3 text-center font-extrabold text-rose-900">UPI</div>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-stone-950">Receipt number format: GP-YEAR-SEQUENCE</h3>
                  <p className="mt-3 leading-7 text-stone-600">
                    Donation entries generate downloadable receipts with mandal letterhead and QR verification links when connected to the backend.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-orange-700">Sponsor Tiers</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.name} className="rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 p-5">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-orange-800">{sponsor.tier}</span>
                    <strong className="mt-4 block text-xl text-stone-950">{sponsor.name}</strong>
                    <span className="mt-1 block font-extrabold text-rose-800">{formatINR(sponsor.amount)}</span>
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
