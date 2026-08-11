"use client"

import { AuroraText } from "@/components/ui/aurora-text"
import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import { LoadingScreen } from "@/components/loading-screen"

type Group = {
    id: number | string;
    name: string;
};

type Family = {
    id: number | string;
    name: string;
    group_id: number | string;
    shirt_size: string;
};

export default function SaizBajuPage() {

    const [data, setGroup] = useState<Group[]>([]);
    const [families, setFamily] = useState<Family[]>([]);
    const [drafts, setDrafts] = useState<Record<string, { shirt_size: string }>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const saveTimersRef = useRef<Record<string, number>>({});

    useEffect(() => {
        async function fetchData() {
            const [groupResult, familyResult] = await Promise.all([
                supabase
                .from("group")
                .select("id,name"),
                supabase
                .from("family")
                .select("id,name,group_id,shirt_size")
                .order("name", { ascending: true }),
            ]);

            if (groupResult.error) {
                console.log(groupResult.error);
            } else {
                setGroup((groupResult.data ?? []) as Group[]);
            }

            if (familyResult.error) {
                console.log(familyResult.error);
            } else {
                setFamily((familyResult.data ?? []) as Family[]);
            }

            setIsLoading(false);
        }

        fetchData();
    }, []);

    const updateDraft = (familyId: number | string, field: "shirt_size", value: string) => {
        setDrafts((prev) => {
            const key = String(familyId);
            const current = prev[key] ?? {
                shirt_size: families.find((f) => f.id === familyId)?.shirt_size ?? "",
            };
            return {
                ...prev,
                [key]: {
                    ...current,
                    [field]: value,
                },
            };
        });
    };

    const scheduleSave = (familyId: number | string) => {
        const key = String(familyId);
        const existing = saveTimersRef.current[key];
        if (existing) {
            window.clearTimeout(existing);
        }
        saveTimersRef.current[key] = window.setTimeout(() => {
            saveFamily(familyId);
            delete saveTimersRef.current[key];
        }, 500);
    };

    const flushSave = (familyId: number | string) => {
        const key = String(familyId);
        const existing = saveTimersRef.current[key];
        if (existing) {
            window.clearTimeout(existing);
            delete saveTimersRef.current[key];
        }
        saveFamily(familyId);
    };

    const saveFamily = async (familyId: number | string) => {
        const key = String(familyId);
        const current = drafts[key] ?? {
            shirt_size: families.find((f) => f.id === familyId)?.shirt_size ?? "",
        };

        setSaving((prev) => ({ ...prev, [key]: true }));

        const { error } = await supabase
            .from("family")
            .update({
                shirt_size: current.shirt_size,
            })
            .eq("id", familyId);

        setSaving((prev) => ({ ...prev, [key]: false }));

        if (error) {
            console.error(error);
            return;
        }

        setFamily((prev) =>
            prev.map((f) =>
                f.id === familyId
                    ? { ...f, shirt_size: current.shirt_size }
                    : f
            )
        );

        setSaved((prev) => ({ ...prev, [key]: true }));
        window.setTimeout(() => {
            setSaved((prev) => ({ ...prev, [key]: false }));
        }, 2000);
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            const pendingKeys = Object.keys(saveTimersRef.current);
            if (pendingKeys.length === 0) return;
            pendingKeys.forEach((key) => {
                const timer = saveTimersRef.current[key];
                if (timer) {
                    window.clearTimeout(timer);
                    delete saveTimersRef.current[key];
                }
                saveFamily(key);
            });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center font-sans">
            <main className="flex min-h-screen w-full max-w-none flex-col items-center justify-center px-6 py-32 md:px-12 lg:px-16">
                <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl mb-8">
                    Saiz <AuroraText>Baju</AuroraText>
                </h1>

                <div>
                    <Image alt="Saiz Baju Dewasa" src="/saiz_baju_dewasa.jpeg"  width={0} height={0} sizes="100vw" className="w-full h-auto" />
                    <Image alt="Saiz Baju Budak" src="/saiz_baju_budak.jpeg" width={0} height={0} sizes="100vw" className="w-full h-auto"  />
                </div>


                {data.map((person) => (
                    <div className="ss-table-card w-full md:w-1/2 overflow-x-auto rounded-box border mb-8" key={person.id}>
                        <table className="ss-table table w-full">
                            <thead>
                                <tr>
                                    <td colSpan={3} className="text-center uppercase">Family {person.name}</td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th>Nama</th>
                                    <th>Saiz Baju</th>
                                </tr>
                            </thead>
                            <tbody>
                                {families
                                  .filter((family) => family.group_id === person.id)
                                  .map((family, index) => (
                                <tr key={family.id}>
                                    <td>{index + 1}</td>
                                    <td>{family.name}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="input input-bordered ss-input w-full"
                                            value={(drafts[String(family.id)]?.shirt_size ?? family.shirt_size ?? "")}
                                            onChange={(e) => {
                                                updateDraft(family.id, "shirt_size", e.target.value);
                                                scheduleSave(family.id);
                                            }}
                                            onBlur={() => flushSave(family.id)}
                                        />
                                        {saving[String(family.id)] && (
                                            <div className="mt-1 text-xs opacity-70">Saving…</div>
                                        )}
                                        {saved[String(family.id)] && (
                                            <div className="mt-1 text-xs text-green-600">Saved</div>
                                        )}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}

            </main>
        </div>
    );
}
