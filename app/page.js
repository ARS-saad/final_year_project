"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { tours, categories, testimonials } from "@/lib/tours";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        className="text-center text-white px-5 pt-28 pb-32"
        style={{
          backgroundImage:
            "linear-gradient(rgba(29,45,68,0.72), rgba(2,128,144,0.55)), url('https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span className="inline-block bg-white/15 border border-white/30 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 backdrop-blur-sm">
          ✨ AI-Assisted Trip Planning
        </span>
        <h1 className="font-heading font-extrabold text-3xl md:text-5xl max-w-3xl mx-auto mb-4 leading-tight">
          Discover Your Next Adventure, Effortlessly
        </h1>
        <p className="text-[#E4EAF0] text-lg max-w-xl mx-auto mb-9">
          Search thousands of curated tours, compare prices instantly, and book
          your dream trip in minutes.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white rounded-full pl-6 pr-1.5 py-1.5 max-w-xl mx-auto flex items-center gap-3 shadow-2xl"
        >
          <div className="flex items-center gap-2 flex-1 text-left text-gray-500">
            <span>🔍</span>
            <input
              type="text"
              placeholder='Try: "5 days in Kyoto under $1500"'
              className="w-full outline-none text-navy text-sm bg-transparent py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-coral text-white font-semibold text-sm px-7 py-3 rounded-full hover:brightness-90 transition whitespace-nowrap"
          >
            Search
          </button>
        </form>

        <div className="flex justify-center gap-12 mt-12 flex-wrap">
          <div>
            <div className="font-mono text-2xl font-bold">12,400+</div>
            <div className="text-sm text-[#C9D4DF]">Happy Travelers</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold">180+</div>
            <div className="text-sm text-[#C9D4DF]">Destinations</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold">4.8 / 5</div>
            <div className="text-sm text-[#C9D4DF]">Average Rating</div>
          </div>
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section id="packages" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-lg mx-auto mb-11">
            <span className="block font-mono text-teal-hover text-xs font-semibold uppercase tracking-wide mb-2">
              Handpicked For You
            </span>
            <h2 className="font-heading font-bold text-3xl mb-3">
              Featured Tour Packages
            </h2>
            <p className="text-gray-500">
              Popular trips our travelers are booking right now.
            </p>
          </div>

          <div className="flex gap-3 justify-center flex-wrap mb-11">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
                  activeCategory === cat
                    ? "bg-teal border-teal text-white"
                    : "bg-white border-gray-200 text-navy hover:bg-teal hover:border-teal hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="#"
              className="inline-block border-2 border-teal text-teal font-semibold px-6 py-3 rounded-sm2 hover:bg-teal hover:text-white transition"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="about" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-lg mx-auto mb-11">
            <span className="block font-mono text-teal-hover text-xs font-semibold uppercase tracking-wide mb-2">
              Why Floraflyers
            </span>
            <h2 className="font-heading font-bold text-3xl mb-3">
              Travel Planning Made Simple
            </h2>
            <p className="text-gray-500">
              Everything you need for a stress-free trip, in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "✨",
                title: "AI Trip Matching",
                text: "Tell us your budget and dates — our AI finds the best-fit packages instantly.",
              },
              {
                icon: "🔒",
                title: "Secure Booking",
                text: "Your payments and data are protected with industry-standard encryption.",
              },
              {
                icon: "💬",
                title: "24/7 Support",
                text: "Our travel experts are available around the clock before and during your trip.",
              },
              {
                icon: "💰",
                title: "Best Price Guarantee",
                text: "Found it cheaper elsewhere? We'll match the price, no questions asked.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-5">
                <div className="w-16 h-16 bg-alert-success-bg rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI BANNER */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-navy rounded-md2 p-10 md:p-12 flex items-center justify-between gap-8 flex-wrap text-white">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-2.5">
                Let AI plan your perfect itinerary
              </h2>
              <p className="text-[#A3B1C1] max-w-md">
                Just describe your trip in plain language and get a custom plan
                back in seconds. Try{" "}
                <code className="font-mono bg-white/10 px-2 py-0.5 rounded text-[#7FE3D6] text-sm">
                  &quot;7 days in Thailand, budget $900&quot;
                </code>
                .
              </p>
            </div>
            <Link
              href="/chat"
              className="bg-teal text-white font-semibold px-6 py-3 rounded-sm2 hover:bg-teal-hover transition"
            >
              Try Smart Planner ✨
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-lg mx-auto mb-11">
            <span className="block font-mono text-teal-hover text-xs font-semibold uppercase tracking-wide mb-2">
              Testimonials
            </span>
            <h2 className="font-heading font-bold text-3xl">
              What Our Travelers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-md2 p-7 border border-gray-200"
              >
                <div className="text-amber-400 mb-3.5 text-sm">
                  {"★".repeat(t.stars)}
                  {"☆".repeat(5 - t.stars)}
                </div>
                <p className="text-gray-600 text-sm mb-5">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-[42px] h-[42px] rounded-full bg-teal text-white flex items-center justify-center font-heading font-bold flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER ALERT */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto flex gap-3.5 bg-alert-success-bg text-alert-success-text border-l-4 border-teal rounded-sm2 px-5 py-4 text-sm">
            <div className="text-xl leading-none">✓</div>
            <div>
              <div className="font-bold mb-0.5">
                Get exclusive deals in your inbox
              </div>
              Subscribe to our newsletter and receive a 10% discount code on
              your first booking.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
