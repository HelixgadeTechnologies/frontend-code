import { createContext, useCallback, useContext } from "react";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { observer } from "mobx-react-lite";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import DashboardTable from "../../../dashboard/table/DashboardTable";
import { FaRegStar, FaStar } from "react-icons/fa";
import dayjs from "dayjs";
import { dashboardStore as DashboardStore } from "../../../dashboard/store/dashboardStore";
import GoBackT from "../../../../components/elements/GoBackT";
import GeneralProjectTable from "../table/GeneralProjectTable";
import { trustStore as TrustStore } from "../../../trust/store/trustStore";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartDataLabels
);

const ProjectStoreCTX = createContext(ProjectStore);
const dashboardStoreCTX = createContext(DashboardStore);
const trustStoreCTX = createContext(TrustStore);

const GeneralProjectDashboard = observer(() => {
    const projectStore = useContext(ProjectStoreCTX);
    const dashboardStore = useContext(dashboardStoreCTX);
    const trustStore = useContext(trustStoreCTX);

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                align: "end" as const, // Align legend to the end
            },
            title: {
                display: false,
                text: "Chart.js Line Chart",
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    tickBorderDash: [3, 3],
                },
            },
        },
    };

    const labels = ["Males", "Females", "PwDs"];

    const data1 = {
        labels,
        datasets: [
            {
                label: "Community Members Benefitting",
                data: projectStore.dashboardData?.BENEFITS || [0, 0, 0],
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
        ],
    };

    const data2 = {
        labels,
        datasets: [
            {
                label: "Trust Community Members Employed",
                data: projectStore.dashboardData?.EMPLOYMENT || [0, 0, 0],
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
        ],
    };

    const pieChartData1 = {
        labels: ["EDUCATION", "ELECTRIFICATION", "AGRICULTURE", "HEALTH", "INFORMATION TECHNOLOGY", "ROAD", "WATER"],
        datasets: [
            {
                label: "Number of Trust Project by Category",
                data: projectStore.dashboardData?.CATEGORY || [0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    "rgb(54, 162, 235)",
                    "rgb(75, 192, 192)",
                    "rgb(201, 203, 207)",
                    "rgb(0, 0, 0)",
                    "rgb(255, 205, 86)",
                    "rgb(255, 99, 132)",
                    "rgb(255, 99, 32)",
                ],
            },
        ],
    };

    const pieChartData2 = {
        labels: ["YET TO START", "IN PROGRESS", "COMPLETED", "GOOD", "ABANDONED"],
        datasets: [
            {
                label: "Number of Trust Project by status",
                data: projectStore.dashboardData?.STATUS || [0, 0, 0, 0],
                backgroundColor: [
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                    "rgb(26, 233, 136)",
                    "rgb(62, 175, 251)",
                    "rgb(237, 12, 12)",
                ],
            },
        ],
    };
    const renderStars = (rating: number, max = 5) => {
        return (
            <span className="flex items-center gap-1">
                {Array.from({ length: max }, (_, i) =>
                    i < rating ? (
                        <FaStar key={i} className="text-[#FFB800] text-base" />
                    ) : (
                        <FaRegStar key={i} className="text-[#FFB800] text-base" />
                    )
                )}
            </span>
        );
    };
    const projectDetailsColumns = [
        { key: "trustName", label: "Trust" },
        { key: "projectTitle", label: "Project" },
        { key: "community", label: "Community" },
        {
            key: "createdAt",
            label: "Creation date",
            render: (row: any) => (
                <span className="bg-[#E6F7F0] text-[#3BB77E] rounded px-3 py-1 text-xs font-medium mr-2">
                    {dayjs(row.completeAt).format("DD-MM-YYYY hh:mm A")}
                </span>
            ),
        },
        {
            key: "rating",
            label: "Rating",
            render: (row: any) => (
                renderStars(row.rating)
            ),
        },
    ];
    const closeTable = useCallback(() => {
        dashboardStore.selectedTab = 1;
    }, [dashboardStore]);
    const setSwitch = useCallback(() => {
        projectStore.selectedTrust = trustStore.selectedTrustIdG as string;
        projectStore.searchProject(trustStore.selectedTrustIdG as string);
        projectStore.selectedProject = null;
        dashboardStore.projectSwitch = !dashboardStore.projectSwitch
    }, [dashboardStore]);
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <GoBackT action={closeTable} page="Trust table" />
            <br />
            <div className="flex items-center justify-between mb-9">
                {/* Title */}
                <h1 className="text-xl font-bold text-gray-800">
                    Development Projects {dashboardStore.projectSwitch ? "Table" : "Dashboard"}
                </h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Charts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={dashboardStore.projectSwitch}
                                onChange={setSwitch}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                        <span className="text-sm text-gray-600 ml-2">Table</span>
                    </div>

                </div>
            </div>
            {dashboardStore.projectSwitch == false && (
                <>
                    {/* Project Overview */}
                    <div className="bg-white rounded-xl p-8 shadow mb-6 mt-6 w-full">
                        <DashboardTable
                            header="Project details"
                            data={projectStore.dashboardData?.TOP_PROJECT}
                            columns={projectDetailsColumns}
                            emptyText="No data available"
                            loading={false}
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Line Chart 1 */}
                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <h3 className="font-semibold text-lg text-gray-600 mb-2">Number of community members benefitting from livelihood/ human capacity development initiatives</h3>
                            <div className="h-80 flex items-center justify-center">
                                <Line options={chartOptions} data={data1} />
                            </div>
                        </div>

                        {/* Pie Chart 1 */}
                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <h3 className="font-semibold  text-lg text-gray-600 mb-2"> Trust Projects by Category</h3>
                            <div className="h-80 flex items-center justify-center">
                                <Pie
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
                                    data={pieChartData1} />
                            </div>
                        </div>

                        {/* Line Chart 2 */}
                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <h3 className="font-semibold text-lg text-gray-600 mb-2"> Number of Trust community members who were locally employed by HCDT project contractors</h3>
                            <div className="h-80 flex items-center justify-center">
                                <Line options={chartOptions} data={data2} />
                            </div>
                        </div>


                        {/* Pie Chart 2 */}
                        <div className="bg-white p-3 rounded-md shadow-sm">
                            <h3 className="font-semibold text-lg text-gray-600 mb-2">Trust Projects by Status</h3>
                            <div className="h-80 flex items-center justify-center">
                                <Pie
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
                                    data={pieChartData2} />
                            </div>
                        </div>
                    </div>
                </>
            )}
            {dashboardStore.projectSwitch == true && (
                <GeneralProjectTable />
            )}

        </div>
    );
});

export default GeneralProjectDashboard;