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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CommunitySatisfactionDashboard = observer(
    ({ satisfactionStore }: { satisfactionStore: ISatisfactionStore }) => {
        useEffect(() => {
            async function fetchData() {
                let selectedTrustId = window.sessionStorage.getItem("selectedTrustId");
                await satisfactionStore.getSatisfactionDashboardByTrustId(
                    selectedTrustId as string
                );
            }
            fetchData();
        }, [satisfactionStore]);

        // Bar chart options
        const barOptions = {
            plugins: {
                legend: {
                    display: false, // Disable the legend
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: "Responses",
                    },
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: "total",
                    },
                },
            },
        };

        const pieOptions = {
            plugins: {
                legend: {
                    position: "bottom" as const, // Fix the type error
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        };

        // Generate bar chart data dynamically
        const generateBarData = (data: number[]) => ({
            labels: ["STRONGLY DISAGREE", "DISAGREE", "SLIGHTLY AGREE", "AGREE", "STRONGLY AGREE"],
            datasets: [
                {
                    label: "10%",
                    data: data,
                    backgroundColor: ["#EF4444", "#de9292", "#FACC15", "#3B82F6", "#22C55E"],
                },
            ],
        });

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
        return (
            <div className="p-6 bg-gray-100 ">
                <div className=" mx-auto space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Question 1 */}
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                We feel well-informed about the implemented projects by the Trust governing structure.
                            </h3>
                            <div className="h-48 sm:h-56">
                                <Bar
                                    data={generateBarData(
                                        satisfactionStore.dashboardData?.infoProjects || [0, 0, 0, 0, 0]
                                    )}
                                    options={barOptions}
                                />
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                We feel the community has been sufficiently consulted about the implemented projects by the Trust governing structure.
                            </h3>
                            <div className="h-48 sm:h-56">
                                <Bar
                                    data={generateBarData(
                                        satisfactionStore.dashboardData?.communityConsult || [0, 0, 0, 0, 0]
                                    )}
                                    options={barOptions}
                                />
                            </div>
                        </div>

                        {/* Question 3 */}
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                We feel sufficient opportunities have been given to local community members to participate in the HCDT projects.
                            </h3>
                            <div className="h-48 sm:h-56">
                                <Bar
                                    data={generateBarData(
                                        satisfactionStore.dashboardData?.localParticipation || [0, 0, 0, 0, 0]
                                    )}
                                    options={barOptions}
                                />
                            </div>
                        </div>

                        {/* Question 4 */}
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                There is a clear mechanism to report concerns to the governing structures and community complaints/concerns are efficiently addressed.
                            </h3>
                            <div className="h-48 sm:h-56">
                                <Bar
                                    data={generateBarData(
                                        satisfactionStore.dashboardData?.reportMechanism || [0, 0, 0, 0, 0]
                                    )}
                                    options={barOptions}
                                />
                            </div>
                        </div>

                        {/* Question 5 */}
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                                The way the governing structures have acted has minimized the potential for conflict in my community.
                            </h3>
                            <div className="h-48 sm:h-56">
                                <Bar
                                    data={generateBarData(
                                        satisfactionStore.dashboardData?.conflictMinimization || [0, 0, 0, 0, 0]
                                    )}
                                    options={barOptions}
                                />
                            </div>
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
                        <div className="h-40 sm:h-48">
                            <Pie
                                data={generatePieData(
                                    satisfactionStore.dashboardData?.projectHandover || [0, 0, 0, 0]
                                )}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            The Trust has consulted our community leadership to discuss or develop maintenance plans for all the completed projects implemented in our community.
                        </h3>
                        <div className="h-40 sm:h-48">
                            <Pie
                                data={generatePieData(
                                    satisfactionStore.dashboardData?.maintenanceConsult || [0, 0, 0, 0]
                                )}
                                options={pieOptions}
                            />
                        </div>
                    </div>

                    {/* Question 3 */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                            The Trust implemented or is implementing at least one income-generating project for the host communities.
                        </h3>
                        <div className="h-40 sm:h-48">
                            <Pie
                                data={generatePieData(
                                    satisfactionStore.dashboardData?.incomeProject || [0, 0, 0, 0]
                                )}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                </div>
                {/* Pie Charts Section */}
            </div>
        );
    }
);

export default CommunitySatisfactionDashboard;