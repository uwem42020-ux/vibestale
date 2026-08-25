import Link from 'next/link';
import BottomNav from '@/components/navigation/BottomNav';
import LiveClock from '@/components/LiveClock';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-700">
            VibeStale
          </Link>
          <div className="flex items-center gap-3">
            <LiveClock />
            <nav className="hidden md:flex space-x-4 text-sm">
              <Link href="/" className="hover:text-green-700">Home</Link>
              <Link href="/category/general" className="hover:text-green-700">General</Link>
              <Link href="/category/tech" className="hover:text-green-700">Tech</Link>
              <Link href="/category/business" className="hover:text-green-700">Business</Link>
              <Link href="/category/sports" className="hover:text-green-700">Sports</Link>
              <Link href="/category/entertainment" className="hover:text-green-700">Entertainment</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500 hidden md:block">
        <p>© {new Date().getFullYear()} VibeStale — AI-powered Nigerian news intelligence</p>
      </footer>

      <BottomNav />
    </div>
  );
}