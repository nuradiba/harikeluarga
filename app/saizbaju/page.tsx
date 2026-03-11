import { AuroraText } from "@/components/ui/aurora-text"

export default function SaizBajuPage() {

    return (
        <div className="flex min-h-screen items-center justify-center font-sans">
            <main className="flex min-h-screen w-full max-w-none flex-col items-center justify-center px-6 py-32 md:px-12 lg:px-16">
                <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl mb-8">
                    Saiz <AuroraText>Baju</AuroraText>
                </h1>

                <div className="ss-table-card w-1/2 overflow-x-auto rounded-box border">
                    <table className="ss-table table w-full">
                        <thead>
                            <tr>
                                <td colSpan={4} className="text-center uppercase">Family Mama Dayah</td>
                            </tr>
                            <tr>
                                <th></th>
                                <th>Nama</th>
                                <th>Nama Pada Baju</th>
                                <th>Saiz Baju</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mama Dayah</td>
                                <td><input type="text" className="input input-bordered ss-input w-full" placeholder="Nama Pada Baju" /></td>
                                <td><input type="text" className="input input-bordered ss-input w-full" placeholder="Saiz Baju" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}
