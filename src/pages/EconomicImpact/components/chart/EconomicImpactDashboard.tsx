import { Pie, Line } from "react-chartjs-2";
// import { economicImpactStore as EconomicImpactStore } from "../../store/economicImpactStore";
import { useEffect } from "react";
import { Observer, observer } from "mobx-react-lite";

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
import { IEconomicImpactStore } from "../../types/interface";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

// Register the required components
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

const EconomicImpactDashboard = observer(({ economicImpactStore }: { economicImpactStore: IEconomicImpactStore }) => {


    useEffect(() => {
        async function getData() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
            await economicImpactStore.getEconomicImpactDashboardByTrustId(selectedTrustId as string, 0, "ALL", "ALL");
            console.log("hello");

        }
        getData();
        return () => { };
    }, [economicImpactStore]);

    // Data for the pie charts
    const pieData1 = {
        labels: ["Very True", "Slightly", "Not True"],
        datasets: [
            {
                data: economicImpactStore?.dashboardData?.incomeIncrease.length! > 0 ? [...economicImpactStore?.dashboardData?.businessGrowth as Array<number>] : [0, 0, 0],
                backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
                hoverBackgroundColor: ["#16A34A", "#EAB308", "#DC2626"],
            },
        ],
    };

    const pieData2 = {
        labels: ["Very True", "Slightly", "Not True"],
        datasets: [
            {
                data: economicImpactStore?.dashboardData?.incomeIncrease.length! > 0 ? [...economicImpactStore?.dashboardData?.incomeIncrease as Array<number>] : [0, 0, 0],
                backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
                hoverBackgroundColor: ["#16A34A", "#EAB308", "#DC2626"],
            },
        ],
    };

    const pieData3 = {
        labels: ["Very True", "Slightly", "Not True"],
        datasets: [
            {
                data: economicImpactStore?.dashboardData?.livelihoodImprove.length! > 0 ? [...economicImpactStore?.dashboardData?.livelihoodImprove as Array<number>] : [0, 0, 0],
                backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
                hoverBackgroundColor: ["#16A34A", "#EAB308", "#DC2626"],
            },
        ],
    };

    // Data for the line chart
    const lineData = {
        labels: [
            "Good Roads",
            "Healthcare",
            "Education",
            "Portable Water",
            "Electricity",
            "Market",
            "Favourable Business Environment",
        ],
        datasets: [
            {
                label: "Access to Basic Amenities",
                data: economicImpactStore?.dashboardData?.accessAmenities.length! > 0 ? [...economicImpactStore?.dashboardData?.accessAmenities as Array<number>] : [0, 0, 0, 0, 0, 0, 0],
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="p-6 bg-gray-100">
            <div className=" mx-auto space-y-8">
                {/* Pie Charts */}
                <Observer>
                    {() => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                    My business is generating more money since they implemented some
                                    of the HCDT projects in my community.
                                </h3>
                                <div className="h-48 sm:h-56">
                                    <Pie
                                        data={pieData1}
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
                                                legend: {
                                                    position: "bottom" as const,
                                                    align: "end" as const, // Align legend to the end
                                                },
                                            },
                                        }}
                                        plugins={[ChartDataLabels]}
                                    />
                                </div>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                    My income has increased since the implementation of some of the
                                    HCDT projects in my community.
                                </h3>
                                <div className="h-48 sm:h-56">
                                    <Pie
                                        data={pieData2}
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
                                                legend: {
                                                    position: "bottom" as const,
                                                    align: "end" as const, // Align legend to the end
                                                },
                                                // legend: { display: true },
                                            },
                                        }}
                                        plugins={[ChartDataLabels]}
                                    />
                                </div>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                    The implemented HCDT projects have bettered my livelihood and
                                    quality of lives.
                                </h3>
                                <div className="h-48 sm:h-56">
                                    <Pie
                                        data={pieData3}
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
                                                legend: {
                                                    position: "bottom" as const,
                                                    align: "end" as const, // Align legend to the end
                                                },
                                            },
                                        }}
                                        plugins={[ChartDataLabels]}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Observer>

                {/* Line Chart */}

                <Observer>
                    {() => (
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                As a result of the HCDT projects, my household/I now have access to
                                these basic amenities than before.
                            </h3>
                            <div className="h-64 sm:h-80">
                                <Line

                                    data={lineData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            datalabels: {
                                                align: 'top',
                                                anchor: 'end',
                                                color: '#222',
                                                font: { weight: 'bold' },
                                                formatter: (value) => `${value}%`
                                            }
                                        },
                                        scales: {
                                            y: {
                                                ticks: {
                                                    callback: function (value) {
                                                        return `${value}%`;
                                                    }
                                                },
                                                min: 0,
                                                max: 100,
                                            }
                                        }
                                    }}
                                    plugins={[ChartDataLabels]}

                                />
                            </div>
                        </div>
                    )}
                </Observer>
            </div>
        </div>
    );
});

// export default EconomicImpactDashboard;

export default EconomicImpactDashboard;