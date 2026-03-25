"use client"

import { useEffect, useState } from "react"
import { AuroraText } from "@/components/ui/aurora-text"
import { supabase } from "@/lib/supabaseClient"

type GoodiesPair = {
    id: number | string;
    first_pair: string;
    second_pair: string | null;
    colour: string | null;
};

const COLOUR_CHOICES = [
    "Merah",
    "Biru",
    "Kuning",
    "Hijau",
    "Oren",
    "Pink",
    "Hitam",
    "Ungu",
    "Gold",
    "Putih",
    "Grey",
    "Brown",
];

export default function GoodiesPage() {
    const [pairs, setPairs] = useState<GoodiesPair[]>([]);
    const [saving, setSaving] = useState<Record<string, boolean>>({});

    useEffect(() => {
        async function fetchGoodies() {
            const { data, error } = await supabase
                .from("goodies")
                .select("id,first_pair,second_pair,colour")
                .order("id", { ascending: true });

            if (error) {
                console.error(error);
                return;
            }

            setPairs((data ?? []) as GoodiesPair[]);
        }

        fetchGoodies();
    }, []);

    const revealColour = async (pairId: number | string) => {
        const selectedPair = pairs.find((pair) => pair.id === pairId);
        if (!selectedPair || selectedPair.colour) {
            return;
        }

        const usedColours = new Set(
            pairs
                .filter((pair) => pair.id !== pairId)
                .map((pair) => pair.colour)
                .filter((colour): colour is string => Boolean(colour))
        );

        const availableColours = COLOUR_CHOICES.filter((colour) => !usedColours.has(colour));
        if (availableColours.length === 0) {
            console.error("No colours remaining to assign.");
            return;
        }

        // eslint-disable-next-line react-hooks/purity
        const randomColour = availableColours[Math.floor(Math.random() * availableColours.length)];
        const key = String(pairId);

        setSaving((prev) => ({ ...prev, [key]: true }));

        const { error } = await supabase
            .from("goodies")
            .update({ colour: randomColour })
            .eq("id", pairId);

        setSaving((prev) => ({ ...prev, [key]: false }));

        if (error) {
            console.error(error);
            return;
        }

        setPairs((prev) =>
            prev.map((pair) =>
                pair.id === pairId
                    ? { ...pair, colour: randomColour }
                    : pair
            )
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center font-sans">
            <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-32 md:px-12 lg:px-16">
                <h1 className="mb-8 text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
                    <AuroraText>Goodies</AuroraText>
                </h1>
                <p className="ss-text mt-4 text-center text-lg">
                    Setiap pasangan perlu membeli goodies untuk 23 orang (tidak termasuk kanak-kanak) mengikut tema warna yang ditetapkan.
                </p>

                <div className="ss-table-card mt-10 w-full overflow-x-auto rounded-box border">
                    <table className="ss-table table w-full">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Pasangan</th>
                                <th>Warna Tema</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pairs.map((pair, index) => (
                                <tr key={pair.id}>
                                    <th>{index + 1}</th>
                                    <td>{pair.second_pair ? `${pair.first_pair} & ${pair.second_pair}` : pair.first_pair}</td>
                                    <td>
                                        {pair.colour ? (
                                            pair.colour
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-sm ss-button min-w-24"
                                                onClick={() => revealColour(pair.id)}
                                                disabled={saving[String(pair.id)]}
                                            >
                                                {saving[String(pair.id)] ? "Saving..." : "Buka"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
