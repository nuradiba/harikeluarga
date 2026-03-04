"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MorphingText } from "@/components/ui/morphing-text"
import { ShinyButton } from "@/components/ui/shiny-button"
import Image from "next/image"
import confetti from "canvas-confetti"
import { HyperText } from "@/components/ui/hyper-text"

type FamilyMember = {
  id: number | string;
  name: string;
  secret_santa?: string | null;
};

export default function SecretSantaPage() {
  const [data, setData] = useState<FamilyMember[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | string | null>(null);
  const [revealedName, setRevealedName] = useState("");

  const openModal = (memberId: number | string) => {
    setSelectedMemberId(memberId);
    setRevealedName("");
    setRevealed(false);
    const modal = document.getElementById("ss_modal") as HTMLDialogElement | null;
    modal?.showModal();
  };

  useEffect(() => {
    async function fetchData() {
      const { data: familyData, error } = await supabase
        .from("family")
        .select("id,name,secret_santa,year");

      if (error) {
        console.log(error);
      } else {
        setData((familyData ?? []) as FamilyMember[]);
      }
    }

    fetchData();
  }, []);

  const handleClick = () => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]
    const frame = () => {
      if (Date.now() > end) return
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })
      requestAnimationFrame(frame)
    }
    frame()
  }

  const handleReveal = async () => {
    if (selectedMemberId === null) return;

    const candidates = data.filter((person) => person.id !== selectedMemberId);
    if (candidates.length === 0) return;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const assignedSecretSanta = candidates[randomIndex].name;

    const { error } = await supabase
      .from("family")
      .update({ secret_santa: assignedSecretSanta, year: new Date().getFullYear() })
      .eq("id", selectedMemberId);

    if (error) {
      console.log(error);
      return;
    }

    setData((prev) =>
      prev.map((person) =>
        person.id === selectedMemberId
          ? { ...person, secret_santa: assignedSecretSanta, year: new Date().getFullYear() }
          : person
      )
    );
    setRevealedName(assignedSecretSanta);
    setRevealed(true);
    handleClick();
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-16 py-32">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            <MorphingText texts={["Secret", "Santa"]} />
          </h1>
          <p className="mt-4 text-lg ss-text">
            A fun way to randomly assign Secret Santas for your family or group of friends. Click the eye icon to reveal your assigned Secret Santa!
          </p>
        </div>
        <div className="ss-table-card overflow-x-auto rounded-box border">
          <table className="ss-table table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Let&apos;s do this!</th>
              </tr>
            </thead>
            <tbody>
              {data.map((person, index) => (
                <tr key={person.id}>
                  <th>{index + 1}</th>
                  <td>{person.name}</td>
                  <td className="flex items-center justify-center">
                    {person.secret_santa ? (
                      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                        <path d="M6 22h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v2H9zm-3 4h12v9H6z"></path>
                      </svg>
                    ) : (
                      <div onClick={() => openModal(person.id)}>
                        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                          <path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6"></path>
                          <path d="M12 19c7.63 0 9.93-6.62 9.95-6.68.07-.21.07-.43 0-.63-.02-.07-2.32-6.68-9.95-6.68s-9.93 6.61-9.95 6.67c-.07.21-.07.43 0 .63.02.07 2.32 6.68 9.95 6.68Zm0-12c5.35 0 7.42 3.85 7.93 5-.5 1.16-2.58 5-7.93 5s-7.42-3.84-7.93-5c.5-1.16 2.58-5 7.93-5"></path>
                        </svg>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dialog id="ss_modal" className="modal ss-modal">
          <div className="modal-box ss-modal-box relative">
            <form method="dialog" className="absolute right-3 top-3">
              <button className="btn ss-modal-close btn-sm">X</button>
            </form>
            <div className="py-4">
              {revealed ? (
                <div className="text-center">
                  <HyperText duration={1000}>{revealedName}</HyperText>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <Image src="/cat-no-bg.gif" alt="Cat" width={180} height={180} />
                  <ShinyButton className="btn-lg mt-5" onClick={handleReveal}>
                    Reveal Your Secret Santa!
                  </ShinyButton>
                </div>
              )}
            </div>
          </div>
        </dialog>

      </main>
    </div>
  );
}
