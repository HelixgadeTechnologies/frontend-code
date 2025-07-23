import { FaStar, FaRegStar } from "react-icons/fa";
import {
    ChartOptions,
} from "chart.js";
import { Doughnut, Bar, Line, Pie } from "react-chartjs-2";
import DashboardTable, { DashboardTableColumn } from "../table/DashboardTable";
import { Observer, observer } from "mobx-react-lite";
import { dashboardStore as DashboardStore } from "../store/dashboardStore";
import { useContext, createContext, useCallback } from "react";
import dayjs from "dayjs";
import { IConflictView } from "../../conflict/types/interface";
import IMG from "../../../assets/svgs/dashboardConflictNotFound.svg"
import { economicImpactStore as EconomicImpactStore } from "../../EconomicImpact/store/economicImpactStore";
import { satisfactionStore as SatisfactionStore } from "../../communitySatisfaction/store/satisfactionStore";
import { conflictStore as ConflictStore } from "../../conflict/store/conflictStore";
import { projectStore as ProjectStore } from "../../project/store/projectStore";
import { IConflictResolutionOverTime } from "../types/interface";
import { year } from "../../../utils/data";
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import { ISettlor } from "../../Settings/types/interface";
import { settingStore as SettingStore } from "../../Settings/store/settingStore";
import ChartDataLabels from "chartjs-plugin-datalabels";
import FloatingStepper from "./FloatingStepper";
import { ITrustList } from "../../trust/types/interface";

