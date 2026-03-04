"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header({ children, currentYear }: { children: React.ReactNode; currentYear: number }) {
  const [isLight, setIsLight] = useState(true);

  return (
    <div
      className={`relative min-h-screen transition-colors ${isLight ? "theme-light bg-white text-black" : "theme-dark bg-black text-white"
        }`}
    >
      <Link href="/" className="fixed left-4 top-4 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          className="h-8 w-8 fill-current" viewBox="0 0 24 24" >
          <path d="M12.71 2.29a.996.996 0 0 0-1.41 0l-8.01 8A1 1 0 0 0 3 11v9c0 1.1.9 2 2 2h4c.55 0 1-.45 1-1v-6h4v6c0 .55.45 1 1 1h4c1.1 0 2-.9 2-2v-9c0-.27-.11-.52-.29-.71zM16 20v-5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v5H5v-8.59l7-7 7 7V20z"></path>
        </svg>
      </Link>

      <label className="swap swap-rotate fixed right-4 top-4 z-50">
        <input
          type="checkbox"
          checked={isLight}
          onChange={(event) => setIsLight(event.target.checked)}
          aria-label="Toggle page theme"
        />

        <svg className="swap-off h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>

        <svg className="swap-on h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
      </label>

      {children}

      <footer className="text-center text-xs py-4">
        &copy; {currentYear} BLOKESHADE <br /> Made with ❤️ by Adiba
      </footer>
    </div>
  );
}
