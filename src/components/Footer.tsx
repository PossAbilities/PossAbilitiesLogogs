import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto py-4 backdrop-blur-md bg-white/10 border-t border-white/20" aria-label="Footer Navigation">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs tracking-widest text-slate-800">
        <p className="font-semibold uppercase">&copy; {new Date().getFullYear()} PossAbilities</p>
        <div className="flex flex-wrap justify-center gap-6 font-bold uppercase">
          <Link href="/whistleblowing" className="hover:text-blue-700 transition-colors focus-visible:outline-blue-500 rounded-md">
            Whistleblowing
          </Link>
          <Link href="/compliments-complaints" className="hover:text-blue-700 transition-colors focus-visible:outline-blue-500 rounded-md">
            Compliments & Complaints
          </Link>
          <Link href="/terms-of-use" className="hover:text-blue-700 transition-colors focus-visible:outline-blue-500 rounded-md">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
