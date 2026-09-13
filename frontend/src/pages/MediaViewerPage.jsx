import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function MediaViewerPage() {
  const { gallery } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const item = gallery.find((entry) => String(entry.id) === String(id));

  if (!item) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-premium">
          <h2 className="text-2xl font-extrabold text-stone-950">Media not found</h2>
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            className="mt-5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-700 px-5 py-2.5 font-bold text-white"
          >
            Back to gallery
          </button>
        </div>
      </div>
    );
  }

  const mediaSources = [
    { type: 'image', src: item.image, label: 'Gallery image' },
    { type: 'video', src: '/videos/ganesh-ji-2026-1.mp4', label: 'Festival video' },
    { type: 'audio', src: '/audios/ganesh-ji-2026-1.mp3', label: 'Festival audio' },
  ];

  return (
    <div className="px-4 py-14">
      <div className="mx-auto w-[min(1240px,100%)]">
        <button
          type="button"
          onClick={() => navigate('/gallery')}
          className="mb-6 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-extrabold text-orange-800"
        >
          ← Back to Gallery
        </button>

        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-premium">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-stone-950 p-4">
              <div className="overflow-hidden rounded-[1.5rem] bg-stone-900">
                {item.mediaType === 'video' ? (
                  <video controls className="h-[420px] w-full object-cover" src={item.image} />
                ) : item.mediaType === 'audio' ? (
                  <div className="flex h-[420px] items-center justify-center bg-gradient-to-br from-orange-500 to-rose-700 p-6 text-white">
                    <audio controls className="w-full max-w-md" src={item.image} />
                  </div>
                ) : (
                  <img src={item.image} alt={item.title} className="h-[420px] w-full object-cover" />
                )}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <span className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold text-stone-900">{item.year}</span>
              <h1 className="mt-4 text-3xl font-extrabold text-stone-950">{item.title}</h1>
              <p className="mt-4 leading-7 text-stone-600">{item.detail}</p>

              <div className="mt-7 space-y-3">
                {mediaSources.map((media) => (
                  <div key={media.label} className="rounded-2xl border border-orange-100 bg-orange-50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <strong className="text-sm font-extrabold uppercase tracking-[0.08em] text-stone-700">{media.type}</strong>
                      <span className="text-[11px] font-bold text-stone-500">{media.label}</span>
                    </div>

                    {media.type === 'image' ? (
                      <img src={media.src} alt={media.label} className="h-28 w-full rounded-xl object-cover" />
                    ) : media.type === 'video' ? (
                      <video controls className="h-28 w-full rounded-xl object-cover" src={media.src} />
                    ) : (
                      <audio controls className="w-full" src={media.src} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
