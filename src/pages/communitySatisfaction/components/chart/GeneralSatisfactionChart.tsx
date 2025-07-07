import { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { observer } from "mobx-react-lite";
import { ISatisfactionStore } from "../../types/interface";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const GeneralSatisfactionChart = observer(
    ({ satisfactionStore }: { satisfactionStore: ISatisfactionStore }) => {
        useEffect(() => {
            async function fetchData() {
                let selectedTrustId = window.sessionStorage.getItem("selectedTrustIdG");
                await satisfactionStore.getSatisfactionDashboardByTrustId(
                    selectedTrustId as string,
                    0,
                    "ALL",
                    "ALL"
                );
            }
            fetchData();
        }, [satisfactionStore]);

       
        // const barOptions = {
        //     plugins: {
        //         legend: {
        //             display: false, // Disable the legend
        //         },
        //     },
        //     responsive: true,
        //     maintainAspectRatio: false,
        //     scales: {
        //         x: {
        //             stacked: true,
        //             title: {
        //                 display: true,
        //                 text: "Responses",
        //             },
        //         },
        //         y: {
        //             stacked: true,
        //             title: {
        //                 display: true,
        //                 text: "total",
        //             },
        //         },
        //     },
        // };

        // const pieOptions = {
        //     plugins: {
        //         legend: {
        //             position: "bottom" as const, // Fix the type error
        //         },
        //     },
        //     responsive: true,
        //     maintainAspectRatio: false,
        // };

        // Generate bar chart data dynamically
        // const generateBarData = (data: number[]) => ({
        //     labels: ["STRONGLY DISAGREE", "DISAGREE", "SLIGHTLY AGREE", "AGREE", "STRONGLY AGREE"],
        //     datasets: [
        //         {
        //             label: "10%",
        //             data: data,
        //             backgroundColor: ["#EF4444", "#de9292", "#FACC15", "#3B82F6", "#22C55E"],
        //         },
        //     ],
        // });

        // Generate pie chart data dynamically
        const generatePieData = (data: number[]) => ({
            labels: ["In Progress", "True", "Project yet to be implemented in my community", "Not True"],
            datasets: [
                {
                    data: data,
                    backgroundColor: ["#3B82F6", "#22C55E", "#FACC15", "#EF4444"],
                    hoverBackgroundColor: ["#2563EB", "#16A34A", "#EAB308", "#DC2626"],
                },
            ],
        });


        // ...existing imports...

        // Add this function to generate grouped horizontal stacked bar data
        const generateGroupedBarData = (data: number[][]) => ({
            labels: [
                "We feel well-informed about Trust projects.",
                "There has been enough community consultation on Trust projects.",
                "The community has had fair opportunities to take part in HCDT projects.",
                "A clear system exists to report and address concerns.",
                "The actions of governing structures have reduced conflict in my community.",
                // "Communities Satisfaction with the the Settlor's.",
                // "Communities Satisfaction with the the NUPRC’s"
            ],
            datasets: [
                {
                    label: "Strongly Disagree",
                    data: data.map(d => d[0]),
                    backgroundColor: "#EF4444",
                },
                {
                    label: "Disagree",
                    data: data.map(d => d[1]),
                    backgroundColor: "#de9292",
                },
                {
                    label: "Slightly Agree",
                    data: data.map(d => d[2]),
                    backgroundColor: "#FACC15",
                },
                {
                    label: "Agree",
                    data: data.map(d => d[3]),
                    backgroundColor: "#3B82F6",
                },
                {
                    label: "Strongly Agree",
                    data: data.map(d => d[4]),
                    backgroundColor: "#22C55E",
                },
            ],
        });


        const groupedBarOptions = {
            indexAxis: 'y' as const,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                },
                datalabels: {
                    anchor: 'center' as const,
                    align: 'center' as const,
                    color: '#222',
                    font: {
                        weight: 'bold' as 'bold',
                        size: 12,
                    },
                    formatter: function (value: number) {
                        return `${value}%`;
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    type: 'linear' as const,
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage of Respondents',
                    },
                    ticks: {
                        stepSize: 20,
                        callback: function (tickValue: any) {
                            return `${tickValue}%`;
                        },
                    },
                },
                y: {
                    stacked: true,
                    type: 'category' as const,
                    title: {
                        display: false,
                    },
                },
            },
        };

        const pieDataForSettlorSatisfaction = {
            labels: ["Strongly Disagree", "Disagree", "Slightly Agree", "Agree", "Strongly Agree"],
            datasets: [
                {
                    data: satisfactionStore.dashboardData?.settlorAction || [0, 0, 0, 0, 0],
                    backgroundColor: ["#EF4444", "#de9292", "#FACC15", "#3B82F6", "#22C55E"],
                    hoverBackgroundColor: ["#EF4444", "#de9292", "#FACC15", "#3B82F6", "#22C55E"],
                },
            ],
        };
        const pieDataForNUPRCSatisfaction = {
            labels: ["Strongly Disagree", "Disagree", "Slightly Agree", "Agree", "Strongly Agree"],
            datasets: [
                {
                    data: satisfactionStore.dashboardData?.nuprcAction || [0, 0, 0, 0, 0],
                    backgroundColor: ["#EF4444", "#de9292", "#FACC15", "#3B82F6", "#22C55E"],
                    hoverBackgroundColor: ["#EF4444", "#de9292", "#FACC15", "#3B82F6", "#22C55E"],
                },
            ],
        };


        return (
            <div className="p-6 ">
                <div className=" mx-auto space-y-8">
                    <div className="h-[400px] sm:h-[500px]">
                        <Bar
                            data={generateGroupedBarData([
                                satisfactionStore.dashboardData?.infoProjects || [0, 0, 0, 0, 0],
                                satisfactionStore.dashboardData?.communityConsult || [0, 0, 0, 0, 0],
                                satisfactionStore.dashboardData?.localParticipation || [0, 0, 0, 0, 0],
                                satisfactionStore.dashboardData?.reportMechanism || [0, 0, 0, 0, 0],
                                satisfactionStore.dashboardData?.conflictMinimization || [0, 0, 0, 0, 0],
                                // satisfactionStore.dashboardData?.settlorAction || [0, 0, 0, 0, 0],
                                // satisfactionStore.dashboardData?.nuprcAction || [0, 0, 0, 0, 0],
                            ])}
                            options={groupedBarOptions}
                            plugins={[ChartDataLabels]}
                        />
                    </div>

                </div>
                <br />
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                        <h2 className="text-s font-medium text-gray-800 mb-2">The way the Settlor has acted has  minimized conflict and improved their relationship with the host communities.</h2>
                        <div className="h-80 flex items-center justify-center">
                            <Pie
                                data={pieDataForSettlorSatisfaction}
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
                                            align: "center" as const, // Align legend to the end
                                        },
                                    },
                                }}
                                plugins={[ChartDataLabels]}
                            />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                        <h2 className="text-s font-medium text-gray-800 mb-2">The way NUPRC is regulating and responding is effectively addressing disputes emanating from the implementation of the HCDT, and promoting improved relationships between host communities and Settlor's.</h2>
                        <div className="h-80 flex items-center justify-center">
                            <Pie
                                data={pieDataForNUPRCSatisfaction}
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
                                            align: "center" as const, // Align legend to the end
                                        },
                                    },
                                }}
                                plugins={[ChartDataLabels]}
                            />
                        </div>
                    </div>
                </div>

                {/* Pie Charts Section */}
                <br />
                <br />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                    Existence, and activeness of sustainability management structure/committees established by the Trust
                </h1>
                <p className="text-sm text-gray-600 mb-6">
                    These are your personal details, they are visible to the public
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Question 1 */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            The Trust commissioned and handed over completed projects in our community to the community leadership?
                        </h3>
                        <div className="flex flex-col items-center">
                            <div className="h-52 w-52 mb-4">
                                <Pie
                                    data={generatePieData(
                                        satisfactionStore.dashboardData?.projectHandover || [0, 0, 0, 0]
                                    )}
                                    options={{
                                        plugins: {
                                            datalabels: {
                                                color: "#222",
                                                font: { weight: "bold", size: 16 },
                                                formatter: (value: number, context: any) => {
                                                    const dataArr = context.chart.data.datasets[0].data;
                                                    const total = dataArr.reduce((a: number, b: number) => a + b, 0);
                                                    const percent = total ? ((value / total) * 100).toFixed(0) : 0;
                                                    return `${percent}%`;
                                                },
                                            },
                                            legend: {
                                                display: true,
                                                position: "bottom" as const,
                                                align: "center" as const,
                                                labels: {
                                                    boxWidth: 18,
                                                    boxHeight: 18,
                                                    padding: 10,
                                                    font: { size: 9 },
                                                },
                                            },
                                        },
                                    }}
                                    plugins={[ChartDataLabels]}
                                    height={260}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            The Trust has consulted our community leadership to discuss or develop maintenance plans for all the completed projects implemented in our community.
                        </h3>
                        <div className="flex flex-col items-center">
                            <div className="h-52 w-52 mb-4">
                                <Pie
                                    data={generatePieData(
                                        satisfactionStore.dashboardData?.maintenanceConsult || [0, 0, 0, 0]
                                    )}
                                    options={{
                                        plugins: {
                                            datalabels: {
                                                color: "#222",
                                                font: { weight: "bold", size: 16 },
                                                formatter: (value: number, context: any) => {
                                                    const dataArr = context.chart.data.datasets[0].data;
                                                    const total = dataArr.reduce((a: number, b: number) => a + b, 0);
                                                    const percent = total ? ((value / total) * 100).toFixed(0) : 0;
                                                    return `${percent}%`;
                                                },
                                            },
                                            legend: {
                                                display: true,
                                                position: "bottom" as const,
                                                align: "center" as const,
                                                labels: {
                                                    boxWidth: 18,
                                                    boxHeight: 18,
                                                    padding: 10,
                                                    font: { size: 9 },
                                                },
                                            },
                                        },
                                    }}
                                    plugins={[ChartDataLabels]}
                                    height={260}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Question 3 */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            The Trust implemented or is implementing at least one income-generating project for the host communities.
                        </h3>
                        <div className="flex flex-col items-center">
                            <div className="h-52 w-52 mb-4">
                                <Pie
                                    data={generatePieData(
                                        satisfactionStore.dashboardData?.incomeProject || [0, 0, 0, 0]
                                    )}
                                    options={{
                                        plugins: {
                                            datalabels: {
                                                color: "#222",
                                                font: { weight: "bold", size: 16 },
                                                formatter: (value: number, context: any) => {
                                                    const dataArr = context.chart.data.datasets[0].data;
                                                    const total = dataArr.reduce((a: number, b: number) => a + b, 0);
                                                    const percent = total ? ((value / total) * 100).toFixed(0) : 0;
                                                    return `${percent}%`;
                                                },
                                            },
                                            legend: {
                                                display: true,
                                                position: "bottom" as const,
                                                align: "center" as const,
                                                labels: {
                                                    boxWidth: 18,
                                                    boxHeight: 18,
                                                    padding: 10,
                                                    font: { size: 9 },
                                                },
                                            },
                                        },
                                    }}
                                    plugins={[ChartDataLabels]}
                                    height={260}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Pie Charts Section */}
            </div>
        );
    }
);

export default GeneralSatisfactionChart;