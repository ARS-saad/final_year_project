'use client';

import { useState } from 'react';
import Link from 'next/link';
import TourCard from '@/components/TourCard';

export default function TourGrid({ tours, categories }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTours =
    activeCategory === 'All'
      ? tours
      : tours.filter((t) => t.categories?.name === activeCategory);

  return (
    <>
      <div className="flex gap-3 justify-center flex-wrap mb-11">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
            activeCategory === 'All'
              ? 'bg-teal border-teal text-white'
              : 'bg-white border-gray-200 text-navy hover:bg-teal hover:border-teal hover:text-white'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
              activeCategory === cat.name
                ? 'bg-teal border-teal text-white'
                : 'bg-white border-gray-200 text-navy hover:bg-teal hover:border-teal hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {filteredTours.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No tours in this category yet.</p>
      )}

      <div className="text-center mt-10">
        <Link
          href="#"
          className="inline-block border-2 border-teal text-teal font-semibold px-6 py-3 rounded-sm2 hover:bg-teal hover:text-white transition"
        >
          View All Destinations
        </Link>
      </div>
    </>
  );
}
