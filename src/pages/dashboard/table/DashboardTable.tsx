import React from "react";

export type DashboardTableColumn<T = any> = {
    key: string;
    label: string;
    render?: (row: T, idx: number) => React.ReactNode;
};

export interface DashboardTableProps<T = any> {
    data?: T[];
    loading?: boolean;
    header?: string;
    columns?: DashboardTableColumn<T>[];
    emptyText?: string;
}




function DashboardTable<T = any>({
    data,
    loading = false,
    header,
    columns,
    emptyText = "No data available",
}: DashboardTableProps<T>) {
    return (
        <div className="bg-white rounded-xl p-4 shadow flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <button className="border border-gray-200 rounded px-3 py-1 text-xs font-medium bg-gray-50">
                    {header}
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center border border-gray-200 rounded px-3 py-1 text-xs font-medium bg-gray-50">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                        Filter
                    </button>
                    <button className="flex items-center border border-gray-200 rounded px-3 py-1 text-xs font-medium bg-gray-50">
                        Sort by
                        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="text-gray-400 font-medium">
                            {columns?.map((col) => (
                                <th key={col.key} className="px-4 py-2 text-left">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={columns?.length} className="text-center py-8">
                                    <span className="text-gray-400">Loading...</span>
                                </td>
                            </tr>
                        ) : data && data.length > 0 ? (
                            data.map((row, idx) => (
                                <tr className="border-t" key={idx}>
                                    {columns?.map((col) => (
                                        <td className="px-4 py-3" key={col.key}>
                                            {col.render
                                                ? col.render(row, idx)
                                                : // @ts-ignore
                                                row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns?.length} className="text-center py-8">
                                    <span className="text-gray-400">{emptyText}</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default DashboardTable;