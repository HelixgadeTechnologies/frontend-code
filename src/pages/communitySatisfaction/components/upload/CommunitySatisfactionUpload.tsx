import { observer } from "mobx-react-lite";
import { satisfactionStore as SatisfactionStore } from "../../store/satisfactionStore";
import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import { createContext, useCallback, useContext, useState, useRef} from "react";
import * as XLSX from "xlsx";
import { ISatisfactionUploadValidationResponse } from "../../types/interface";
import GoBackT from "../../../../components/elements/GoBackT";
import { Button } from "../../../../components/elements";
import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";

const satisfactionStoreCTX = createContext(SatisfactionStore);
const trustStoreCTX = createContext(TrustStore);

const satisfactionKeys = [
    "trustName",
    "infoProjects",
    "communityConsult",
    "localParticipation",
    "reportMechanism",
    "conflictMinimization",
    "settlorAction",
    "nuprcAction",
    "projectHandover",
    "maintenanceConsult",
    "incomeProject",
];

interface UploadProps {
    onBack?: () => void;
}

const CommunitySatisfactionUpload = observer(({ onBack }: UploadProps) => {
    const satisfactionStore = useContext(satisfactionStoreCTX);
    const trustStore = useContext(trustStoreCTX);
    // const { name } = useParams();
    const [rows, setRows] = useState<Array<Record<string, any>>>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>("");
    const [selected, setSelected] = useState<Record<number, boolean>>({});
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onFile = useCallback(async (file: File | null) => {
        if (!file) return;
        satisfactionStore.isValidate = true;
        satisfactionStore.uploadErrorCount = 0;
        await satisfactionStore.validateSatisfactionExcel(file);
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            try {
                const wb = XLSX.read(data, { type: "array" });
                const sheetName = wb.SheetNames.find((n) => n.toLowerCase() === "satisfaction")
                    || wb.SheetNames.find((n) => n.toLowerCase() === "database")
                    || wb.SheetNames[0];
                const ws = wb.Sheets[sheetName];
                const json: Array<Record<string, any>> = XLSX.utils.sheet_to_json(ws, { defval: "" });
                setRows(json);
                const head = json.length > 0 ? Object.keys(json[0]) : satisfactionKeys;
                setHeaders(head);
                setSelected({});
            } catch (err) {
                console.error("Failed to parse workbook", err);
                setRows([]);
                setHeaders([]);
            }
        };
        reader.readAsArrayBuffer(file);
    }, [satisfactionStore]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files && e.target.files[0];
        onFile(f || null);
    };

    const uploadToServer = async (file: File | null) => {
        if (!file) return;
        try {
            setUploading(true);
            await satisfactionStore.validateSatisfactionExcel(file);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Validation failed");
        } finally {
            setUploading(false);
        }
    };

    const saveValidatedData = async () => {
        try {
            await satisfactionStore.saveBulkSatisfactionData();
            setRows([]);
            toast.success("Satisfaction data saved successfully.");
            satisfactionStore.isAddModelOpen = false; // Or navigate back
            satisfactionStore.isAddFunctionalityNeeded = false;
            satisfactionStore.isBulkUploadMode = false;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to save data");
        }
    };

    const switchUploadPage = useCallback(() => {
        if (onBack) {
            onBack();
        } else {
            satisfactionStore.isAddFunctionalityNeeded = false;
        }
    }, [satisfactionStore, onBack]);

    return (
        <div className="py-6 px-4 max-w-7xl mx-auto">
            <GoBackT action={switchUploadPage} page="Satisfaction table" />
            <br />
            <h2 className="text-lg lg:text-2xl font-bold text-gray-800 mb-6">
                Bulk Upload Community Satisfaction
            </h2>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => satisfactionStore.activeUploadTab = 0}
                        className={`px-4 py-2 rounded-md transition-all ${satisfactionStore.activeUploadTab === 0 ? 'bg-white shadow-sm font-semibold text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        Upload
                    </button>
                    <button
                        onClick={() => satisfactionStore.activeUploadTab = 1}
                        className={`relative px-4 py-2 rounded-md transition-all ${satisfactionStore.activeUploadTab === 1 ? 'bg-white shadow-sm font-semibold text-primary-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        Console
                        {satisfactionStore.uploadErrorCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 shadow-sm">
                                {satisfactionStore.uploadErrorCount}
                            </span>
                        )}
                    </button>
                </div>
                <div>
                    <Button
                        type="button"
                        disabled={satisfactionStore.uploadErrorCount > 0 || rows.length === 0 || uploading}
                        loading={satisfactionStore.isSaving}
                        onClick={saveValidatedData}
                        buttonText="Save Imported Data"
                        padding="px-6 py-2.5"
                        width="w-fit"
                        bg="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
                    />
                </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-medium">
                <button
                    type="button"
                    onClick={() => {
                        const selectedIdx = Object.keys(selected).filter(k => selected[Number(k)]).map(Number);
                        if (selectedIdx.length === 0) return;
                        setRows(old => old.filter((_, idx) => !selectedIdx.includes(idx)));
                        setSelected({});
                    }}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove Selected
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setRows([]);
                        setHeaders([]);
                        setFileName('');
                        setSelected({});
                        satisfactionStore.uploadValidationResult = {} as ISatisfactionUploadValidationResponse;
                        satisfactionStore.uploadErrorCount = 0;
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Clear All
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const currentTrustName = trustStore.selectedTrustName || "Trust Name";
                        const sampleData = [
                            {
                                trustName: currentTrustName,
                                infoProjects: 5,
                                communityConsult: 4,
                                localParticipation: 5,
                                reportMechanism: 4,
                                conflictMinimization: 5,
                                settlorAction: 4,
                                nuprcAction: 5,
                                projectHandover: 3,
                                maintenanceConsult: 4,
                                incomeProject: 3,
                            },
                            {
                                trustName: currentTrustName,
                                infoProjects: 3,
                                communityConsult: 2,
                                localParticipation: 3,
                                reportMechanism: 2,
                                conflictMinimization: 3,
                                settlorAction: 2,
                                nuprcAction: 3,
                                projectHandover: 2,
                                maintenanceConsult: 1,
                                incomeProject: 2,
                            },
                            {
                                trustName: currentTrustName,
                                infoProjects: 1,
                                communityConsult: 1,
                                localParticipation: 1,
                                reportMechanism: 1,
                                conflictMinimization: 1,
                                settlorAction: 1,
                                nuprcAction: 1,
                                projectHandover: 1,
                                maintenanceConsult: 1,
                                incomeProject: 1,
                            }
                        ];
                        const ws = XLSX.utils.json_to_sheet(sampleData, { header: satisfactionKeys });
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'Satisfaction');
                        XLSX.writeFile(wb, 'community-satisfaction-template.xlsx');
                    }}
                    className="text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Template
                </button>
            </div>

            {satisfactionStore.activeUploadTab === 0 && (
                <div className="space-y-4">
                    <div
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
                        onDrop={(e) => {
                            e.preventDefault();
                            const f = e.dataTransfer?.files?.[0];
                            if (f) onFile(f);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-white hover:border-primary-500 hover:bg-primary-50/50 transition-all cursor-pointer group"
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Satisfaction Sheet</h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-sm">
                                Click or drag your Excel template (.xlsx) with a sheet named <strong>Satisfaction</strong> to this area
                            </p>
                            <div className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg group-hover:bg-primary-700 transition-colors">
                                Browse Files
                            </div>
                            <input ref={fileInputRef} accept=".xlsx, .xls" onChange={(e) => { handleFileChange(e); const f = e.target.files?.[0]; if (f) uploadToServer(f); }} type="file" className="hidden" />
                            {fileName && (
                                <div className="mt-4 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100 flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                                    {fileName}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        {uploading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm font-medium text-gray-700">Validating data on server...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-gray-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-sm">Select a file to start validation. Required columns: trustName, infoProjects, etc.</span>
                            </div>
                        )}
                        <span className="text-xs text-gray-400 font-medium">Excel (.xlsx) only</span>
                    </div>
                </div>
            )}

            {satisfactionStore.activeUploadTab === 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">Validation Console</h3>
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                            {uploading ? 'Processing...' : 'Ready'}
                        </span>
                    </div>
                    <div className="p-6 max-h-[400px] overflow-auto">
                        {satisfactionStore.uploadErrorCount === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-center">
                                <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p>No validation errors. Your data is ready to be saved.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {satisfactionStore.uploadValidationResult?.validationSummary?.map((m: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                                        <div className="mt-0.5 text-red-500">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-bold text-red-900 border-b border-red-200 pb-1 mb-1">Error at Row {m.rowNumber}</p>
                                            <p className="text-red-800"><span className="font-semibold uppercase text-[10px] tracking-wider bg-red-100 px-1.5 py-0.5 rounded mr-1">{m.field}</span> {m.message}</p>
                                            {m.value && <p className="text-red-700 text-xs mt-1 italic">Value found: "{m.value}"</p>}
                                        </div>
                                    </div>
                                ))}
                                {satisfactionStore.uploadResponse?.failed?.map((m: any, i: number) => (
                                    <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
                                        <strong>Failed:</strong> {m.message} (Data index: {m.index})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-8 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Data Preview</h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                        {rows.length} Records
                    </span>
                </div>
                <div className="overflow-x-auto max-h-[500px]">
                    {rows.length === 0 ? (
                        <div className="py-24 text-center text-gray-400">
                            <p className="mb-2">No data to preview</p>
                            <p className="text-sm">Upload an Excel file to see its content here</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-20">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                            checked={rows.length > 0 && Object.keys(selected).length === rows.length && rows.every((_, idx) => selected[idx])}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    const all: Record<number, boolean> = {};
                                                    rows.forEach((_, i) => all[i] = true);
                                                    setSelected(all);
                                                } else setSelected({});
                                            }}
                                        />
                                    </th>
                                    {headers.map((h) => (
                                        <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {rows.map((r, i) => (
                                    <tr key={i} className={`hover:bg-primary-50/30 transition-colors ${selected[i] ? 'bg-primary-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                                checked={!!selected[i]}
                                                onChange={(e) => setSelected(prev => ({ ...prev, [i]: e.target.checked }))}
                                            />
                                        </td>
                                        {headers.map((h) => (
                                            <td key={h} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                {String(r[h] ?? "-")}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
});

export default CommunitySatisfactionUpload;
