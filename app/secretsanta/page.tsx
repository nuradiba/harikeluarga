"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { MorphingText } from "@/components/ui/morphing-text"
import { ShinyButton } from "@/components/ui/shiny-button"
import Image from "next/image"
import confetti from "canvas-confetti"
import { HyperText } from "@/components/ui/hyper-text"
import { SparklesText } from "@/components/ui/sparkles-text"

type FamilyMember = {
  id: number | string;
  name: string;
  secret_santa?: string | null;
  wishlist?: string | null;
};

export default function SecretSantaPage() {
  const [data, setData] = useState<FamilyMember[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | string | null>(null);
  const [revealedName, setRevealedName] = useState("");
  const [wishlistText, setWishlistText] = useState<string | null>(null);
  const [wishlists, setWishlists] = useState<Record<string, string | null>>({});
  const [isEditingWishlist, setIsEditingWishlist] = useState(true);
  const hasSavedWishlist = wishlistText !== null && wishlistText.trim() !== "";

  const openModal = (memberId: number | string) => {
    setSelectedMemberId(memberId);
    setRevealedName("");
    setRevealed(false);
    const modal = document.getElementById("ss_modal") as HTMLDialogElement | null;
    modal?.showModal();
  };

  const openWishList = (memberId: number | string) => {
    setSelectedMemberId(memberId);
    const selectedMember = data.find((person) => person.id === memberId);
    const currentWishlist = selectedMember?.wishlist ?? wishlists[String(memberId)] ?? null;
    setWishlistText(currentWishlist);
    setIsEditingWishlist(currentWishlist === null || currentWishlist.trim() === "");
    const modal = document.getElementById("wishlist_modal") as HTMLDialogElement | null;
    modal?.showModal();
  };

  useEffect(() => {
    async function fetchData() {
      const { data: familyData, error } = await supabase
        .from("family")
        .select("id,name,secret_santa,year,wishlist")
        .eq("is_secret_santa", true);

      if (error) {
        console.log(error);
      } else {
        const formattedData = (familyData ?? []) as FamilyMember[];

        setData(formattedData);
        setWishlists(
          formattedData.reduce<Record<string, string | null>>((acc, person) => {
            acc[String(person.id)] = person.wishlist ?? null;
            return acc;
          }, {})
        );
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

    const selectedMember = data.find((person) => person.id === selectedMemberId);
    if (!selectedMember) return;

    const usedSecretSantas = new Set(
      data
        .filter((person) => person.id !== selectedMemberId)
        .map((person) => person.secret_santa)
        .filter((name): name is string => Boolean(name))
    );

    const candidates = data.filter(
      (person) =>
        person.id !== selectedMemberId &&
        person.name !== selectedMember.name &&
        !usedSecretSantas.has(person.name)
    );
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

  const handleWishlistSave = async () => {
    if (selectedMemberId === null) return;

    const { error } = await supabase
      .from("family")
      .update({ wishlist: wishlistText })
      .eq("id", selectedMemberId);

    if (error) {
      console.log(error);
      return;
    }

    setWishlists((prev) => ({
      ...prev,
      [String(selectedMemberId)]: wishlistText,
    }));
    setData((prev) =>
      prev.map((person) =>
        person.id === selectedMemberId
          ? { ...person, wishlist: wishlistText }
          : person
      )
    );
    setIsEditingWishlist(false);

    const modal = document.getElementById("wishlist_modal") as HTMLDialogElement | null;
    modal?.close();
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-14 py-32">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold">
            <MorphingText texts={["Secret", "Santa"]} />
          </h1>
          <p className="mt-4 text-lg ss-text"> Selamat datang ke halaman Secret Santa.</p>
        </div>
        <div className="ss-table-card overflow-x-auto rounded-box border">
          <table className="ss-table table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th className="hidden">Secret Santa</th>
                <th>Wishlist</th>
              </tr>
            </thead>
            <tbody>
              {data.map((person, index) => (
                <tr key={person.id}>
                  <th>{index + 1}</th>
                  <td className="whitespace-nowrap">{person.name}</td>
                  <td className="hidden">
                    <div className="flex items-center justify-center">
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
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="flex items-center justify-center"
                      onClick={() => openWishList(person.id)}
                    >
                      <svg className="h-6 w-6 fill-current" viewBox="0 0 404 404">
                        <g>
                          <path d="M401.813,153.367l0.004-0.005l-23.784-17.977l1.944-5.329c0.5-1.371,0.436-2.883-0.18-4.206s-1.73-2.347-3.101-2.847
		l-29.109-10.622L205.316,4.872c-1.962-1.482-4.67-1.482-6.632,0l-47.453,35.856L86.435,17.083
		c-2.853-1.042-6.011,0.428-7.052,3.281l-37.629,103.1l-39.57,29.898l0.003,0.005C0.861,154.371,0,155.958,0,157.75v236.99
		c0,3.038,2.462,5.5,5.5,5.5h393c3.038,0,5.5-2.462,5.5-5.5V157.75C404,155.958,403.139,154.371,401.813,153.367z M21.901,163.25
		h5.335l-1.153,3.16L21.901,163.25z M31.251,152.25h-9.348l12.909-9.753L31.251,152.25z M153.182,276.246L11,383.692V168.801
		L153.182,276.246z M202.003,253.14l180.1,136.1H21.904L202.003,253.14z M250.821,276.244L393,168.801v214.886L250.821,276.244z
		 M367.865,163.25h14.234l-19.652,14.851L367.865,163.25z M382.102,152.25h-10.223l2.21-6.056L382.102,152.25z M202,16.154
		l110.302,83.352L163.536,45.219L202,16.154z M87.831,29.302l279.926,102.149l-21.477,58.867L241.698,269.35l-36.379-27.491
		c-1.962-1.482-4.67-1.482-6.632,0l-36.383,27.494L35.261,173.346L87.831,29.302z"/>
                          <path d="M95.863,105.677l14.284,5.212l-14.699,6.84c-2.754,1.282-3.948,4.553-2.667,7.307c0.932,2.003,2.917,3.181,4.99,3.181
		c0.777,0,1.566-0.166,2.317-0.515l24.673-11.48l4.367,1.594l-1.594,4.367l-24.673,11.48c-2.754,1.282-3.948,4.553-2.667,7.307
		s4.553,3.946,7.307,2.667l14.699-6.84l-5.213,14.284c-1.042,2.854,0.428,6.011,3.281,7.052c0.622,0.228,1.259,0.335,1.885,0.335
		c2.245,0,4.353-1.385,5.167-3.616l5.213-14.284l6.84,14.7c0.933,2.003,2.917,3.181,4.99,3.181c0.777,0,1.566-0.166,2.317-0.515
		c2.754-1.282,3.948-4.553,2.667-7.307l-11.48-24.674l1.593-4.366l4.367,1.594l11.48,24.673c0.932,2.003,2.917,3.181,4.99,3.181
		c0.777,0,1.566-0.166,2.317-0.515c2.754-1.282,3.948-4.553,2.667-7.307l-6.84-14.699l14.284,5.212
		c0.622,0.228,1.259,0.335,1.885,0.335c2.245,0,4.353-1.385,5.167-3.616c1.042-2.854-0.428-6.011-3.281-7.052l-14.284-5.213
		l14.7-6.84c2.754-1.282,3.948-4.553,2.667-7.307c-1.282-2.754-4.554-3.949-7.307-2.667l-24.674,11.48l-4.367-1.594l1.594-4.367
		l24.673-11.48c2.754-1.282,3.948-4.553,2.667-7.307c-1.282-2.755-4.554-3.949-7.307-2.667l-14.7,6.84l5.213-14.284
		c1.042-2.854-0.428-6.011-3.281-7.052c-2.853-1.044-6.011,0.428-7.052,3.281l-5.212,14.284l-6.84-14.7
		c-1.282-2.754-4.554-3.948-7.307-2.667c-2.754,1.282-3.948,4.553-2.667,7.307l11.481,24.673l-1.594,4.367l-4.367-1.594
		l-11.481-24.674c-1.281-2.754-4.555-3.947-7.307-2.667c-2.754,1.282-3.948,4.553-2.667,7.307l6.84,14.7l-14.284-5.213
		c-2.853-1.042-6.011,0.428-7.052,3.281C91.541,101.479,93.01,104.636,95.863,105.677z"/>
                          <path d="M242.743,122.552l88.77,32.394c0.622,0.228,1.259,0.335,1.885,0.335c2.245,0,4.353-1.385,5.167-3.616
		c1.042-2.854-0.428-6.011-3.281-7.052l-88.77-32.394c-2.853-1.042-6.011,0.428-7.052,3.281
		C238.42,118.354,239.89,121.511,242.743,122.552z"/>
                          <path d="M233.23,148.62L322,181.013c0.622,0.228,1.259,0.335,1.885,0.335c2.245,0,4.353-1.385,5.167-3.616
		c1.042-2.854-0.428-6.011-3.281-7.052l-88.77-32.394c-2.854-1.044-6.011,0.428-7.052,3.281
		C228.908,144.422,230.377,147.579,233.23,148.62z"/>
                          <path d="M223.718,174.687l88.77,32.394c0.622,0.228,1.259,0.335,1.885,0.335c2.245,0,4.353-1.385,5.167-3.616
		c1.042-2.854-0.428-6.011-3.281-7.052l-88.77-32.394c-2.853-1.043-6.011,0.428-7.052,3.281
		C219.396,170.489,220.865,173.646,223.718,174.687z"/>
                        </g>
                      </svg>
                    </button>
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
                  <SparklesText>Hi {data.find((person) => person.id === selectedMemberId)?.name}</SparklesText>
                  <span className="text-sm">Ready to find out who your Secret Santa is? Click the button below to reveal your Secret Santa!</span>
                  <Image src="/cat-no-bg.gif" alt="Cat" width={180} height={180} />
                  <ShinyButton className="btn-lg mt-5" onClick={handleReveal}>
                    Reveal Your Secret Santa!
                  </ShinyButton>
                </div>
              )}
            </div>
          </div>
        </dialog>

        <dialog id="wishlist_modal" className="modal ss-modal">
          <div className="modal-box ss-modal-box relative">
            <form method="dialog" className="absolute right-3 top-3">
              <button className="btn ss-modal-close btn-sm">X</button>
            </form>
            <div className="py-4">
              <SparklesText>Wishlist {data.find((person) => person.id === selectedMemberId)?.name}</SparklesText>
              <textarea
                className="ss-input min-h-40 w-full rounded-xl p-4 resize-none mt-4"
                placeholder="Type your wishlist here..."
                value={wishlistText ?? ""}
                disabled={!isEditingWishlist && hasSavedWishlist}
                onChange={(event) => setWishlistText(event.target.value)}
              />
              {hasSavedWishlist && !isEditingWishlist && (
                  <span>Tekan butang Edit Wishlist untuk kemasini wishlist</span>
                ) }
              <div className="mt-5 flex justify-end">
                {hasSavedWishlist && !isEditingWishlist ? (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsEditingWishlist(true)}
                  >
                    Edit Wishlist
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn"
                    onClick={handleWishlistSave}
                  >
                    Simpan Wishlist
                  </button>
                )}
              </div>
            </div>
          </div>
        </dialog>

      </main>
    </div>
  );
}
