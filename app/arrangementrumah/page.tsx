
import Image from "next/image";

const arrangementRows = [
    { section: "Rumah 1", space: "Bilik 1", guests: "Koyie & Tina" },
    { section: "Rumah 1", space: "Bilik 2", guests: "Mama Dayah & Aboh" },
    { section: "Rumah 1", space: "Bilik 3", guests: "Tita & Kome" },
    { section: "Rumah 1", space: "Bilik 4", guests: "Bihah & Tasya" },
    { section: "Triangle House", space: "Rumah 2", guests: "Dayah & Arif" },
    { section: "Triangle House", space: "Rumah 3", guests: "Iqa & Affan" },
    { section: "Triangle House", space: "Rumah 4", guests: "Ijat & Diba" },
    { section: "Triangle House", space: "Rumah 5", guests: "Tirah & Arul" },
    { section: "Triangle House", space: "Rumah 6", guests: "Kakok & Faiz" },
    { section: "Triangle House", space: "Rumah 7", guests: "Afiq, Aqeel & Arfan" },
    { section: "Triangle House", space: "Rumah 8", guests: "Along & Kimi" },
    { section: "Triangle House", space: "Rumah 9", guests: "Aulia & Ian" },
];

export default function ArrangementRumahPage() {
    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
            <div>
                <h1 className="mt-8 text-3xl font-bold text-center">Jerai Triangle House</h1>
            </div>

            <Image
                src="/homestay.PNG"
                alt="Homestay arrangement"
                width={1600}
                height={1200}
                className="h-auto w-full rounded-2xl"
                priority
            />

            <div className="overflow-x-auto rounded-2xl border">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Section</th>
                            <th>Room</th>
                            <th>Guests</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrangementRows.map((row) => (
                            <tr key={`${row.section}-${row.space}`}>
                                <td className="font-semibold whitespace-nowrap">{row.section}</td>
                                <td className="whitespace-nowrap">{row.space}</td>
                                <td>{row.guests}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
