import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { ISatisfactionStore } from "../../types/interface";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CommunitySatisfactionDashboard = observer(
    ({ satisfactionStore }: { satisfactionStore: ISatisfactionStore }) => {
        useEffect(() => {
            async function fetchData() {
                let selectedTrustId = window.sessionStorage.getItem("selectedTrustId");
                await satisfactionStore.getSatisfactionDashboardByTrustId(
                    selectedTrustId as string,
                    0,
                    "ALL",
                    "ALL"
                );
            }
            fetchData();
        }, [satisfactionStore]);

        // Bar chart options
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


        const generateSatisfactionPieData = (data: number[]) => ({
            labels: ["Strongly Disagree", "Disagree", "Slightly Agree", "Agree", "Strongly Agree"],
            datasets: [
                {
                    data,
                    backgroundColor: ["#EF4444", "#de9292", "#FACC15", "#3B82F6", "#22C55E"],
                    hoverBackgroundColor: ["#EF4444", "#de9292", "#FACC15", "#3B82F6", "#22C55E"],
                },
            ],
        });

        const satisfactionPieOptions = {
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: "#222",
                    font: { weight: "bold" as const },
                    formatter: (value: number, context: any) => {
                        if (!value || Number(value) === 0) return null;
                        const dataArr = context?.chart?.data?.datasets?.[0]?.data ?? [];
                        const total = Array.isArray(dataArr) ? dataArr.reduce((a: number, b: any) => a + (Number(b) || 0), 0) : 0;
                        const percent = total ? ((Number(value) / total) * 100).toFixed(0) : 0;
                        return percent === "0" ? null : `${percent}%`;
                    },
                },
                legend: {
                    display: true,
                    position: "right" as const,
                    labels: {
                        boxWidth: 14,
                        boxHeight: 14,
                        padding: 12,
                        font: { size: 11 },
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
                {/* Row 1: 3 charts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            We feel well-informed about the implemented projects by the Trust leaderships.
                        </h3>
                        <div className="h-[320px]">
                            <Pie key="cs-infoProjects" data={generateSatisfactionPieData(satisfactionStore.dashboardData?.infoProjects || [0, 0, 0, 0, 0])} options={satisfactionPieOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            We feel our community has been sufficiently consulted on projects by the Trust leaderships.
                        </h3>
                        <div className="h-[320px]">
                            <Pie key="cs-communityConsult" data={generateSatisfactionPieData(satisfactionStore.dashboardData?.communityConsult || [0, 0, 0, 0, 0])} options={satisfactionPieOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            We feel sufficient opportunities have been given to local community members to participate in the implemented HCDT projects.
                        </h3>
                        <div className="h-[320px]">
                            <Pie key="cs-localParticipation" data={generateSatisfactionPieData(satisfactionStore.dashboardData?.localParticipation || [0, 0, 0, 0, 0])} options={satisfactionPieOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                </div>
                {/* Row 2: 2 charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            There is a clear and effective mechanism in place to report community concerns to the Trust leadership.
                        </h3>
                        <div className="h-[320px]">
                            <Pie key="cs-reportMechanism" data={generateSatisfactionPieData(satisfactionStore.dashboardData?.reportMechanism || [0, 0, 0, 0, 0])} options={satisfactionPieOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            The way the Trust leadership (BoT, MC and AC) have acted has minimized the potential conflicts in the host communities.
                        </h3>
                        <div className="h-[320px]">
                            <Pie key="cs-conflictMinimization" data={generateSatisfactionPieData(satisfactionStore.dashboardData?.conflictMinimization || [0, 0, 0, 0, 0])} options={satisfactionPieOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            The Trust processes and actions have shown good level of transparency and accountability with the host communities.
                        </h3>
                        <div className="h-[320px]">
                            <Pie key="cs-trustTransparency" data={generateSatisfactionPieData(satisfactionStore.dashboardData?.trustTransparencyAndAccountability || [0, 0, 0, 0, 0])} options={satisfactionPieOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            We feel the Trust has fairly considered women, young people, and persons with disability (PwDs) in their engagements and project delivery.
                        </h3>
                        <div className="h-[320px]">
                            <Pie key="cs-fairInvolvement" data={generateSatisfactionPieData(satisfactionStore.dashboardData?.fairInvolvement || [0, 0, 0, 0, 0])} options={satisfactionPieOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                </div>
                <br />

                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                    Community Satisfaction with Settlors and NUPRC
                </h1>
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                        <h2 className="text-s font-medium text-gray-800 mb-2">The way the Settlor has acted has  minimized conflict and improved their relationship with the host communities.</h2>
                        <div className="h-80 flex items-center justify-center">
                            <Pie
                                key="cs-settlor"
                                data={pieDataForSettlorSatisfaction}
                                options={{
                                    plugins: {
                                        datalabels: {
                                            color: "#222",
                                            font: { weight: "bold" },
                                            formatter: (value: number, context: any) => {
                                                const dataArr = context?.chart?.data?.datasets?.[0]?.data ?? [];
                                                const total = Array.isArray(dataArr) ? dataArr.reduce((a: number, b: any) => a + (Number(b) || 0), 0) : 0;
                                                const percent = total ? ((Number(value) / total) * 100).toFixed(0) : 0;
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
                                key="cs-nuprc"
                                data={pieDataForNUPRCSatisfaction}
                                options={{
                                    plugins: {
                                        datalabels: {
                                            color: "#222",
                                            font: { weight: "bold" },
                                            formatter: (value: number, context: any) => {
                                                const dataArr = context?.chart?.data?.datasets?.[0]?.data ?? [];
                                                const total = Array.isArray(dataArr) ? dataArr.reduce((a: number, b: any) => a + (Number(b) || 0), 0) : 0;
                                                const percent = total ? ((Number(value) / total) * 100).toFixed(0) : 0;
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
                                    key="cs-projectHandover"
                                    data={generatePieData(
                                        satisfactionStore.dashboardData?.projectHandover || [0, 0, 0, 0]
                                    )}
                                    options={{
                                        plugins: {
                                            datalabels: {
                                                color: "#222",
                                                font: { weight: "bold", size: 16 },
                                                formatter: (value: number, context: any) => {
                                                    const dataArr = context?.chart?.data?.datasets?.[0]?.data ?? [];
                                                    const total = Array.isArray(dataArr) ? dataArr.reduce((a: number, b: any) => a + (Number(b) || 0), 0) : 0;
                                                    const percent = total ? ((Number(value) / total) * 100).toFixed(0) : 0;
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
                                    key="cs-maintenanceConsult"
                                    data={generatePieData(
                                        satisfactionStore.dashboardData?.maintenanceConsult || [0, 0, 0, 0]
                                    )}
                                    options={{
                                        plugins: {
                                            datalabels: {
                                                color: "#222",
                                                font: { weight: "bold", size: 16 },
                                                formatter: (value: number, context: any) => {
                                                    const dataArr = context?.chart?.data?.datasets?.[0]?.data ?? [];
                                                    const total = Array.isArray(dataArr) ? dataArr.reduce((a: number, b: any) => a + (Number(b) || 0), 0) : 0;
                                                    const percent = total ? ((Number(value) / total) * 100).toFixed(0) : 0;
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
                                    key="cs-incomeProject"
                                    data={generatePieData(
                                        satisfactionStore.dashboardData?.incomeProject || [0, 0, 0, 0]
                                    )}
                                    options={{
                                        plugins: {
                                            datalabels: {
                                                color: "#222",
                                                font: { weight: "bold", size: 16 },
                                                formatter: (value: number, context: any) => {
                                                    const dataArr = context?.chart?.data?.datasets?.[0]?.data ?? [];
                                                    const total = Array.isArray(dataArr) ? dataArr.reduce((a: number, b: any) => a + (Number(b) || 0), 0) : 0;
                                                    const percent = total ? ((Number(value) / total) * 100).toFixed(0) : 0;
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

export default CommunitySatisfactionDashboard;