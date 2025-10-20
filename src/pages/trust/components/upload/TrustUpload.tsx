// import { FormInput, CustomSelect, Button } from "../../../../components/elements";
// import { Controller } from "react-hook-form";
import { Observer, observer } from "mobx-react-lite";
import { trustStore as TrustStore } from "../../store/trustStore"
import { createContext, useCallback, useContext, useState, useRef } from "react";
// import { axiosRequestFormData } from "../../../../utils/serverRequest";
// import { ITrustPayloadData } from "../../types/interface";
// import { settingStore as SettingStore } from "../../../Settings/store/settingStore";
// import { IDropdownProp, ISettlor } from "../../../Settings/types/interface";
// import { authStore as AuthStore } from "../../../auth/store/authStore";
import * as XLSX from "xlsx";
import { IUploadValidationResponse } from "../../types/interface";
import GoBackT from "../../../../components/elements/GoBackT";
import { toast } from "react-toastify";

// const AuthStoreCTX = createContext(AuthStore);
// const settingStoreCTX = createContext(SettingStore);
const trustStoreCTX = createContext(TrustStore);

const trustKeys = [
    "trustName",
    "nameOfOmls",
    "settlor",
    "country",
    "state",
    "localGovernmentArea",
    "trustCommunities",
    "totalMaleBotMembers",
    "totalFemaleBotMembers",
    "totalPwdBotMembers",
    "totalMaleAdvisoryCommitteeMembers",
    "totalFemaleAdvisoryCommitteeMembers",
    "totalPwdAdvisoryCommitteeMembers",
    "totalMaleManagementCommitteeMembers",
    "totalFemaleManagementCommitteeMembers",
    "totalPwdManagementCommitteeMembers",
    "botDetailsOneFirstName",
    "botDetailsOneLastName",
    "botDetailsOneEmail",
    "botDetailsOnePhoneNumber",
    "botDetailsTwoFirstName",
    "botDetailsTwoLastName",
    "botDetailsTwoEmail",
    "botDetailsTwoPhoneNumber",
];

