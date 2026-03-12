"use client"

import { AuroraText } from "@/components/ui/aurora-text"
import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Group = {
    id: number | string;
    name: string;
};

type Family = {
    id: number | string;
    name: string;
    group_id: number | string;
    shirt_size: string;
    name_on_shirt: string;
};

export default function SaizBajuPage() {

    const [data, setGroup] = useState<Group[]>([]);
    const [families, setFamily] = useState<Family[]>([]);
    const [drafts, setDrafts] = useState<Record<string, { name_on_shirt: string; shirt_size: string }>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState<Record<string, boolean>>({});
    const saveTimersRef = useRef<Record<string, number>>({});

    useEffect(() => {
        async function fetchData() {
            const { data: groupData, error } = await supabase
                .from("group")
                .select("id,name");

            if (error) {
                console.log(error);
            } else {
                setGroup((groupData ?? []) as Group[]);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            const { data: familyData, error } = await supabase
                .from("family")
                .select("id,name,group_id,shirt_size,name_on_shirt")
                .order("name", { ascending: true });

            if (error) {
                console.log(error);
            } else {
                setFamily((familyData ?? []) as Family[]);
            }
        }

        fetchData();
    }, []);

    const scheduleSave = (familyId: number | string) => {
        const key = String(familyId);
        const existing = saveTimersRef.current[key];
        if (existing) {
            window.clearTimeout(existing);
        }
        const timerId = window.setTimeout(() => {
            saveFamily(familyId);
        }, 1000);
        saveTimersRef.current[key] = timerId;
    };

    const updateDraft = (familyId: number | string, field: "name_on_shirt" | "shirt_size", value: string) => {
        setDrafts((prev) => {
            const key = String(familyId);
            const current = prev[key] ?? {
                name_on_shirt: families.find((f) => f.id === familyId)?.name_on_shirt ?? "",
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
        scheduleSave(familyId);
    };

    const saveFamily = async (familyId: number | string) => {
        const key = String(familyId);
        const current = drafts[key] ?? {
            name_on_shirt: families.find((f) => f.id === familyId)?.name_on_shirt ?? "",
            shirt_size: families.find((f) => f.id === familyId)?.shirt_size ?? "",
        };

        setSaving((prev) => ({ ...prev, [key]: true }));

        const { error } = await supabase
            .from("family")
            .update({
                name_on_shirt: current.name_on_shirt,
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
                    ? { ...f, name_on_shirt: current.name_on_shirt, shirt_size: current.shirt_size }
                    : f
            )
        );

        setSaved((prev) => ({ ...prev, [key]: true }));
        window.setTimeout(() => {
            setSaved((prev) => ({ ...prev, [key]: false }));
        }, 5000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center font-sans">
            <main className="flex min-h-screen w-full max-w-none flex-col items-center justify-center px-6 py-32 md:px-12 lg:px-16">
                <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl mb-8">
                    Saiz <AuroraText>Baju</AuroraText>
                </h1>

                {data.map((person) => (
                    <div className="ss-table-card w-full md:w-1/2 overflow-x-auto rounded-box border mb-8" key={person.id}>
                        <table className="ss-table table w-full">
                            <thead>
                                <tr>
                                    <td colSpan={4} className="text-center uppercase">Family {person.name}</td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th>Nama</th>
                                    <th>Nama Pada Baju</th>
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
                                            placeholder="Nama Pada Baju"
                                            value={(drafts[String(family.id)]?.name_on_shirt ?? family.name_on_shirt ?? "")}
                                            onChange={(e) => updateDraft(family.id, "name_on_shirt", e.target.value)}
                                        />
                                        {saving[String(family.id)] && (
                                            <div className="mt-1 text-xs opacity-70">Saving…</div>
                                        )}
                                        {saved[String(family.id)] && (
                                            <div className="mt-1 text-xs text-green-600">Saved</div>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="input input-bordered ss-input w-full"
                                            placeholder="Saiz Baju"
                                            value={(drafts[String(family.id)]?.shirt_size ?? family.shirt_size ?? "")}
                                            onChange={(e) => updateDraft(family.id, "shirt_size", e.target.value)}
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
