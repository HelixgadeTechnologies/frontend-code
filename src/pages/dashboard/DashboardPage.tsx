import { Doughnut, Bar, Line } from "react-chartjs-2";

const DashboardPage = () => {

  // Bar chart data
  const barData = {
    labels: ["Rivers", "Edo", "Cross Rivers", "Delta", "Bayelsa", "Akwa Ibom"],
    datasets: [
      {
        label: "Communities",
        data: [35, 20, 50, 45, 48, 35],
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
        data: [75, 25],
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
                <div className="h-full bg-[#22C55E]" style={{ width: "70%" }}></div>
              </div>
              <span className="text-xs text-gray-700 font-semibold">70%</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">70 out of 100 Trusts is fully Established</div>
          </div>
          {/* Communities benefiting by state */}
          <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-4 flex-1 justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-700 font-medium">Communities benefiting by state</span>
              <span className="text-xs text-gray-500 font-medium">Total Number of all Benefiting Communities | 590</span>
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
              <span className="absolute text-3xl font-bold text-gray-900">75%</span>
            </div>
            <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
              <div className="flex flex-col items-center flex-1">
                <span className="font-semibold text-lg text-gray-900">879</span>
                <span>Completed Development plan</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="font-semibold text-lg text-gray-900">1028</span>
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
            <span className="font-bold text-3xl text-gray-900 align-middle">373</span>
            <span className="text-base text-gray-700 ml-2 align-middle">host communities are benefiting from the trust</span>
          </div>
          {/* <div className="text-base text-gray-700 ml-1">are benefiting from the trust</div> */}
        </div>
        {/* Settlors Operational Expenditure */}
        <div className="bg-white rounded-xl p-8 shadow flex flex-col justify-center min-h-[220px]">
          <span className="font-semibold text-base text-gray-900 mb-4">Settlors Operational Expenditure</span>
          <div className="flex flex-col items-center justify-center mb-2">
            <span className="font-bold text-4xl text-gray-900">$8,305,224.76</span>
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
                    labels: ["Worse", "Good", "Fair", "Excellent", "Bad"],
                    datasets: [
                      {
                        data: [2, 33, 7, 61, 1],
                        backgroundColor: [
                          "#3366CC", // Worse - blue
                          "#34C759", // Good - green
                          "#FF3B30", // Fair - red
                          "#FFCC00", // Excellent - yellow
                          "#8C94A6", // Bad - gray
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
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#3366CC" }}></span>
                  Worse
                  <span className="ml-2 text-gray-500">2%</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#34C759" }}></span>
                  Good
                  <span className="ml-2 text-gray-500">33%</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#FF3B30" }}></span>
                  Fair
                  <span className="ml-2 text-gray-500">7%</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#FFCC00" }}></span>
                  Excellent
                  <span className="ml-2 text-gray-500">61%</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#8C94A6" }}></span>
                  Bad
                  <span className="ml-2 text-gray-500">1%</span>
                </div>
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
                labels: [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov"
                ],
                datasets: [
                  {
                    label: "Completion",
                    data: [15, 21, 9, 25, 13, 20, 19, 13, 22, 17, 8],
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

      
    </div>
  );
};

export default DashboardPage;