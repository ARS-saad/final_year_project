import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';

export default async function TourDetailsPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tour, error } = await supabase
    .from('tours')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single();

  if (error || !tour) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/#packages" className="text-sm text-teal-hover font-semibold hover:underline">
          ← Back to all tours
        </Link>
      </div>

      {/* GALLERY */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-md2 overflow-hidden">
          <div className="relative h-72 md:h-[420px]">
            <Image src={tour.gallery[0] ?? tour.image_url} alt={tour.title} fill className="object-cover" priority />
          </div>
          <div className="grid grid-rows-2 gap-3">
            <div className="relative h-36 md:h-[204px]">
              <Image src={tour.gallery[1] ?? tour.image_url} alt={`${tour.title} 2`} fill className="object-cover" />
            </div>
            <div className="relative h-36 md:h-[204px]">
              <Image src={tour.gallery[2] ?? tour.image_url} alt={`${tour.title} 3`} fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* Left column */}
        <div>
          {tour.match_score != null && (
            <span className="inline-block bg-alert-success-bg text-alert-success-text text-xs font-bold font-mono px-2.5 py-1 rounded mb-3">
              ✨ {tour.match_score}% AI Match
            </span>
          )}
          <h1 className="font-heading text-3xl font-bold mb-2">{tour.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>📍 {tour.country}</span>
            <span>📅 {tour.days} Days</span>
            <span>⭐ {tour.rating} ({tour.reviews_count} reviews)</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{tour.description}</p>

          <h2 className="font-heading text-xl font-bold mb-4">Itinerary</h2>
          <div className="border border-gray-200 rounded-md2 overflow-hidden mb-8">
            {tour.itinerary.map((item) => (
              <div key={item.day} className="flex gap-4 px-5 py-4 border-b border-gray-100 last:border-b-0">
                <span className="font-mono text-xs font-bold text-teal-hover w-14 flex-shrink-0 pt-0.5">
                  {item.day}
                </span>
                <span className="text-sm text-gray-700">{item.desc}</span>
              </div>
            ))}
          </div>

          <h2 className="font-heading text-xl font-bold mb-4">What&apos;s Included</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tour.includes.map((inc) => (
              <li key={inc} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-teal">✓</span> {inc}
              </li>
            ))}
          </ul>
        </div>

        {/* Right column - booking card */}
        <div>
          <div className="sticky top-24 bg-white border border-gray-200 rounded-md2 shadow-card p-6">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-coral font-bold text-2xl">${tour.price}</span>
              <span className="text-gray-400 text-sm">/ person</span>
            </div>
            <div className="text-sm text-gray-500 mb-6">Free cancellation up to 48 hours before departure</div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1.5">Departure Date</label>
              <input
                type="date"
                className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1.5">Travelers</label>
              <select className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition">
                <option>1 Traveler</option>
                <option>2 Travelers</option>
                <option>3 Travelers</option>
                <option>4 Travelers</option>
              </select>
            </div>

            <Link
              href={`/checkout?tour=${tour.id}`}
              className="block w-full text-center bg-teal text-white font-semibold py-3.5 rounded-sm2 hover:bg-teal-hover transition"
            >
              Book Now
            </Link>

            <div className="text-center text-xs text-gray-400 mt-4">
              You won&apos;t be charged yet
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
