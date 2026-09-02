'use client';

import { useState, useRef, useEffect } from 'react';

interface ShareMenuProps {
  title: string;
  url: string;
}

export default function ShareMenu({ title, url }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareText = `${title}\n\nRead more on VibeStale: ${url}\n\n#VibeStale #NigeriaNews`;

  const links = [
    {
      name: 'WhatsApp',
      icon: '💬',
      href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      color: 'bg-green-600',
    },
    {
      name: 'Facebook',
      icon: '📘',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-blue-600',
    },
    {
      name: 'Twitter/X',
      icon: '🐦',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      color: 'bg-black',
    },
    {
      name: 'Telegram',
      icon: '✈️',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-sky-500',
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 text-gray-300 hover:text-white transition"
        aria-label="Share"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-700 transition"
              onClick={() => setOpen(false)}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${link.color}`}>
                {link.icon}
              </span>
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}