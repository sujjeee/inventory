import { Shell } from "@/components/shells";
import { DataTableLoading } from "@/components/table/data-table-loading";


export default function IndexLoading() {
    return (
        <Shell className="max-w-6xl">
            <DataTableLoading columnCount={4} />
        </Shell>
    )
}