const dashboardStoreCTX = createContext(DashboardStore);
const settingStoreCTX = createContext(SettingStore);
const trustStoreCTX = createContext(TrustStore);
const economicImpactStoreCTX = createContext(EconomicImpactStore);
const satisfactionStoreCTX = createContext(SatisfactionStore);
const conflictStoreCTX = createContext(ConflictStore);
const projectStoreCTX = createContext(ProjectStore);
const GeneralDashboard: React.FC = observer(() => {
    const dashboardStore = useContext(dashboardStoreCTX);
    const settingStore = useContext(settingStoreCTX);
    const trustStore = useContext(trustStoreCTX);
    const economicImpactStore = useContext(economicImpactStoreCTX);
    const satisfactionStore = useContext(satisfactionStoreCTX);
    const conflictStore = useContext(conflictStoreCTX);
    const projectStore = useContext(projectStoreCTX);

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
    // Bar chart data
    const barData = {
        // labels: ["Rivers", "Edo", "Cross Rivers", "Delta", "Bayelsa", "Akwa Ibom"],
        labels: dashboardStore.dashboardData?.COMMUNITY_BENEFIT.state,
        datasets: [
            {
                label: "Communities",
                data: dashboardStore.dashboardData?.COMMUNITY_BENEFIT.total,
                backgroundColor: "#3366CC",
                borderRadius: 6,
                barThickness: 24,
            },
        ],
    };

    const barOptions = {
        plugins: {
            legend: { display: false },
            datalabels: {
                color: "#fff", // Set datalabels (data value text) to white
                font: { weight: "bold" as "bold" },
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: "#8C4A6" } },
            y: { grid: { color: "#F3F5F7" }, ticks: { color: "#8C94A6", stepSize: 20 } },
        },
        layout: { padding: 20 },

    };

    // Doughnut chart data
    const doughnutData = {
        labels: ["Completed", "Not Completed"],
        datasets: [
            {
                data: [dashboardStore.dashboardData?.COMPLETION_STATUS.percentFullyEstablished, 100 - dashboardStore.dashboardData?.COMPLETION_STATUS.percentFullyEstablished!],
                backgroundColor: ["#3366CC", "#F3F5F7"],
                borderWidth: 0,
            },
        ],
    };

    const doughnutOptions = {
        cutout: "75%",
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };





    // Add this before your return statement
    const localEmploymentBarData = {
        labels: dashboardStore.dashboardData?.EMPLOYEE_PER_PROJECT.map(e => e.projectTitle),
        datasets: [
            {
                label: "Male",
                data: dashboardStore.dashboardData?.EMPLOYEE_PER_PROJECT.map(e => e.numberOfMaleEmployedByContractor),
                backgroundColor: "#22C55E",
                borderRadius: 4,
                stack: "Stack 0",
            },
            {
                label: "Female",
                data: dashboardStore.dashboardData?.EMPLOYEE_PER_PROJECT.map(e => e.numberOfFemaleEmployedByContractor),
                backgroundColor: "#EF4444",
                borderRadius: 4,
                stack: "Stack 0",
            },
            {
                label: "Pwds",
                data: dashboardStore.dashboardData?.EMPLOYEE_PER_PROJECT.map(e => e.numberOfPwDsEmployedByContractor),
                backgroundColor: "#EF8",
                borderRadius: 4,
                stack: "Stack 0",
            },
        ],
    };
    const BoTData = {
        labels: ["BoT Committee", "Advisory Committee", "Management Committee"],
        datasets: [
            {
                label: "Male",
                data: dashboardStore.dashboardData?.BOT_DISPLAY.male,
                backgroundColor: "#22C55E",
                borderRadius: 4,
                stack: "Stack 0",
            },
            {
                label: "Female",
                data: dashboardStore.dashboardData?.BOT_DISPLAY.female,
                backgroundColor: "#EF4444",
                borderRadius: 4,
                stack: "Stack 0",
            },
            {
                label: "Pwds",
                data: dashboardStore.dashboardData?.BOT_DISPLAY.pwd,
                backgroundColor: "#EF8",
                borderRadius: 4,
                stack: "Stack 0",
            },
        ],
    };

    const FundsData = {
        labels: dashboardStore.dashboardData?.FUNDS_DISTRIBUTION_PERCENTAGE.yearReceived,
        datasets: [
            {
                label: "Fully Received",
                data: dashboardStore.dashboardData?.FUNDS_DISTRIBUTION_PERCENTAGE.pct_paymentCheck_1,
                backgroundColor: "#22C55E",
                borderRadius: 4,
                stack: "Stack 0",
            },
            {
                label: "Partly Received",
                data: dashboardStore.dashboardData?.FUNDS_DISTRIBUTION_PERCENTAGE.pct_paymentCheck_2,
                backgroundColor: "#EF8",
                borderRadius: 4,
                stack: "Stack 0",
            },
            {
                label: "Not Received",
                data: dashboardStore.dashboardData?.FUNDS_DISTRIBUTION_PERCENTAGE.pct_paymentCheck_3,
                backgroundColor: "#EF4444",
                borderRadius: 4,
                stack: "Stack 0",
            },
        ],
    };
    const conflictBarOptions = {
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
                align: "end" as const,
                labels: {
                    boxWidth: 12,
                    boxHeight: 12,
                    usePointStyle: true,
                    padding: 20,
                },
            },
            tooltip: { enabled: true },
            datalabels: {
                anchor: 'center' as const,
                align: 'center' as const,
                color: '#222',
                font: { weight: 'bold' },
                formatter: function (value: number) {
                    return `${value}%`;
                },
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: { color: "#8C94A6" },
            },
            y: {
                stacked: true,
                grid: { color: "#E5E7EB" },
                ticks: { color: "#8C94A6" },
                beginAtZero: true,
            },
        },
    } as const; // <== This helps in some cases too


    // Chart data and options
    const conflictStatusData = {
        labels: ["Resolved", "Unresolved"],
        datasets: [
            {
                data: [dashboardStore.dashboardData?.CONFLICT_RESOLUTION_PERCENTAGE.resolvedPercentage, dashboardStore.dashboardData?.CONFLICT_RESOLUTION_PERCENTAGE.unresolvedPercentage],
                backgroundColor: ["#22C55E", "#EA580C"],
                borderWidth: 0,
                cutout: "75%",
            },
        ],
    };

    const conflictStatusOptions = {
        cutout: "75%",
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };


    // community table data

    const communityColumns: DashboardTableColumn[] = [
        { key: "projectTitle", label: "Projects" },
        { key: "community", label: "Community" },
        {
            key: "totalEmployed",
            label: "Number of workers",
            render: (row: any) => (
                <span
                    className={
                        row.totalEmployed > 40
                            ? "bg-[#E6F7F0] text-[#3BB77E] rounded px-2 py-1 text-xs font-medium"
                            : "bg-[#FFF3ED] text-[#FF9C66] rounded px-2 py-1 text-xs font-medium"
                    }
                >
                    {row.totalEmployed}
                </span>
            ),
        },
    ];


    // Conflict table Data 
    // Example data and columns for the "Conflict Details" table


    const conflictDetailsColumns: DashboardTableColumn[] = [
        { key: "causeOfConflictName", label: "Cause" },
        { key: "partiesInvolveName", label: "Parties Involved" },
        { key: "community", label: "Community" },
        {
            key: "conflictStatusName",
            label: "Resolved Status",
            render: (row) =>
                row.status === "THE ISSUE HAS BEEN EFFECTIVELY ADDRESSED" ? (
                    <span className="bg-[#E6F7F0] text-[#3BB77E] rounded px-3 py-1 text-xs font-medium">
                        Resolved
                    </span>
                ) : (
                    <span className="bg-[#FFF3ED] text-[#FF9C66] rounded px-3 py-1 text-xs font-medium">
                        Ongoing
                    </span>
                ),
        },
    ];

    // Usage example in your component:
    // Project Details Table Data


    // Project Details Table Columns

    const projectDetailsColumns = [
        { key: "trustName", label: "Trust" },
        { key: "projectTitle", label: "Project" },
        { key: "community", label: "Community" },
        {
            key: "completeAt",
            label: "Completion date",
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
    const conflictDetailsColumnsR = [
        { key: "trustName", label: "Trust Name" },
        { key: "causeOfConflictName", label: "Cause" },
        {
            key: "createAt",
            label: "Report Date",
            render: (row: any) => (
                <span className="bg-[#E6F7F0] text-[#3BB77E] rounded px-3 py-1 text-xs font-medium mr-2">
                    {dayjs(row.createAt).format("DD-MM-YYYY hh:mm A")}
                </span>
            ),
        },
    ];



    // Economic Impact
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
            "Favorable Business Environment",
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

    // community satisfaction
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

    // Conflict
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

    function removeUnderscores(input: string): string {
        return input.replace(/_/g, ' ');
    }

    // Project
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
    const doughnutColors = [
        "#FF6384", // pink/red
        "#36A2EB", // blue
        "#FFCE56", // yellow
        "#4BC0C0", // teal
        "#9966FF", // purple
        "#FF9F40", // orange
        "#00C49A", // green
        "#C0C0C0"  // gray
    ];
    const setSelectedYear = useCallback((v: string) => {
        async function getInfo() {
            dashboardStore.selectedYear = Number(v)
            dashboardStore.dashboardData = null
            await dashboardStore.getDashboard(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, Number(v), dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor)
            economicImpactStore.isDashboardLoading = false;
            economicImpactStore.dashboardData = null;
            await economicImpactStore.getEconomicImpactDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, Number(v), dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            satisfactionStore.isDashboardLoading = false;
            satisfactionStore.dashboardData = null;
            await satisfactionStore.getSatisfactionDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, Number(v), dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            conflictStore.isDashboardLoading = false;
            conflictStore.dashboardData = null;
            await conflictStore.getConflictDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, Number(v), dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            projectStore.isDashboardLoading = false;
            projectStore.dashboardData = null;
            await projectStore.getProjectDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, Number(v), dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
        }
        getInfo()
    }, [dashboardStore]);

    const selectState = useCallback((v: string) => {
        async function getInfo() {
            dashboardStore.selectedState = v
            dashboardStore.dashboardData = null
            await dashboardStore.getDashboard(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, v, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor)
            economicImpactStore.isDashboardLoading = false;
            economicImpactStore.dashboardData = null;
            await economicImpactStore.getEconomicImpactDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, v, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            satisfactionStore.isDashboardLoading = false;
            satisfactionStore.dashboardData = null;
            await satisfactionStore.getSatisfactionDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, v, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            conflictStore.isDashboardLoading = false;
            conflictStore.dashboardData = null;
            await conflictStore.getConflictDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, v, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            projectStore.isDashboardLoading = false;
            projectStore.dashboardData = null;
            await projectStore.getProjectDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, v, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
        }
        getInfo()
    }, [dashboardStore]);

    const selectSettlor = useCallback((v: string) => {
        async function getInfo() {
            dashboardStore.selectedSettlor = v
            dashboardStore.dashboardData = null
            await dashboardStore.getDashboard(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, v)
            economicImpactStore.isDashboardLoading = false;
            economicImpactStore.dashboardData = null;
            await economicImpactStore.getEconomicImpactDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, v);
            satisfactionStore.isDashboardLoading = false;
            satisfactionStore.dashboardData = null;
            await satisfactionStore.getSatisfactionDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, v);
            conflictStore.isDashboardLoading = false;
            conflictStore.dashboardData = null;
            await conflictStore.getConflictDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, v);
            projectStore.isDashboardLoading = false;
            projectStore.dashboardData = null;
            await projectStore.getProjectDashboardByTrustId(dashboardStore.selectedTrust == "ALL" ? "ALL" : dashboardStore.selectedTrust, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, v);
        }
        getInfo()
    }, [dashboardStore]);
    const selectTrust = useCallback((v: string) => {
        async function getInfo() {
            dashboardStore.selectedTrust = v
            dashboardStore.dashboardData = null
            await dashboardStore.getDashboard(v, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor)
            economicImpactStore.isDashboardLoading = false;
            economicImpactStore.dashboardData = null;
            await economicImpactStore.getEconomicImpactDashboardByTrustId(v, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            satisfactionStore.isDashboardLoading = false;
            satisfactionStore.dashboardData = null;
            await satisfactionStore.getSatisfactionDashboardByTrustId(v, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            conflictStore.isDashboardLoading = false;
            conflictStore.dashboardData = null;
            await conflictStore.getConflictDashboardByTrustId(v, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
            projectStore.isDashboardLoading = false;
            projectStore.dashboardData = null;
            await projectStore.getProjectDashboardByTrustId(v, dashboardStore.selectedYear == 0 ? 0 : dashboardStore.selectedYear, dashboardStore.selectedState == "ALL" ? "ALL" : dashboardStore.selectedState, dashboardStore.selectedSettlor == "ALL" ? "ALL" : dashboardStore.selectedSettlor);
        }
        getInfo()
    }, [dashboardStore]);

    const dataM = [
        {
            name: "Completed",
            percentage: dashboardStore.dashboardData?.NEEDS_ASSESSMENT_PERCENTAGE?.percentage_status_1,
            color: doughnutColors[0],
        },
        {
            name: "In progress",
            percentage: dashboardStore.dashboardData?.NEEDS_ASSESSMENT_PERCENTAGE?.percentage_status_2,
            color: doughnutColors[1],
        },
        {
            name: "Yet to be conducted",
            percentage: dashboardStore.dashboardData?.NEEDS_ASSESSMENT_PERCENTAGE?.percentage_status_3,
            color: doughnutColors[2],
        },
    ]

    return (
        <div className="bg-[#F3F5F7] min-h-screen p-6">
            <div id="trust-establishment" className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">

                <div>
                    <h2 className="font-semibold text-xl text-gray-900">General Dashboard</h2>
                    {/* <p className="text-gray-500 text-sm">Control your profile setup and integrations</p> */}
                </div>
                <div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 w-full justify-end">
                        <div className="flex flex-col">
                            <Observer>
                                {() => (
                                    <>
                                        <label className="text-sm font-medium text-gray-700 mb-1">Select Trust</label>
                                        <select
                                            className="border border-gray-300 rounded px-4 py-2 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white text-gray-700"
                                            value={dashboardStore.selectedTrust}
                                            onChange={e => selectTrust(e.target.value)}

                                        >
                                            <option key="ALL" value="ALL">ALL</option>
                                            {[...trustStore.allTrustList.values()].map((v: ITrustList) => (
                                                <option key={v.trustName} value={v.trustId}>{v.trustName}</option>
                                            ))}
                                        </select>

                                    </>
                                )}
                            </Observer>
                        </div>
                        <div className="flex flex-col">
                            <Observer>
                                {() => (
                                    <>
                                        <label className="text-sm font-medium text-gray-700 mb-1">Select Settlor</label>
                                        <select
                                            className="border border-gray-300 rounded px-4 py-2 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white text-gray-700"
                                            value={dashboardStore.selectedSettlor}
                                            onChange={e => selectSettlor(e.target.value)}

                                        >
                                            <option key="ALL" value="ALL">ALL</option>
                                            {[...settingStore.allSettlor.values()].map((v: ISettlor) => (
                                                <option key={v.settlorName} value={v.settlorName}>{v.settlorName}</option>
                                            ))}
                                        </select>

                                    </>
                                )}
                            </Observer>
                        </div>
                        <div className="flex flex-col">
                            <Observer>
                                {() => (
                                    <>
                                        <label className="text-sm font-medium text-gray-700 mb-1">Select State</label>
                                        <select
                                            className="border border-gray-300 rounded px-4 py-2 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white text-gray-700"
                                            value={dashboardStore.selectedState}
                                            onChange={e => selectState(e.target.value)}

                                        >
                                            {[...trustStore.allStates.values()].map((s: string) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>

                                    </>
                                )}
                            </Observer>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Select Year</label>
                            <select
                                className="border border-gray-300 rounded px-4 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white text-gray-700"
                                value={dashboardStore.selectedYear}
                                onChange={e => setSelectedYear(e.target.value)}
                            >
                                {year.map(year => (
                                    <option key={year.value} value={year.value}>{year.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Grid */}
            <h2 className="font-semibold text-xl text-gray-900 mb-4">Trust Establishment and Governance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* Left Column */}
                <div className="flex flex-col gap-5 h-full">
                    {/* HCDT Establishment and Governance */}
                    <div className="bg-white rounded-xl p-4 shadow flex flex-col gap-2">
                        <div className="text-xs text-gray-700 mb-1">Number/Percent of HCDT established by NUPRC</div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                                <div className="h-full bg-[#22C55E]" style={{ width: `${dashboardStore.dashboardData?.FIELDS_COMPLETION}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-700 font-semibold">{dashboardStore.dashboardData?.FIELDS_COMPLETION}%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{dashboardStore.dashboardData?.FIELDS_COMPLETION} out of 100 Trusts is fully Established</div>
                    </div>
                    {/* Communities benefiting by state */}
                    <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-4 flex-1 justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-700 font-medium">Total number of host communities involved with the HCDTs</span>
                            <span className="text-xs text-gray-500 font-medium">Total Number of all Benefiting Communities | {dashboardStore.dashboardData?.COMMUNITY_BENEFIT.total.reduce((sum: any, num: any) => sum + num, 0)}</span>
                        </div>
                        <div className="w-full h-56 flex items-end">
                            <Bar data={barData} options={barOptions} plugins={[ChartDataLabels]} />
                        </div>
                    </div>
                </div>
                {/* Right Column */}
                <div className="flex flex-col h-full">
                    {/* Number of Trust with Compliance */}
                    <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center gap-2 relative h-full justify-center">
                        <div className="font-semibold text-base text-gray-900 mb-2">Number of HCDTs with development plan fully completed by Settlor and readily available</div>
                        <div className="relative flex items-center justify-center w-44 h-44 my-4">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                            <span className="absolute text-3xl font-bold text-gray-900">{dashboardStore.dashboardData?.COMPLETION_STATUS.percentFullyEstablished}%</span>
                        </div>
                        <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
                            <div className="flex flex-col items-center flex-1">
                                <span className="font-semibold text-lg text-gray-900">{dashboardStore.dashboardData?.COMPLETION_STATUS.totalCompleteTrust}</span>
                                <span>Completed Development plan</span>
                            </div>

                            <div className="flex flex-col items-center flex-1">
                                <span className="font-semibold text-lg text-gray-900">{dashboardStore.dashboardData?.COMPLETION_STATUS.totalTrust}</span>
                                <span>Total number of Trust</span>
                            </div>
                        </div>
                        {/* <div className="w-full mt-4 flex justify-center">
              <span className="text-xs text-gray-500 bg-[#FFF6F0] px-2 py-1 rounded font-medium">
                <span className="text-[#FF6B00] font-semibold">62 Companies</span> available & assessment distribution
              </span>
            </div> */}
                    </div>
                </div>
            </div>
            {/* ...existing code above... */}

            {/* Statistics and Expenditure Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* HCDT Statistics */}
                {/* Settlors Operational Expenditure */}
                <div className="bg-white rounded-xl p-8 shadow flex flex-col justify-center min-h-[220px]">
                    <span className="font-semibold text-base text-gray-900 mb-4">Number of Trust with agreed distribution matrix</span>
                    <div>
                        <span className="font-bold text-3xl text-gray-900 align-middle">{dashboardStore.dashboardData?.DISTRIBUTION_MATRIX.total_complete}</span>
                        <span className="text-base text-gray-700 ml-2 align-middle">Trust with agreed distribution matrix</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-8 shadow">
                    <div className="font-semibold text-base text-gray-900 mb-4">Status of HCDT Funding by the Settlor: Percent of Trust that have received their annual OPEX funding from the Settlors</div>
                    <div className="w-full max-w-4xl mx-auto" style={{ minHeight: "220px" }}>
                        <Bar data={FundsData} options={conflictBarOptions} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 min-h-[220px]">
                <div className="bg-white rounded-xl p-8 shadow">
                    <div className="font-semibold text-base text-gray-900 mb-4">Gender composition of HCDT committees</div>
                    <div className="w-full max-w-4xl mx-auto" style={{ minHeight: "220px" }}>
                        <Bar data={BoTData} options={conflictBarOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center ">
                    <span className="font-semibold text-base text-gray-900 mb-4 self-start">
                        Percentage of HCDTs with constituted and inaugurated Board of trustee and Management Committee and Advisory Committee
                    </span>
                    <Bar
                        data={{
                            labels: [
                                "BoT Committee",
                                "Management Committee",
                                "Advisory Committee"
                            ],
                            datasets: [
                                {
                                    label: "Percentage",
                                    data: [
                                        dashboardStore.dashboardData?.BOT_INAUGURATION_CHECK.botYesPercentage,
                                        dashboardStore.dashboardData?.BOT_INAUGURATION_CHECK.managementYesPercentage,
                                        dashboardStore.dashboardData?.BOT_INAUGURATION_CHECK.advisoryYesPercentage,
                                    ],
                                    backgroundColor: [
                                        doughnutColors[0],
                                        doughnutColors[1],
                                        doughnutColors[2]
                                    ],
                                    borderRadius: 8,
                                    barPercentage: 0.5,
                                    categoryPercentage: 0.5,
                                }
                            ]
                        }}
                        options={{
                            indexAxis: "y",
                            plugins: {
                                legend: { display: false },
                                tooltip: { enabled: true },
                                datalabels: {
                                    anchor: 'center' as const,
                                    align: 'center' as const,
                                    formatter: function (value) {
                                        return `${value}%`;
                                    },
                                    color: '#222',
                                    font: {
                                        weight: 'bold'
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    min: 0,
                                    max: 100,
                                    ticks: {
                                        callback: function (tickValue) {
                                            return `${tickValue}%`;
                                        }
                                    },
                                    title: {
                                        display: false
                                    }
                                },
                                y: {
                                    title: {
                                        display: false
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 min-h-[220px]">
                <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center ">
                    <span className="font-semibold text-base text-gray-900 mb-4 self-start">
                        Percentage of Trusts where host community leaders, women, youths, and PwDs were consulted during needs assessment.
                    </span>
                    <Bar
                        data={{
                            labels: [
                                "Leadership consulted",
                                "Women Consulted",
                                "Youths Consulted",
                                "PwDs Consulted"
                            ],
                            datasets: [
                                {
                                    label: "Percentage",
                                    data: [
                                        dashboardStore.dashboardData?.COMMUNITY_LEADERSHIP_PERCENTAGE?.communityLeadershipPercentage,
                                        dashboardStore.dashboardData?.COMMUNITY_LEADERSHIP_PERCENTAGE?.communityWomenPercentage,
                                        dashboardStore.dashboardData?.COMMUNITY_LEADERSHIP_PERCENTAGE?.communityYouthsPercentage,
                                        dashboardStore.dashboardData?.COMMUNITY_LEADERSHIP_PERCENTAGE?.pwDsPercentage,
                                    ],
                                    backgroundColor: [
                                        doughnutColors[0],
                                        doughnutColors[1],
                                        doughnutColors[2],
                                        doughnutColors[3]
                                    ],
                                    borderRadius: 8,
                                    barPercentage: 0.5,
                                    categoryPercentage: 0.5,
                                }
                            ]
                        }}
                        options={{
                            indexAxis: "y",
                            plugins: {
                                legend: { display: false },
                                tooltip: { enabled: true },
                                datalabels: {
                                    anchor: 'center' as const,
                                    align: 'center' as const,
                                    formatter: function (value) {
                                        return `${value}%`;
                                    },
                                    color: '#222',
                                    font: {
                                        weight: 'bold'
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    min: 0,
                                    max: 100,
                                    ticks: {
                                        callback: function (tickValue) {
                                            return `${tickValue}%`;
                                        }
                                    },
                                    title: {
                                        display: false
                                    }
                                },
                                y: {
                                    title: {
                                        display: false
                                    }
                                }
                            }
                        }}
                    />
                </div>
                <div className="bg-white rounded-xl p-8 shadow flex flex-col md:flex-row items-center min-h-[320px]">
                    <div className="flex flex-col items-center ">
                        <span className="font-semibold text-base text-gray-900 mb-4 self-start">Percentage of Trust where needs assessment has been conducted.</span>
                        <div className="flex flex-row items-center ">
                            <div className="w-40 h-40">
                                <Doughnut
                                    data={{
                                        labels: ["Completed", "In progress", "Yet to be conducted"],
                                        // labels: dashboardStore.dashboardData?.QUALITY_RATINGS.map(e => e.qualityRating),
                                        datasets: [
                                            {
                                                data: [
                                                    dashboardStore.dashboardData?.NEEDS_ASSESSMENT_PERCENTAGE?.percentage_status_1,
                                                    dashboardStore.dashboardData?.NEEDS_ASSESSMENT_PERCENTAGE?.percentage_status_2,
                                                    dashboardStore.dashboardData?.NEEDS_ASSESSMENT_PERCENTAGE?.percentage_status_3,
                                                ],
                                                backgroundColor: [
                                                    doughnutColors[0],
                                                    doughnutColors[1],
                                                    doughnutColors[2]
                                                ],
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                                        cutout: "60%",
                                    }}
                                />
                            </div>
                            <div className="ml-6 flex flex-col gap-2">
                                {dataM.map((e, i) => (
                                    <div key={i}>
                                        <div className="flex items-center text-sm text-gray-700 gap-2">
                                            <span className="inline-block w-3 h-3 rounded-full" style={{ background: e.color }}></span>
                                            {e.name}
                                            <span className="ml-2 text-gray-500">{e.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project */}
            <div id="project" className="bg-white rounded-xl p-8 shadow mb-6 mt-6 w-full">

                {/* <div className="p-6 bg-gray-100 min-h-screen"> */}
                <h2 className="font-semibold text-xl text-gray-900 mb-4 mt-10">
                    Project implementation and quality assessment
                </h2>
                {/* Project Overview */}
                <div className="pb-6 ">
                    <DashboardTable
                        header="Top completed Project Details"
                        data={dashboardStore.dashboardData?.PROJECT_DETAILS}
                        columns={projectDetailsColumns}
                        emptyText="No data available"
                        loading={false}
                    />
                </div>
                <div className="pb-6 ">
                    <DashboardTable
                        header={"Top community workers per project"}
                        data={dashboardStore.dashboardData?.TOTAL_WORKER_IN_PROJECT}
                        columns={communityColumns}
                        emptyText={"No data available"}
                        loading={false}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    {/* Project Quality Ratings */}
                    <div className="bg-white rounded-xl p-8 shadow flex flex-col md:flex-row items-center min-h-[320px]">
                        <div className="flex flex-col items-center w-full">
                            <span className="font-semibold text-base text-gray-900 mb-4 self-start">Project quality ratings</span>
                            <div className="flex flex-row items-center w-full">
                                <div className="w-40 h-40">
                                    <Doughnut
                                        data={{
                                            // labels: ["Worse", "Good", "Fair", "Excellent", "Bad"],
                                            labels: dashboardStore.dashboardData?.QUALITY_RATINGS.map(e => e.qualityRating),
                                            datasets: [
                                                {
                                                    data: dashboardStore.dashboardData?.QUALITY_RATINGS.map(e => e.percentage),
                                                    backgroundColor: dashboardStore.dashboardData?.QUALITY_RATINGS.map(e => e.color),
                                                    borderWidth: 0,
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: { legend: { display: false }, tooltip: { enabled: false } },
                                            cutout: "60%",
                                        }}
                                    />
                                </div>
                                <div className="ml-6 flex flex-col gap-2">
                                    {dashboardStore.dashboardData?.QUALITY_RATINGS.map((e, i) => (
                                        <div key={i}>
                                            <div className="flex items-center text-sm text-gray-700 gap-2">
                                                <span className="inline-block w-3 h-3 rounded-full" style={{ background: e.color }}></span>
                                                {e.qualityRating}
                                                <span className="ml-2 text-gray-500">{e.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Project Completion over time */}
                    <div className="bg-white rounded-xl p-8 shadow flex flex-col min-h-[320px]">
                        <span className="font-semibold text-base text-gray-900 mb-4">Project completion over time</span>
                        <div className="w-full h-64">
                            <Line
                                data={{
                                    labels: dashboardStore.dashboardData?.COMPLETION_OVER_MONTH.monthName,
                                    datasets: [
                                        {
                                            label: "Completion",
                                            data: dashboardStore.dashboardData?.COMPLETION_OVER_MONTH.total,
                                            borderColor: "#3366CC",
                                            backgroundColor: "#3366CC",
                                            tension: 0.4,
                                            fill: false,
                                            pointRadius: 0,
                                            borderWidth: 2,
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                                    scales: {
                                        x: {
                                            grid: { display: false },
                                            ticks: { color: "#8C94A6" },
                                        },
                                        y: {
                                            grid: { color: "#F3F5F7" },
                                            ticks: { color: "#8C94A6", stepSize: 5 },
                                            beginAtZero: true,
                                            min: 0,
                                            max: 30,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
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
                        <h3 className="font-semibold  text-lg text-gray-600 mb-2">Trust Projects by Category</h3>
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
                {/* </div> */}
                <div className="bg-white rounded-xl p-8 shadow mt-10 w-full">
                    <div className="font-semibold text-base text-gray-900 mb-4">Local employment by gender and social inclusion</div>
                    <div className="w-full max-w-4xl mx-auto" style={{ minHeight: "320px" }}>
                        <Bar data={localEmploymentBarData} options={conflictBarOptions} />
                    </div>
                </div>

            </div>

            {/* Conflict Resolution */}
            <div id="conflict" className="bg-white rounded-xl p-8 shadow mb-6 mt-6 w-full">

                <h2 className="font-semibold text-xl text-gray-900 mb-4 mt-10">
                    Conflict Resolution
                </h2>
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
                <div className="bg-white rounded-xl p-8 shadow flex flex-col md:flex-row items-center min-h-[320px]">
                    <div className="flex flex-col items-center w-full">
                        <span className="font-semibold text-base text-gray-900 mb-4 self-start">Percentage of issues being addressed by the different stakeholder</span>
                        <div className="flex flex-row items-center justify-center w-full">
                            <div className="w-40 h-40 flex items-center justify-center">
                                <Doughnut
                                    data={{
                                        labels: dashboardStore.dashboardData?.CONFLICT_RESOLUTION_OVER.map((e: IConflictResolutionOverTime) => e.partyName),
                                        datasets: [
                                            {
                                                data: dashboardStore.dashboardData?.CONFLICT_RESOLUTION_OVER.map((e: IConflictResolutionOverTime) => e.percentage),
                                                backgroundColor: doughnutColors,
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                                        cutout: "60%",
                                    }}
                                />
                            </div>
                            <div className="ml-6 flex flex-col gap-2">
                                {dashboardStore.dashboardData?.CONFLICT_RESOLUTION_OVER.map((e: IConflictResolutionOverTime, i: number) => (
                                    <div key={i}>
                                        <div className="flex items-center text-sm text-gray-700 gap-2">
                                            <span className="inline-block w-3 h-3 rounded-full" style={{ background: doughnutColors[i] }}></span>
                                            {e.partyName}
                                            <span className="ml-2 text-gray-500">{e.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pb-6">
                    {/* Conflict resolution status chart */}
                    <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center  w-full md:max-w-xs">
                        <span className="font-semibold text-base text-gray-900 mb-4">Conflict resolution status</span>
                        <div className="w-32 h-32 mb-4">
                            <Doughnut data={conflictStatusData} options={conflictStatusOptions} />
                        </div>
                        <div className="flex flex-col gap-2 w-full mt-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center">
                                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#22C55E" }}></span>
                                    Resolved
                                </span>
                                <span className="font-semibold text-gray-900">{dashboardStore.dashboardData?.CONFLICT_RESOLUTION_PERCENTAGE.resolvedPercentage}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center">
                                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#EA580C" }}></span>
                                    Unresolved
                                </span>
                                <span className="font-semibold text-gray-900">{dashboardStore.dashboardData?.CONFLICT_RESOLUTION_PERCENTAGE.unresolvedPercentage}</span>
                            </div>
                        </div>
                    </div>
                    {/* Conflict Details Table - take more space */}
                    <div className="col-span-2 flex flex-col">
                        <DashboardTable
                            header="Conflict Details"
                            data={dashboardStore.dashboardData?.CONFLICT_RESOLUTION_DETAILS}
                            columns={conflictDetailsColumns}
                            emptyText="No data available"
                            loading={false}
                        />
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                        <h3 className="text-xs font-medium text-gray-600 mb-2">Status of conflict</h3>
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
                        <h3 className="text-xs font-medium text-gray-600 mb-2">Status of Court litigation</h3>
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
                        <h3 className="text-sm font-medium text-gray-600 mb-4">Report frequency</h3>
                        <Line data={lineDataReportFrequency} />
                    </div>
                    <div className="bg-white p-9 rounded-lg shadow-md">
                        <h3 className="text-sm font-medium text-gray-600 mb-4">Major causes of conflict</h3>
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
                        <DashboardTable
                            header={"Top Resolved Conflict"}
                            data={conflictStore?.dashboardData?.RESOLVED_CONFLICTS.map((conflict: IConflictView) => {
                                return {
                                    trustName: conflict.trustName,
                                    causeOfConflictName: conflict.causeOfConflictName,
                                    createAt: conflict.createAt
                                }
                            })}
                            columns={conflictDetailsColumnsR}
                            emptyText={"No data available"}
                            loading={false}
                        />

                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <DashboardTable
                            header={"Top Unresolved Conflict"}
                            data={conflictStore?.dashboardData?.UNRESOLVED_CONFLICTS.map((conflict: IConflictView) => {
                                return {
                                    trustName: conflict.trustName,
                                    causeOfConflictName: conflict.causeOfConflictName,
                                    createAt: conflict.createAt
                                }
                            })}
                            columns={conflictDetailsColumnsR}
                            emptyText={"No data available"}
                            loading={false}
                        />
                    </div>
                </div>
            </div>


            {/* Community Satisfaction */}
            <div id="community-satisfaction" className="bg-white rounded-xl p-8 shadow mb-6 mt-6 w-full">

                <h2 className="font-semibold text-xl text-gray-900 mb-4 mt-10">
                    Average community satisfaction with the process, inclusion, approach and management of the HCDTs by the government structure (BoT, MC & AC)
                </h2>
                <div className="bg-white rounded-xl p-8 shadow mb-6 mt-6 w-full">
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

                {/* Pie Charts Section */}
                {/* <br /> */}
                <br />
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                        <h3 className="text-s font-medium text-gray-800 mb-2">The way the Settlor has acted has  minimized conflict and improved their relationship with the host communities.</h3>
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
                        <h3 className="text-s font-medium text-gray-800 mb-2">The way NUPRC is regulating and responding is effectively addressing disputes emanating from the implementation of the HCDT, and promoting improved relationships between host communities and Settlor's.</h3>
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
                <br />
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                        Existence, and activeness of sustainability management structure/committees established by the Trust
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Question 1 */}
                        {/* <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
                The Trust commissioned and handed over completed projects in our community to the community leadership?
              </h3>
              <div className="h-40 sm:h-48">
                <Pie
                  data={generatePieData(
                    satisfactionStore.dashboardData?.projectHandover || [0, 0, 0, 0]
                  )}
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
            </div> */}
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-4 text-center">
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
            </div>


            {/* Economic impact */}
            <div id="economic-impact" className="bg-white rounded-xl p-8 shadow mb-6 mt-6 w-full">

                <h2 className="font-semibold text-xl text-gray-900 mb-4 mt-10">
                    Economic impact: Percentage of community members who reported that their income and livelihood have improved as a result of thr implementation of the HCDT project & initiatives
                </h2>
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
            {/* // Place this at the root of your dashboard page (outside your main content) */}
            <FloatingStepper />
        </div>
    );
});

// You can put this in the same file or a separate one

export default GeneralDashboard;