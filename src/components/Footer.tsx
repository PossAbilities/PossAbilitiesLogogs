import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto py-8 text-center glass border-t-0 border-x-0 rounded-t-3xl" aria-label="Footer Navigation">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        <p className="text-lg font-medium">PossAbilities Portal - Making life better</p>
        <div className="flex flex-wrap justify-center gap-6 easy-read-text font-bold text-blue-700">
          <Link href="/whistleblowing" className="hover:underline focus-visible:outline-blue-500 rounded-md px-2 py-1">
            Whistleblowing
          </Link>
          <Link href="/compliments-complaints" className="hover:underline focus-visible:outline-blue-500 rounded-md px-2 py-1">
            Compliments & Complaints
          </Link>
          <Link href="/terms-of-use" className="hover:underline focus-visible:outline-blue-500 rounded-md px-2 py-1">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
