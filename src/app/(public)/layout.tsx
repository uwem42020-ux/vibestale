import Header from '@/components/Header';
import BottomNav from '@/components/navigation/BottomNav';
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
        <Header />

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