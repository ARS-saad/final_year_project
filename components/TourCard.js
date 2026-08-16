import Image from 'next/image';
import Link from 'next/link';

export default function TourCard({ tour }) {
  return (
    <Link
      href={`/tours/${tour.id}`}
      className="block bg-white rounded-md2 overflow-hidden border border-gray-200 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-200"
    >
      <div className="relative h-48 w-full">
        <Image src={tour.image_url} alt={tour.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        {tour.match_score != null && (
          <span className="absolute top-3.5 left-3.5 bg-white/95 text-teal-hover text-xs font-bold font-mono px-2.5 py-1 rounded shadow-sm">
            ✨ {tour.match_score}% Match
          </span>
        )}
        <span className="absolute top-3.5 right-3.5 bg-white/95 w-8 h-8 rounded-full flex items-center justify-center text-sm">
          🤍
        </span>
      </div>
      <div className="p-5">
        <div className="text-lg font-semibold mb-1.5">{tour.title}</div>
        <div className="text-gray-500 text-sm mb-3.5">
          📅 {tour.days} Days &nbsp;•&nbsp; 📍 {tour.country}
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-3.5">
          <div className="text-coral font-bold text-lg">
            ${tour.price} <span className="text-gray-400 font-normal text-xs">/ person</span>
          </div>
          <div className="text-sm font-semibold">⭐ {tour.rating} ({tour.reviews_count})</div>
        </div>
      </div>
    </Link>
  );
}
