"use client";

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Highlighter } from "@/components/ui/highlighter"
import Image from "next/image"

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetTime: number): TimeLeft {
  const now = Date.now();
  const diff = Math.max(targetTime - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function Home() {
  // Change this to your own event date/time.
  const targetTime = useMemo(() => new Date("2026-10-02T23:59:59").getTime(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isThemeImageOpen, setIsThemeImageOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetTime));
    }, 1000);

    return () => clearInterval(id);
  }, [targetTime]);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-16 py-32">

        <span className="text-rotate text-6xl mb-5">
          <span className="justify-items-center">
            <span>HARI</span>
            <span>KELUARGA</span>
            <span>{new Date().getFullYear()}</span>
          </span>
        </span>

        <div className="flex gap-5 mb-5">
          <div>
            <span className="countdown font-mono text-4xl">
              <span
                style={{ "--value": timeLeft.days } as React.CSSProperties}
                aria-live="polite"
                aria-label={String(timeLeft.days)}
              >
                {timeLeft.days}
              </span>
            </span>
            hari
          </div>
          <div>
            <span className="countdown font-mono text-4xl">
              <span
                style={{ "--value": timeLeft.hours } as React.CSSProperties}
                aria-live="polite"
                aria-label={String(timeLeft.hours)}
              >
                {timeLeft.hours}
              </span>
            </span>
            jam
          </div>
          <div>
            <span className="countdown font-mono text-4xl">
              <span
                style={{ "--value": timeLeft.minutes } as React.CSSProperties}
                aria-live="polite"
                aria-label={String(timeLeft.minutes)}
              >
                {timeLeft.minutes}
              </span>
            </span>
            min
          </div>
          <div>
            <span className="countdown font-mono text-4xl">
              <span
                style={{ "--value": timeLeft.seconds } as React.CSSProperties}
                aria-live="polite"
                aria-label={String(timeLeft.seconds)}
              >
                {timeLeft.seconds}
              </span>
            </span>
            saat
          </div>
        </div>

        <div className="text-sm flex items-center gap-1">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" >
            <path d="M12.88 2.53c-.35-.66-1.42-.66-1.77 0l-8.99 17c-.16.31-.15.68.03.98s.51.48.86.48h18c.35 0 .68-.18.86-.48s.19-.67.03-.98zM12 5.13l3.07 5.81-1.07.81-1.4-1.05a.99.99 0 0 0-1.2 0L10 11.75l-1.07-.81zM4.66 18.99l3.32-6.27 1.42 1.07c.36.27.84.27 1.2 0l1.4-1.05 1.4 1.05c.18.13.39.2.6.2s.42-.07.6-.2l1.42-1.07 3.32 6.27z"></path>
          </svg>
          <span>Jerai Triangle House, Yan, Kedah</span>
        </div>

        <div className="text-sm flex items-center gap-1 mb-5">
          <span>3 - 4 Oktober 2026</span>
        </div>

        <div className="text-sm flex items-center mb-1">
          <span>Tema:&nbsp;&nbsp;<Highlighter action="highlight" color="#87CEFA">Mami Jarum</Highlighter></span>
        </div>

        <button
          type="button"
          className="cursor-zoom-in"
          onClick={() => setIsThemeImageOpen(true)}
          aria-label="Lihat gambar tema Mami Jarum dalam saiz penuh"
        >
          <Image alt="Mami Jarum" src="/tema.jpg" width={100} height={0} className="h-auto" />
        </button>

        {isThemeImageOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Gambar tema Mami Jarum"
            onClick={() => setIsThemeImageOpen(false)}
          >
            <div className="relative h-[90vh] w-[95vw]" onClick={(event) => event.stopPropagation()}>
              <Image
                alt="Mami Jarum"
                src="/tema.jpg"
                fill
                sizes="95vw"
                className="object-contain"
              />
              <button
                type="button"
                className="btn btn-circle btn-sm absolute right-2 top-2"
                onClick={() => setIsThemeImageOpen(false)}
                aria-label="Tutup gambar"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-5 mt-10">
          <Link href="/secretsanta" className="relative">
            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
            <span className="text-lg whitespace-nowrap fold-bold relative inline-block h-full w-full rounded border border-black bg-white px-3 py-1 font-bold text-black transition duration-100 hover:bg-rose-600 hover:text-zinc-50">Secret Santa</span>
          </Link>

          <Link href="/goodies" className="relative">
            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
            <span className="text-lg whitespace-nowrap fold-bold relative inline-block h-full w-full rounded border border-black bg-white px-3 py-1 font-bold text-black transition duration-100 hover:bg-amber-600 hover:text-zinc-50">Goodies</span>
          </Link>

           <Link href="/saizbaju" className="relative">
            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
            <span className="text-lg whitespace-nowrap fold-bold relative inline-block h-full w-full rounded border border-black bg-white px-3 py-1 font-bold text-black transition duration-100 hover:bg-fuchsia-600 hover:text-zinc-50">Saiz Baju</span>
          </Link>

          <Link href="/arrangementrumah" className="relative">
            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
            <span className="text-lg whitespace-nowrap fold-bold relative inline-block h-full w-full rounded border border-black bg-white px-3 py-1 font-bold text-black transition duration-100 hover:bg-emerald-600 hover:text-zinc-50">Arrangement Rumah</span>
          </Link>
        </div>

      </main>
    </div>
  );
}
