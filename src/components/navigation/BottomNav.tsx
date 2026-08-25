'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/category/general', label: 'General', icon: '📰' },
    { href: '/category/tech', label: 'Tech', icon: '💻' },
    { href: '/category/sports', label: 'Sports', icon: '⚽' },
    { href: '/category/entertainment', label: 'Entertainment', icon: '🎬' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center text-xs ${
                isActive ? 'text-green-700 font-semibold' : 'text-gray-500'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}