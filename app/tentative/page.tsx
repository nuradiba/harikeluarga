import { Camera, Clock3, Gift, Heart, Shirt, Sparkles, Ticket } from "lucide-react";

const dayTwoActivities = [
  { title: "Mami Jarum", icon: Shirt },
  { title: "Secret Gift", icon: Gift },
  { title: "Best Dress", icon: Sparkles },
  { title: "Lucky Draw", icon: Ticket },
  { title: "Bergambar ramai-ramai", icon: Camera },
];

export default function TentativePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-24 sm:px-10 lg:px-16">
      <section className="border-b-2 border-current pb-10 text-center">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-rose-500">HARI KELUARGA 2026</p>
        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">Tentatif</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed opacity-70 sm:text-lg">
Keluarga adalah rumah tempat kita kembali. Menyemarakkan rasa kasih, menghargai setiap detik bersama, dan meraikan ikatan yang takkan pernah putus. Kerana bersama keluarga, setiap momen itu berharga.        </p>
      </section>

      <section className="grid gap-0 border-b-2 border-current md:grid-cols-[190px_1fr]">
        <div className="border-b-2 border-current bg-rose-500 px-6 py-8 text-white md:border-b-0 md:border-r-2">
          <p className="text-sm font-bold tracking-widest">DAY 01</p>
          <h2 className="mt-2 text-3xl font-black">Malam</h2>
          <p className="mt-5 text-sm font-medium">Aktiviti pakaian ikut warna team</p>
        </div>

        <div className="px-1 py-8 sm:px-8">
          <div className="rounded-2xl border-2 border-current p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">Malam tema warna</span>
              <span className="text-2xl">🌈</span>
            </div>
            <h3 className="mt-4 text-2xl font-black sm:text-3xl">Bawa warna team kamu!</h3>
            <p className="mt-3 leading-relaxed opacity-75">
              Tak semestinya kena full outfit warna tu. Kreatif dengan tudung, baju, aksesori atau kasut pun boleh — yang penting nampak warna team masing-masing. Lagi kreatif, lagi best!
            </p>

            <div className="mt-6 border-l-4 border-rose-500 bg-rose-50 p-5 text-black dark:bg-rose-950 dark:text-white">
              <div className="flex gap-3">
                <Gift className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
                <div>
                  <h4 className="font-bold">Goodies ikut warna masing-masing</h4>
                  <p className="mt-1 text-sm leading-relaxed opacity-80">
                    Bawa <strong>23 set</strong> untuk semua ahli keluarga. Tak perlu mahal — sweets, chocolates, snacks, stationery atau apa-apa yang sesuai pun okay. Asalkan ikut warna dan boleh share dengan semua.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm font-semibold">Kita tengok team mana paling sporting &amp; kreatif! 😂🌈</p>
          </div>
        </div>
      </section>

      <section className="grid gap-0 border-b-2 border-current md:grid-cols-[190px_1fr]">
        <div className="border-b-2 border-current bg-sky-500 px-6 py-8 text-white md:border-b-0 md:border-r-2">
          <p className="text-sm font-bold tracking-widest">DAY 02</p>
          <h2 className="mt-2 text-3xl font-black">9.00 pagi</h2>
          <p className="mt-5 text-sm font-medium">Games, hadiah &amp; memori bersama</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {dayTwoActivities.map(({ title, icon: Icon }, index) => (
            <div key={title} className="flex min-h-36 flex-col justify-between border-b-2 border-current p-6 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
              <span className="text-sm font-bold opacity-45">0{index + 1}</span>
              <div className="mt-5 flex items-center gap-3">
                <Icon className="size-6 text-sky-500" aria-hidden="true" />
                <h3 className="text-lg font-bold">{title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 py-10 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl bg-amber-300 p-5 text-black">
          <Clock3 className="size-7 shrink-0" aria-hidden="true" />
          <div><p className="text-xs font-bold tracking-wider">BREAKFAST</p><p className="text-xl font-black">7.30 pagi</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border-2 border-current p-5">
          <Clock3 className="size-7 shrink-0 text-rose-500" aria-hidden="true" />
          <div><p className="text-xs font-bold tracking-wider opacity-60">CHECKOUT</p><p className="text-xl font-black">12 tengah hari</p></div>
        </div>
      </section>
    </main>
  );
}
