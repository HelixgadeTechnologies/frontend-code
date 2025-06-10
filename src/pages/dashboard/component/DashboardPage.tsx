import { FaStar, FaRegStar } from "react-icons/fa";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import DashboardTable, { DashboardTableColumn } from "../table/DashboardTable";
import { observer } from "mobx-react-lite";
import { dashboardStore as DashboardStore } from "../store/dashboardStore";
import { useContext, createContext } from "react";
import dayjs from "dayjs";

const dashboardStoreCTX = createContext(DashboardStore);
const DashboardPage: React.FC = observer(() => {
  const dashboardStore = useContext(dashboardStoreCTX);

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
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#8C94A6" } },
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
  const conflictBarData = {
    labels: dashboardStore.dashboardData?.CONFLICT_RESOLUTION_OVER_TIME.map(e => String(e.month)),
    datasets: [
      {
        label: "Not in court",
        data: dashboardStore.dashboardData?.CONFLICT_RESOLUTION_OVER_TIME.map(e => e.notInCourt),
        backgroundColor: "#22C55E",
        borderRadius: 4,
        stack: "Stack 0",
      },
      {
        label: "In court",
        data: dashboardStore.dashboardData?.CONFLICT_RESOLUTION_OVER_TIME.map(e => e.inCourt),
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
  };

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
  return (
    <div className="bg-[#F3F5F7] min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h2 className="font-semibold text-xl text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm">Control your profile setup and integrations</p>
        </div>
      </div>

      {/* Main Grid */}
      <h2 className="font-semibold text-xl text-gray-900 mb-4">Trust Establishment and Governance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {/* Left Column */}
        <div className="flex flex-col gap-5 h-full">
          {/* HCDT Establishment and Governance */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col gap-2">
            <div className="text-xs text-gray-700 mb-1">HCDT Establishment and Governance</div>
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
              <span className="text-sm text-gray-700 font-medium">Communities benefiting by state</span>
              <span className="text-xs text-gray-500 font-medium">Total Number of all Benefiting Communities | {dashboardStore.dashboardData?.COMMUNITY_BENEFIT.total.reduce((sum: any, num: any) => sum + num, 0)}</span>
            </div>
            <div className="w-full h-56 flex items-end">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col h-full">
          {/* Number of Trust with Compliance */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center gap-2 relative h-full justify-center">
            <div className="font-semibold text-base text-gray-900 mb-2">Number of Trust with Compliance</div>
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
            <div className="w-full mt-4 flex justify-center">
              <span className="text-xs text-gray-500 bg-[#FFF6F0] px-2 py-1 rounded font-medium">
                <span className="text-[#FF6B00] font-semibold">62 Companies</span> available & assessment distribution
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* ...existing code above... */}

      {/* Statistics and Expenditure Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* HCDT Statistics */}
        <div className="bg-white rounded-xl p-8 shadow flex flex-col justify-center min-h-[220px]">
          <span className="font-semibold text-base text-gray-900 mb-4">HCDT Statistics</span>
          <div className="mb-3">
            <span className="font-bold text-3xl text-gray-900 align-middle">83%</span>
            <span className="text-base text-gray-700 ml-2 align-middle">Trusts have reported to have received their approved funds</span>
          </div>
          {/* <div className="text-base text-gray-700 mb-3 ml-1">reported to have received their approved funds</div> */}
          <div>
            <span className="font-bold text-3xl text-gray-900 align-middle">{dashboardStore.dashboardData?.STATISTICS.community_count}</span>
            <span className="text-base text-gray-700 ml-2 align-middle">host communities are benefiting from the trust</span>
          </div>
          {/* <div className="text-base text-gray-700 ml-1">are benefiting from the trust</div> */}
        </div>
        {/* Settlors Operational Expenditure */}
        <div className="bg-white rounded-xl p-8 shadow flex flex-col justify-center min-h-[220px]">
          <span className="font-semibold text-base text-gray-900 mb-4">Settlors Operational Expenditure</span>
          <div className="flex flex-col items-center justify-center mb-2">
            <span className="font-bold text-4xl text-gray-900">NGN{dashboardStore.dashboardData?.OPERATIONAL_EXPENDITURE.totalExpenditure.toLocaleString()}</span>
          </div>
          <span className="text-base text-gray-700 mt-2">
            The total amount of OPEX provided by all the OMLs under a Trust
          </span>
        </div>
      </div>
      {/* ...existing code below... */}



      <h2 className="font-semibold text-xl text-gray-900 mb-4 mt-10">
        Project Implementation and Quality Assessment
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Quality Ratings */}
        <div className="bg-white rounded-xl p-8 shadow flex flex-col md:flex-row items-center min-h-[320px]">
          <div className="flex flex-col items-center w-full">
            <span className="font-semibold text-base text-gray-900 mb-4 self-start">Project Quality Ratings</span>
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
          <span className="font-semibold text-base text-gray-900 mb-4">Project Completion over time</span>
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
      <div className="bg-white rounded-xl p-8 shadow mt-10 w-full">
        <DashboardTable
          header="Project Details"
          data={dashboardStore.dashboardData?.PROJECT_DETAILS}
          columns={projectDetailsColumns}
          emptyText="No data available"
          loading={false}
        />
      </div>
      <div className="bg-white rounded-xl p-8 shadow mt-10 w-full">
        <div className="font-semibold text-base text-gray-900 mb-4">Conflict resolution over time</div>
        <div className="w-full max-w-4xl mx-auto" style={{ minHeight: "320px" }}>
          <Bar data={conflictBarData} options={conflictBarOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
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

      {/* // ...inside your DashboardPage component, where you want this section... */}
      <div>
        <h2 className="font-semibold text-xl text-gray-900 mb-4 mt-10">
          Community Participation & Employment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Contracts Awarded Doughnut Chart */}
          <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center w-full md:max-w-xs h-full">
            <span className="font-semibold text-base text-gray-900 mb-4">Contracts Awarded</span>
            <div className="w-32 h-32 mb-4">
              <Doughnut
                data={{
                  labels: ["Non local", "Local"],
                  datasets: [
                    {
                      data: [33, 7],
                      backgroundColor: ["#22C55E", "#EF4444"],
                      borderWidth: 0,
                      // cutout: "75%",
                    },
                  ],
                }}
                options={{
                  cutout: "75%",
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                }}
              />
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#22C55E" }}></span>
                  Non local
                </span>
                <span className="font-semibold text-gray-900">33%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#EF4444" }}></span>
                  Local
                </span>
                <span className="font-semibold text-gray-900">7%</span>
              </div>
            </div>
          </div>
          {/* Community workers per project Table */}
          <div className="col-span-2 flex flex-col">
            <DashboardTable
              header={"Community workers per project"}
              data={dashboardStore.dashboardData?.TOTAL_WORKER_IN_PROJECT}
              columns={communityColumns}
              emptyText={"No data available"}
              loading={false}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-8 shadow mt-10 w-full">
        <div className="font-semibold text-base text-gray-900 mb-4">Local Employment by gender and Social Inclusion</div>
        <div className="w-full max-w-4xl mx-auto" style={{ minHeight: "320px" }}>
          <Bar data={localEmploymentBarData} options={conflictBarOptions} />
        </div>
      </div>
      {/* // ...existing code... */}

      <h2 className="font-semibold text-xl text-gray-900 mb-4 mt-10">
        Impact & Sustainability
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
        {/* Project with sustainable plans Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center w-full md:max-w-xs md:flex-shrink-0">
          <span className="font-semibold text-base text-gray-900 mb-4">Project with sustainable plans</span>
          <div className="w-40 h-40 mb-4">
            <Doughnut
              data={{
                labels: [
                  "Project with Sustainable Plan",
                  "Project without Sustainable Plan",
                ],
                datasets: [
                  {
                    data: [93, 7],
                    backgroundColor: ["#EF4444", "#FFCC00"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                cutout: "65%",
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
              }}
            />
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#EF4444" }}></span>
                Project with Sustainable Plan
              </span>
              <span className="font-semibold text-gray-900">93%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#FFCC00" }}></span>
                Project without Sustainable Plan
              </span>
              <span className="font-semibold text-gray-900">7%</span>
            </div>
          </div>
        </div>
        {/* Income changes over time Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow flex flex-col min-h-[320px] flex-1">
          <span className="font-semibold text-base text-gray-900 mb-4">Income changes over time</span>
          <div className="w-full h-64">
            <Line
              data={{
                labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
                datasets: [
                  {
                    label: "Income",
                    data: [15, 22, 10, 25, 18, 21, 13, 20, 22, 12, 19, 24, 16, 9],
                    borderColor: "#174EA6",
                    backgroundColor: "#174EA6",
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
                    grid: { color: "#E5E7EB" },
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
      {/* Next code  */}
      <div className="bg-white rounded-xl p-6 shadow mt-8 w-full">
        <div className="font-semibold text-base text-gray-900 mb-4">Impact Statistics</div>
        <div className="flex flex-col gap-3">
          <div className="text-gray-900 text-lg font-bold">
            65%
            <span className="font-normal text-base text-gray-900 ml-2">
              of community members reported improved income due to HCDT projects
            </span>
          </div>
          <div className="text-gray-900 text-lg font-bold">
            25
            <span className="font-normal text-base text-gray-900 ml-2">
              income-generating initiatives established by the Trusts
            </span>
          </div>
        </div>
      </div>

      {/* Next Code */}
      <h2 className="font-semibold text-xl text-gray-900 mb-4 mt-10">
        Human Capital Development & Gender Inclusion
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
        {/* Beneficiaries by gender and social inclusion Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center w-full md:max-w-xs md:flex-shrink-0">
          <span className="font-semibold text-base text-gray-900 mb-4 text-center">
            Beneficiaries by gender and social inclusion
          </span>
          <div className="w-40 h-40 mb-4">
            <Doughnut
              data={{
                labels: ["Male", "Female", "PwD"],
                datasets: [
                  {
                    data: [63, 30, 7],
                    backgroundColor: ["#22C55E", "#FFCC00", "#EF4444"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                cutout: "65%",
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
              }}
            />
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#22C55E" }}></span>
                Male
              </span>
              <span className="font-semibold text-gray-900">63%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#FFCC00" }}></span>
                Female
              </span>
              <span className="font-semibold text-gray-900">30%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: "#EF4444" }}></span>
                PwD
              </span>
              <span className="font-semibold text-gray-900">7%</span>
            </div>
          </div>
        </div>
        {/* Income changes over time Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow flex flex-col min-h-[320px] flex-1">
          <span className="font-semibold text-base text-gray-900 mb-4">Income changes over time</span>
          <div className="w-full h-64">
            <Line
              data={{
                labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
                datasets: [
                  {
                    label: "Income",
                    data: [15, 22, 10, 25, 18, 21, 13, 20, 22, 12, 19, 24, 16, 9],
                    borderColor: "#174EA6",
                    backgroundColor: "#174EA6",
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
                    grid: { color: "#E5E7EB" },
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

      {/* Next code */}
      <div className="bg-white rounded-xl p-6 shadow mt-8 w-full">
        <div className="font-semibold text-base text-gray-900 mb-4">Impact Statistics</div>
        <div className="flex flex-col gap-3">
          <div className="text-gray-900 text-lg font-bold">
            83%
            <span className="font-normal text-base text-gray-900 ml-2">
              of male community members benefited from the trust HCDT projects
            </span>
          </div>
          <div className="text-gray-900 text-lg font-bold">
            17%
            <span className="font-normal text-base text-gray-900 ml-2">
              of females community members benefited from the trust HCDT projects
            </span>
          </div>
          <div className="text-gray-900 text-lg font-bold">
            2023
            <span className="font-normal text-base text-gray-900 ml-2">
              has the highest number of income generation by the community members
            </span>
          </div>
          <div className="text-gray-900 text-lg font-bold">
            25
            <span className="font-normal text-base text-gray-900 ml-2">
              income-generating initiatives established by the Trusts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DashboardPage;