export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightbg px-6">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-teal border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">✈</div>
        </div>
        <div className="font-heading font-bold text-lg text-navy mb-1">
          Flora<span className="text-teal">Flyers</span>
        </div>
        <p className="text-gray-500 text-sm">Loading your next adventure…</p>
      </div>
    </div>
  );
}