const TrustUpload = observer(() => {
    // const authStore = useContext(AuthStoreCTX);
    const trustStore = useContext(trustStoreCTX);
    // const settingStore = useContext(settingStoreCTX);
    const [rows, setRows] = useState<Array<Record<string, any>>>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>("");
    const [selected, setSelected] = useState<Record<number, boolean>>({});
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onFile = useCallback(async (file: File | null) => {
        if (!file) return;
        trustStore.isValidate = true
        trustStore.uploadErrorCount = 0
        await trustStore.validateTrustExcel(file);
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            try {
                const wb = XLSX.read(data, { type: "array" });
                // prefer sheet named 'Trust' first, fall back to 'Database', otherwise use first sheet
                const sheetName = wb.SheetNames.find((n) => n.toLowerCase() === "trust")
                    || wb.SheetNames.find((n) => n.toLowerCase() === "database")
                    || wb.SheetNames[0];
                const ws = wb.Sheets[sheetName];
                const json: Array<Record<string, any>> = XLSX.utils.sheet_to_json(ws, { defval: "" });
                setRows(json);
                const head = json.length > 0 ? Object.keys(json[0]) : trustKeys;
                setHeaders(head);
                // reset selection
                setSelected({});
            } catch (err) {
                console.error("Failed to parse workbook", err);
                setRows([]);
                setHeaders([]);
            }
        };
        reader.readAsArrayBuffer(file);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files && e.target.files[0];
        onFile(f || null);
    };

    const uploadToServer = async (file: File | null) => {
        if (!file) return;
        try {
            trustStore.isValidate = true
            trustStore.uploadErrorCount = 0
            setUploading(true);
            // setConsoleMessages([]);
            console.log("Starting upload for file:", file);
            // use store to upload & validate
            await trustStore.validateTrustExcel(file);

        } catch (error: any) {
            const message = error?.response?.body?.message;
            const message2 = error?.response?.body?.error;
            if (message?.includes("Please try again. Database connection failed.")) {
                toast.info(message);
            } else {
                toast.error(message2);
            }
        } finally {
            setUploading(false);
        }
    };
    const saveValidatedData = async () => {
        try {
            setRows([])
            trustStore.isValidate = false
            await trustStore.uploadValidatedTrust();
            toast.success("Validated trust data saved successfully.");
        } catch (error: any) {
            const message = error?.response?.body?.message;
            const message2 = error?.response?.body?.error;
            if (message?.includes("Please try again. Database connection failed.")) {
                toast.info(message);
            } else {
                toast.error(message2);
            }
        }
    };

    const switchUploadPage = useCallback(() => {
        trustStore.pageSwitched = 1;
    }, [trustStore]);

    return (
        <div className="py-6 px-4">
            <GoBackT action={switchUploadPage} page="Trust table" />
            <br />
            <h2 className="text-lg lg:text-2xl font-semibold text-primary-100">
                Trusts Upload
            </h2>
            <br />

            <div className="mb-3 flex items-start justify-between">
                <div className="flex-1 mr-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => trustStore.activeUploadTab = 0} className={`px-3 py-1 rounded ${trustStore.activeUploadTab === 0 ? 'font-semibold' : 'text-gray-600'}`}>Upload</button>
                        {(() => {
                            return (
                                <button onClick={() => trustStore.activeUploadTab = 1} className={`relative px-3 py-1 rounded ${trustStore.activeUploadTab === 1 ? 'font-semibold' : 'text-gray-600'}`}>
                                    Console
                                    {trustStore.uploadErrorCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">{trustStore.uploadErrorCount}</span>
                                    )}
                                </button>
                            );
                        })()}
                    </div>
                </div>
                <div>
                    <Observer>
                        {() => (
                            <button
                                type="button"
                                disabled={trustStore.uploadErrorCount > 0 || rows.length == 0 ? true : false}
                                onClick={async () => { await saveValidatedData(); }}
                                className={`px-3 py-2 rounded text-white text-sm ${trustStore.uploadErrorCount > 0 || rows.length == 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                style={{ backgroundColor: '#003B99' }}
                            >
                                {trustStore.isSaving ? "Saving..." : "Save Imported Data"}
                            </button>

                        )}
                    </Observer>
                </div>
            </div>

            {/* <div className="mb-3">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm">Select a branch from the left pane to upload members.</div>
            </div> */}

            <div className="mb-2 flex items-center gap-4 text-sm">
                <button
                    type="button"
                    onClick={() => {
                        // remove selected rows
                        const selectedIdx = Object.keys(selected).filter(k => selected[Number(k)]).map(Number);
                        if (selectedIdx.length === 0) return;
                        setRows(old => old.filter((_, idx) => !selectedIdx.includes(idx)));
                        setSelected({});
                    }}
                    className="text-red-600 hover:underline"
                >
                    Remove Row
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setRows([]);
                        setHeaders([]);
                        setFileName('');
                        setSelected({});
                        trustStore.uploadValidationResult = {} as IUploadValidationResponse;
                        trustStore.uploadErrorCount = 0;
                        if (fileInputRef.current) {
                            // clear the file input selection
                            fileInputRef.current.value = '';
                        }
                    }}
                    className="text-red-600 hover:underline"
                >
                    Remove All
                </button>
                <button
                    type="button"
                    disabled={true}
                    onClick={() => {
                        // export a template workbook with headers = trustKeys and sheet name Database
                        const ws = XLSX.utils.json_to_sheet([trustKeys.reduce((acc, k) => ({ ...acc, [k]: '' }), {})]);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'Database');
                        XLSX.writeFile(wb, 'member-template.xlsx');
                    }}
                    className="text-red-600 hover:underline"
                >
                    Export Member Template
                </button>
            </div>

            {trustStore.activeUploadTab == 0 && (
                <>
                    <div
                        onDragOver={(e) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; }}
                        onDrop={(e) => {
                            e.preventDefault();
                            const f = e.dataTransfer?.files && e.dataTransfer.files[0];
                            if (f) onFile(f);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed rounded p-8 mb-4 bg-white cursor-pointer"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <div className="mb-3 text-blue-400">
                                {/* icon placeholder */}
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 7l4-4 4 4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <div className="text-sm text-gray-700">Click or drag Trust upload (.xlsx) Template with Sheet name: <strong>Trust</strong> to this area to upload</div>
                            <div className="mt-4">
                                <input ref={fileInputRef} accept=".xlsx, .xls" onChange={(e) => { handleFileChange(e); const f = e.target.files && e.target.files[0]; if (f) uploadToServer(f); }} type="file" className="hidden" />
                                Browse file

                                {fileName && <div className="mt-2 text-xs text-gray-600">Selected: {fileName}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        {uploading ? (
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-5 h-5 rounded-full animate-spin"
                                    style={{ border: '3px solid #003B99', borderTopColor: 'transparent' }}
                                />
                                <div className="text-sm text-gray-700">Uploading {fileName ? <span className="font-medium">{fileName}</span> : 'file'} — validating on server...</div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Drop or select a file to validate. The file will be sent to the server for field validation.</div>
                        )}
                        <div>
                            {uploading ? <span className="text-xs text-gray-400">Please wait</span> : null}
                        </div>
                    </div>
                </>
            )}

            {trustStore.activeUploadTab == 1 && (
                <div className="mb-4 p-4 bg-gray-50 border rounded" style={{ minHeight: 120 }}>
                    <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">Validation Console</div>
                        <div className="text-sm text-gray-500">{uploading ? 'Uploading...' : ''}</div>
                    </div>
                    <div className="max-h-64 overflow-auto text-sm">
                        {trustStore.uploadErrorCount === 0 ? (
                            <div className="text-gray-500">No validation messages yet. Upload a file to validate.</div>
                        ) : (
                            trustStore.isValidate ? (
                                trustStore.uploadValidationResult?.validationSummary?.map((m, i) => (
                                    <div key={i} className={`mb-2 p-2 rounded bg-red-50 border border-red-200 text-red-800`}>
                                        {`${m.message} at row number ${m.rowNumber}`}
                                    </div>
                                ))
                            ) : (
                                trustStore.uploadResponse?.failed?.map((m, i) => (
                                    <div key={i} className={`mb-2 p-2 rounded bg-red-50 border border-red-200 text-red-800`}>
                                        {`${m.message} Trust Name ${m.trustName}`}
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            )}

            <div className="overflow-auto border rounded p-2 bg-white" style={{ maxHeight: '56vh' }}>
                {rows.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No data to preview. Upload an Excel file with a sheet named <strong>Database</strong> or any sheet to preview.</div>
                ) : (
                    <table className="min-w-full border-collapse">
                        <thead className="sticky top-0 z-10">
                            <tr>
                                <th className="border px-3 py-2 text-left text-xs" style={{ backgroundColor: '#003B99', color: '#ffffff' }}>
                                    <input
                                        type="checkbox"
                                        checked={rows.length > 0 && Object.keys(selected).length === rows.length && rows.every((_, idx) => selected[idx])}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                const all: Record<number, boolean> = {};
                                                rows.forEach((_, i) => all[i] = true);
                                                setSelected(all);
                                            } else {
                                                setSelected({});
                                            }
                                        }}
                                    />
                                </th>
                                {headers.map((h) => (
                                    <th key={h} className="border px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide" style={{ backgroundColor: '#003B99', color: '#ffffff' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i} className={`transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                                    <td className="border px-3 py-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={!!selected[i]}
                                            onChange={(e) => setSelected(prev => ({ ...prev, [i]: e.target.checked }))}
                                        />
                                    </td>
                                    {headers.map((h) => (
                                        <td key={h} className="border px-3 py-2 text-sm align-top">
                                            {String(r[h] ?? "")}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
});

export default TrustUpload;

