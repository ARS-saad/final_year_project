'use client';

export default function HeroSearchBar() {
  return (
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
  );
}
