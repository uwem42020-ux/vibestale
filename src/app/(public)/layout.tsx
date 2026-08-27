import Link from 'next/link';
import BottomNav from '@/components/navigation/BottomNav';
import LiveClock from '@/components/LiveClock';
import { AudioProvider } from '@/components/music/AudioProvider';
import PlayerBar from '@/components/music/PlayerBar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col bg-black">
        <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-500">
              VibeStale
            </Link>
            <div className="flex items-center gap-3">
              <LiveClock />
              <nav className="hidden md:flex space-x-4 text-sm">
                <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
                <Link href="/category/general" className="text-gray-300 hover:text-white">General</Link>
                <Link href="/category/tech" className="text-gray-300 hover:text-white">Tech</Link>
                <Link href="/category/business" className="text-gray-300 hover:text-white">Business</Link>
                <Link href="/category/sports" className="text-gray-300 hover:text-white">Sports</Link>
                <Link href="/category/entertainment" className="text-gray-300 hover:text-white">Entertainment</Link>
                <Link href="/media" className="text-gray-300 hover:text-white">Media</Link>
                <Link href="/music" className="text-gray-300 hover:text-white">Music</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24 md:pb-6">
          {children}
        </main>

        <footer className="bg-black border-t border-gray-800 py-4 text-center text-sm text-gray-400 hidden md:block">
          <p>© {new Date().getFullYear()} VibeStale — AI-powered Nigerian news intelligence</p>
        </footer>

        <BottomNav />
        <PlayerBar />
      </div>
    </AudioProvider>
  );
}