import { createContext, useContext } from "react";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { observer } from "mobx-react-lite";
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ProjectStoreCTX = createContext(ProjectStore);

const ProjectDashboard = observer(() => {
    const projectStore = useContext(ProjectStoreCTX);

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

    const pieChartOptions: ChartOptions<"pie"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                align: "end" as const, // Align legend to the end
            },
            title: {
                display: true,
                text: "Number of Trust Project by Category",
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
        labels: ["EDUCATION", "ELECTRIFICATION", "AGRICULTURE", "HEALTH", "INFORMATION_TECHNOLOGY", "ROAD", "WATER"],
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
        labels: ["YET_TO_START", "IN_PROGRESS", "COMPLETED", "GOOD", "ABANDONED"],
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

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Project Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Project Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-gray-700">Total Budget</h3>
                        <p className="text-xl font-bold text-gray-800">NGN {projectStore.dashboardData?.TOTAL_BUDGET.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-gray-700">Annual Budget Allocation</h3>
                        <p className="text-xl font-bold text-gray-800">NGN {projectStore.dashboardData?.TOTAL_ANNUAL_BUDGET.toLocaleString() || "0"}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart 1 */}
                <div className="bg-white p-3 rounded-md shadow-sm">
                    <h3 className="text-xs font-medium text-gray-600 mb-2">Number of community members benefitting from livelihood/ human capacity development initiatives</h3>
                    <div className="h-80 flex items-center justify-center">
                        <Line options={chartOptions} data={data1} />
                    </div>
                </div>

                {/* Pie Chart 1 */}
                <div className="bg-white p-3 rounded-md shadow-sm">
                    <h3 className="text-xs font-medium text-gray-600 mb-2"> Number of Trust Project by Category</h3>
                    <div className="h-80 flex items-center justify-center">
                        <Pie options={pieChartOptions} data={pieChartData1} />
                    </div>
                </div>

                {/* Line Chart 2 */}
                <div className="bg-white p-3 rounded-md shadow-sm">
                    <h3 className="text-xs font-medium text-gray-600 mb-2"> Number of Trust community members who were locally employed by HCDT project contractors</h3>
                    <div className="h-80 flex items-center justify-center">
                        <Line options={chartOptions} data={data2} />
                    </div>
                </div>


                {/* Pie Chart 2 */}
                <div className="bg-white p-3 rounded-md shadow-sm">
                    <h3 className="text-xs font-medium text-gray-600 mb-2">Number of Trust Project by Status</h3>
                    <div className="h-80 flex items-center justify-center">
                        <Pie options={pieChartOptions} data={pieChartData2} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProjectDashboard;