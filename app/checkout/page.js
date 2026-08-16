'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const tourId = searchParams.get('tour');

  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [travelers, setTravelers] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadTour() {
      if (!tourId) {
        setLoadingTour(false);
        return;
      }
      const { data } = await supabase.from('tours').select('*').eq('id', tourId).single();
      setTour(data);
      setLoadingTour(false);
    }
    loadTour();
  }, [tourId, supabase]);

  const serviceFee = 25;
  const total = tour ? tour.price * travelers : 0;
  const grandTotal = total + serviceFee;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');

    if (!tour) {
      setError('No tour selected. Go back and pick a tour first.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?redirect=/checkout?tour=${tourId}`);
      return;
    }

    setSubmitting(true);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        tour_id: tour.id,
        traveler_first_name: firstName,
        traveler_last_name: lastName,
        traveler_email: email,
        traveler_phone: phone,
        travelers_count: travelers,
        departure_date: departureDate || null,
        status: 'pending',
        total_amount: grandTotal,
      })
      .select()
      .single();

    if (bookingError) {
      setSubmitting(false);
      setError(bookingError.message);
      return;
    }

    // Demo payment record — in production this insert (and the status flip
    // to 'success') should happen server-side after a real payment provider
    // confirms the charge, not directly from the client.
    await supabase.from('payments').insert({
      booking_id: booking.id,
      amount: grandTotal,
      method: paymentMethod,
      status: 'pending',
    });

    setSubmitting(false);
    setSuccess(true);
  };

  if (loadingTour) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-24 text-center text-gray-500">Loading…</div>
        <Footer />
      </>
    );
  }

  if (!tour) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-gray-500 mb-4">No tour selected for checkout.</p>
          <Link href="/#packages" className="text-teal-hover font-semibold hover:underline">
            ← Browse tours
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 bg-alert-success-bg text-alert-success-text rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✓
          </div>
          <h1 className="font-heading text-2xl font-bold mb-3">Booking received!</h1>
          <p className="text-gray-500 text-sm mb-8">
            Your booking for {tour.title} is pending confirmation. We&apos;ve saved your details — check your
            account for updates.
          </p>
          <Link
            href="/"
            className="inline-block bg-teal text-white font-semibold px-6 py-3 rounded-sm2 hover:bg-teal-hover transition"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

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

      <form onSubmit={handleConfirm} className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* LEFT: Forms */}
        <div className="space-y-8">

          {/* Traveler details */}
          <section className="bg-white border border-gray-200 rounded-md2 p-6">
            <h2 className="font-heading text-lg font-bold mb-5">Traveler Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jamal"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Number of Travelers</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section className="bg-white border border-gray-200 rounded-md2 p-6">
            <h2 className="font-heading text-lg font-bold mb-5">Payment Method</h2>

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-sm2 py-3 text-sm font-semibold transition ${
                  paymentMethod === 'card' ? 'border-teal text-teal-hover bg-alert-success-bg' : 'border-gray-200 text-gray-500'
                }`}
              >
                💳 Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile_banking')}
                className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-sm2 py-3 text-sm font-semibold transition ${
                  paymentMethod === 'mobile_banking' ? 'border-teal text-teal-hover bg-alert-success-bg' : 'border-gray-200 text-gray-500'
                }`}
              >
                📱 Mobile Banking
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div>
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
              </div>
            ) : (
              <div className="flex gap-3">
                {['bKash', 'Nagad', 'Rocket'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="flex-1 border border-gray-200 rounded-sm2 py-3 text-sm font-semibold text-gray-600 hover:border-teal hover:text-teal-hover transition"
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2.5 bg-alert-info-bg text-alert-info-text border-l-4 border-teal-hover rounded-sm2 px-4 py-3 text-sm mt-6">
              <span>ℹ</span>
              <div>Demo checkout — no real payment will be processed. Card fields above aren&apos;t saved.</div>
            </div>

            {error && (
              <div className="flex gap-2.5 bg-alert-error-bg text-alert-error-text border-l-4 border-red-400 rounded-sm2 px-4 py-3 text-sm mt-4">
                <span>⚠</span>
                <div>{error}</div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: Order summary */}
        <div>
          <div className="sticky top-24 bg-white border border-gray-200 rounded-md2 shadow-card overflow-hidden">
            <div className="relative h-36 w-full">
              <Image src={tour.image_url} alt={tour.title} fill className="object-cover" />
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal text-white font-semibold py-3.5 rounded-sm2 hover:bg-teal-hover transition mt-6 disabled:opacity-60"
              >
                {submitting ? 'Processing…' : 'Confirm & Pay'}
              </button>

              <div className="text-center text-xs text-gray-400 mt-3">
                🔒 Secured with 256-bit encryption
              </div>
            </div>
          </div>
        </div>
      </form>

      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-6 py-24 text-center text-gray-500">Loading…</div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
