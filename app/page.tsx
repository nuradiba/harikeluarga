"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
  const targetTime = useMemo(() => new Date("2026-09-03T23:59:59").getTime(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetTime));

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
            <span>20B</span>
            <span>2026</span>
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

        <div className="text-sm flex items-center gap-1 mb-18">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" >
            <path d="M12.88 2.53c-.35-.66-1.42-.66-1.77 0l-8.99 17c-.16.31-.15.68.03.98s.51.48.86.48h18c.35 0 .68-.18.86-.48s.19-.67.03-.98zM12 5.13l3.07 5.81-1.07.81-1.4-1.05a.99.99 0 0 0-1.2 0L10 11.75l-1.07-.81zM4.66 18.99l3.32-6.27 1.42 1.07c.36.27.84.27 1.2 0l1.4-1.05 1.4 1.05c.18.13.39.2.6.2s.42-.07.6-.2l1.42-1.07 3.32 6.27z"></path>
          </svg>
          <span>Jerai Triangle House, Yan, Kedah</span>
        </div>

        <div className="flex gap-5">
          <Link href="/secretsanta" className="btn btn-dash">
            Secret Santa
          </Link>
        </div>

      </main>
    </div>
  );
}
