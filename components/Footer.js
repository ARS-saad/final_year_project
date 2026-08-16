import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy text-[#A3B1C1] pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-10">
          <div>
            <div className="font-heading font-bold text-xl text-white mb-3">
              Flora<span className="text-teal">Flyers</span>
            </div>
            <p className="text-sm max-w-xs">
              Making trip planning simple, smart, and affordable for everyone.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <Link href="#" className="block text-sm mb-2.5 hover:text-teal transition">About Us</Link>
            <Link href="#" className="block text-sm mb-2.5 hover:text-teal transition">Careers</Link>
            <Link href="#" className="block text-sm mb-2.5 hover:text-teal transition">Blog</Link>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Support</h4>
            <Link href="#" className="block text-sm mb-2.5 hover:text-teal transition">Contact Us</Link>
            <Link href="#" className="block text-sm mb-2.5 hover:text-teal transition">FAQs</Link>
            <Link href="#" className="block text-sm mb-2.5 hover:text-teal transition">Cancellation Policy</Link>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <Link href="#" className="block text-sm mb-2.5 hover:text-teal transition">Terms of Service</Link>
            <Link href="#" className="block text-sm mb-2.5 hover:text-teal transition">Privacy Policy</Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-sm text-[#718096]">
          © 2026 Floraflyers. Final Year BSc Project — For academic demonstration purposes only.
        </div>
      </div>
    </footer>
  );
}
