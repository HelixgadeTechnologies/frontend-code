import { Pie, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";
import { ResolvedConflict } from "../table/ResolvedConflict";
import { UnresolvedConflict } from "../table/UnresolvedConflict";
import { conflictStore as ConflictStore } from "../../store/conflictStore"
import { createContext, useCallback, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import IMG from "../../../../assets/svgs/dashboardCauseOfConflictNotFound.svg"
import { dashboardStore as DashboardStore } from "../../../dashboard/store/dashboardStore";
import GoBackT from "../../../../components/elements/GoBackT";
import { GeneralConflictTable } from "../table/GeneralConflictTable";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartDataLabels
);
const dashboardStoreCtx = createContext(DashboardStore)
const ConflictStoreCtx = createContext(ConflictStore)
const GeneralConflict = observer(() => {
    const dashboardStore = useContext(dashboardStoreCtx)
    const conflictStore = useContext(ConflictStoreCtx)

    useEffect(() => {
        async function fetchData() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustIdG");
            conflictStore.dashboardData = null;
            await conflictStore.getConflictDashboardByTrustId(
                selectedTrustId as string,
                0,
                "ALL",
                "ALL"
            );
        }
        fetchData();
    }, [conflictStore]);
    // Mock data for the dashboard
    const pieDataStatusOfConflict = {
        labels: ["Effectively Resolved", "Not Effectively Resolved", "Requested", "Yet To Be Addressed"],
        datasets: [
            {
                data: conflictStore.dashboardData?.STATUS_OF_CONFLICT! || [0, 0, 0, 0],
                backgroundColor: ["#22C55E", "#FACC15", "#3B82F6", "#EF4444"],
                hoverBackgroundColor: ["#16A34A", "#EAB308", "#2563EB", "#DC2626"],
            },
        ],
    };

    const pieDataCourtLitigation = {
        labels: ["Ongoing", "Standing Trial", "Judgment", "Withdrawn"],
        datasets: [
            {
                data: conflictStore.dashboardData?.CONFLICT_OF_COURT_LITIGATION! || [0, 0, 0, 0],
                backgroundColor: ["#3B82F6", "#FACC15", "#22C55E", "#EF4444"],
                hoverBackgroundColor: ["#2563EB", "#EAB308", "#16A34A", "#DC2626"],
            },
        ],
    };

    const lineDataReportFrequency = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Report Frequency",
                data: conflictStore.dashboardData?.REPORT_FREQUENCY! || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                fill: true,
            },
        ],
    };

    const toTable = useCallback(() => {
        dashboardStore.selectedTab = 44;
    }, [dashboardStore]);

    function removeUnderscores(input: string): string {
        return input.replace(/_/g, ' ');
    }
    const closeTable = useCallback(() => {
        dashboardStore.selectedTab = 1;
    }, [dashboardStore]);

    const setSwitch = useCallback(() => {
        dashboardStore.conflictSwitch = !dashboardStore.conflictSwitch

    }, [dashboardStore]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <GoBackT action={closeTable} page="Trust table" />
            <br />
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Conflict Resolution  {dashboardStore.conflictSwitch ? "Table" : "Dashboard"}</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Charts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={dashboardStore.conflictSwitch}
                                onChange={setSwitch}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                        <span className="text-sm text-gray-600 ml-2">Table</span>
                    </div>

                </div>
            </div>
            <br />
            {dashboardStore.conflictSwitch == false ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {[
                            { title: "All Conflict Reported", count: conflictStore.dashboardData?.ALL_CONFLICT_REPORT },
                            { title: "Conflicts Resolved", count: conflictStore.dashboardData?.RESOLVED_CONFLICT },
                            { title: "Conflicts Pending Resolution", count: conflictStore.dashboardData?.PENDING_CONFLICT },
                            { title: "Conflicts in Court", count: conflictStore.dashboardData?.CONFLICTS_IN_COURT },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
                            >
                                <h3 className="text-sm font-medium text-gray-600">{item.title}</h3>
                                <p className="text-2xl font-bold text-gray-800">{item.count}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <h3 className="text-xs font-medium text-gray-600 mb-2">Status of Conflict</h3>
                            <div className="h-80 flex items-center justify-center">
                                <Pie
                                    data={pieDataStatusOfConflict}
                                    options={{
                                        plugins: {
                                            datalabels: {
                                                color: "#222",
                                                font: { weight: "bold" },
                                                formatter: (value: number, context: any) => {
                                                    const dataArr = context.chart.data.datasets[0].data;
                                                    const total = dataArr.reduce((a: number, b: number) => a + b, 0);
                                                    const percent = total ? ((value / total) * 100).toFixed(0) : 0;
                                                    return `${percent}%`;
                                                },
                                            },
                                            legend: { display: true },
                                        },
                                    }}
                                    plugins={[ChartDataLabels]}
                                />
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <h3 className="text-xs font-medium text-gray-600 mb-2">Status of Court Litigation</h3>
                            <div className="h-80 flex items-center justify-center">
                                <Pie
                                    data={pieDataCourtLitigation}
                                    options={{
                                        plugins: {
                                            datalabels: {
                                                color: "#222",
                                                font: { weight: "bold" },
                                                formatter: (value: number, context: any) => {
                                                    const dataArr = context.chart.data.datasets[0].data;
                                                    const total = dataArr.reduce((a: number, b: number) => a + b, 0);
                                                    const percent = total ? ((value / total) * 100).toFixed(0) : 0;
                                                    return `${percent}%`;
                                                },
                                            },
                                            legend: { display: true },
                                        },
                                    }}
                                    plugins={[ChartDataLabels]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Report Frequency and Major Causes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 ">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-600 mb-4">Report Frequency</h3>
                            <Line data={lineDataReportFrequency} />
                        </div>
                        <div className="bg-white p-9 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-600 mb-4">Major Causes of Conflict</h3>
                            {conflictStore.dashboardData?.CAUSE_OF_CONFLICT.length! > 0 ? (
                                <ul className="space-y-2">
                                    {conflictStore.dashboardData?.CAUSE_OF_CONFLICT.map((cause, index) => (
                                        <li key={index} className="flex justify-between text-sm text-gray-600">
                                            <span className="font-bold text-lg">{removeUnderscores(cause.label)}</span>
                                            <span className="font-bold text-lg">{cause.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mt-8 h-[40vh] text-center flex items-center justify-center border border-grey-500 rounded-lg">
                                    <div>
                                        <img className="mx-auto" src={IMG} alt="No data available" style={{ width: "200px" }} />
                                        <div className="mt-2">
                                            <h3 className="text-base lg:text-lg font-semibold text-grey-500">
                                                No major cause of conflict
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resolved and Unresolved Conflicts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Resolved Conflict</h3>
                                <button className="text-blue-600 text-sm font-medium hover:underline" onClick={toTable}>See All</button>
                            </div>

                            <ResolvedConflict conflictStore={conflictStore} />
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Unresolved Conflict</h3>
                                <button className="text-blue-600 text-sm font-medium hover:underline" onClick={toTable}>See All</button>
                            </div>

                            <UnresolvedConflict conflictStore={conflictStore} />
                        </div>
                    </div>
                </>

            ):(
                <GeneralConflictTable/>
            )}

        </div>
    );
});

export default GeneralConflict;