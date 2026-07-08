'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { tours } from '@/lib/tours';

export default function CheckoutPage() {
  const [travelers, setTravelers] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Demo: checkout for the first tour. In production, pass the selected tour id via route/query params.
  const tour = tours[0];
  const total = tour.price * travelers;
  const serviceFee = 25;
  const grandTotal = total + serviceFee;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href={`/tours/${tour.id}`} className="text-sm text-teal-hover font-semibold hover:underline">
          ← Back to tour details
        </Link>
        <h1 className="font-heading text-3xl font-bold mt-3">Checkout</h1>
        <p className="text-gray-500 text-sm mt-1">Complete your booking in a few quick steps.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* LEFT: Forms */}
        <div className="space-y-8">

          {/* Traveler details */}
          <section className="bg-white border border-gray-200 rounded-md2 p-6">
            <h2 className="font-heading text-lg font-bold mb-5">Traveler Details</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">First Name</label>
                  <input
                    type="text"
                    placeholder="Jamal"
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="Uddin"
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Number of Travelers</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full sm:w-48 px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </form>
          </section>

          {/* Payment method */}
          <section className="bg-white border border-gray-200 rounded-md2 p-6">
            <h2 className="font-heading text-lg font-bold mb-5">Payment Method</h2>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-sm2 py-3 text-sm font-semibold transition ${
                  paymentMethod === 'card' ? 'border-teal text-teal-hover bg-alert-success-bg' : 'border-gray-200 text-gray-500'
                }`}
              >
                💳 Credit / Debit Card
              </button>
              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-sm2 py-3 text-sm font-semibold transition ${
                  paymentMethod === 'mobile' ? 'border-teal text-teal-hover bg-alert-success-bg' : 'border-gray-200 text-gray-500'
                }`}
              >
                📱 Mobile Banking
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1.5">Card Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm font-mono outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Jamal Uddin"
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm font-mono outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">CVC</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="123"
                      className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm font-mono outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex gap-3">
                {['bKash', 'Nagad', 'Rocket'].map((m) => (
                  <button
                    key={m}
                    className="flex-1 border border-gray-200 rounded-sm2 py-3 text-sm font-semibold text-gray-600 hover:border-teal hover:text-teal-hover transition"
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2.5 bg-alert-info-bg text-alert-info-text border-l-4 border-teal-hover rounded-sm2 px-4 py-3 text-sm mt-6">
              <span>ℹ</span>
              <div>Demo checkout — no real payment will be processed.</div>
            </div>
          </section>
        </div>

        {/* RIGHT: Order summary */}
        <div>
          <div className="sticky top-24 bg-white border border-gray-200 rounded-md2 shadow-card overflow-hidden">
            <div className="relative h-36 w-full">
              <Image src={tour.image} alt={tour.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className="font-semibold mb-1">{tour.title}</div>
              <div className="text-sm text-gray-500 mb-5">📅 {tour.days} Days &nbsp;•&nbsp; 📍 {tour.country}</div>

              <div className="space-y-2.5 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>${tour.price} × {travelers} traveler{travelers > 1 ? 's' : ''}</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-lg border-t border-gray-100 mt-4 pt-4">
                <span>Total</span>
                <span className="text-coral">${grandTotal}</span>
              </div>

              <button className="w-full bg-teal text-white font-semibold py-3.5 rounded-sm2 hover:bg-teal-hover transition mt-6">
                Confirm & Pay
              </button>

              <div className="text-center text-xs text-gray-400 mt-3">
                🔒 Secured with 256-bit encryption
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
