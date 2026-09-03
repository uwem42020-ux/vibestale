import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

        <Footer />

        <BottomNav />
        <PlayerBar />
      </div>
    </AudioProvider>
  );
}