// src/components/header.tsx
import Link from 'next/link';
import { FileDown } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b shadow-sm bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <FileDown size={24} className="text-primary" />
          <span className="font-bold text-xl">Web2Markdown</span>
        </Link>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-sm font-medium hover:text-primary">
                ホーム
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/yhayano-ponotech/webtomark-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}