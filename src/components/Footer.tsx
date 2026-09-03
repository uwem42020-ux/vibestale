import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/whitelogo.png"
              alt="VibeStale"
              className="h-8 w-auto mb-3"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered Nigerian news, music, movies, and media.
            </p>
          </div>

          {/* Headlines */}
          <div>
            <h3 className="text-white font-semibold mb-3">Headlines</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/category/general" className="hover:text-white">General</Link></li>
              <li><Link href="/category/politics" className="hover:text-white">Politics</Link></li>
              <li><Link href="/category/business" className="hover:text-white">Business</Link></li>
              <li><Link href="/category/sports" className="hover:text-white">Sports</Link></li>
              <li><Link href="/category/tech" className="hover:text-white">Tech</Link></li>
              <li><Link href="/category/entertainment" className="hover:text-white">Entertainment</Link></li>
            </ul>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-white font-semibold mb-3">Media</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/music" className="hover:text-white">Music</Link></li>
              <li><Link href="/music-videos" className="hover:text-white">Music Videos</Link></li>
              <li><Link href="/music-news" className="hover:text-white">Celebrity News</Link></li>
              <li><Link href="/movies" className="hover:text-white">Movies</Link></li>
              <li><Link href="/live-tv" className="hover:text-white">Live TV</Link></li>
              <li><Link href="/memes" className="hover:text-white">Memes</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li>
                <a
                  href="https://wa.me/2348038887589"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Advertise
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2348038887589"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>© {year} VibeStale — AI-powered Nigerian news intelligence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}