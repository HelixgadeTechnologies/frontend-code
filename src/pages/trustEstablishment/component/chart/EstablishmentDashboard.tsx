import { createContext, useContext } from "react";
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
import { Doughnut, Line } from "react-chartjs-2";
import { trustEstablishmentStore as TrustEstablishmentStore } from "../../store/trustEstablishmentStore"
import { observer } from "mobx-react-lite";
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

const TrustEstablishmentStoreCTX = createContext(TrustEstablishmentStore);
const EstablishmentDashboard = observer(() => {
  const trustEstablishmentStore = useContext(TrustEstablishmentStoreCTX);
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

  const data1 = {
    labels: trustEstablishmentStore.dashboardData?.TRENDS_YEAR,
    datasets: [
      {
        label: "OPEX Trends",
        data: trustEstablishmentStore.dashboardData?.TRENDS_AMOUNT || [0, 0, 0],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };
  const data = {
    datasets: [
      {
        data: [trustEstablishmentStore.dashboardData?.DEVELOP_PLAN_AND_BUDGET_PERCENTAGE!, 100 - trustEstablishmentStore.dashboardData?.DEVELOP_PLAN_AND_BUDGET_PERCENTAGE!],
        backgroundColor: ["#98A4B7", "#F3F5F7"],
        borderWidth: 0,
        // cutout: "70%",
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    // cutout: "50%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
  const classColors = (data: number): string => {
    if (data == 1) return "bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium";
    if (data == 2) return "bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium";
    if (data == 3) return "bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-medium";
    return "bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-medium";
  }
  const translator = (data: number): string => {
    if (data == 1) return "YES";
    if (data == 2) return "IN PROGRESS";
    if (data == 3) return "NO";
    return "NOT IN ALL COMMUNITIES";
  }
  const translator2 = (data: number): string => {
    if (data == 1) return "UPLOADED";
    if (data == 2) return "IN PROGRESS";
    if (data == 3) return "NO UPLOAD";
    return "";
  }
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Financial Summary */}
      <div className="bg-white rounded-lg p-5 flex flex-col gap-4 shadow min-h-[180px]">
        <h3 className="font-semibold text-lg mb-2">Financial Summary</h3>
        <ul className="space-y-3">
          <li className="flex justify-between items-center">
            <span className="text-gray-600">Total Funds</span>
            <span className="font-semibold text-black">NGN {trustEstablishmentStore.dashboardData?.TOTAL_FUNDS.toLocaleString()}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-600">Capital Expenditure</span>
            <span className="font-semibold text-black">NGN {trustEstablishmentStore.dashboardData?.CAPITAL_EXPENDITURE.toLocaleString()}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-600">Reserve</span>
            <span className="font-semibold text-black">NGN {trustEstablishmentStore.dashboardData?.RESERVE.toLocaleString()}</span>
          </li>
        </ul>
      </div>

      {/* Trust Establishment and Governance */}
      <div className="bg-white rounded-lg p-5 flex flex-col gap-4 shadow col-span-2">
        <h3 className="font-semibold text-lg mb-2">Trust Establishment and Governance</h3>

        <div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">CAC Registration</span>
            <span className={classColors(trustEstablishmentStore.dashboardData?.CAC_STATUS!)}>{translator2(trustEstablishmentStore.dashboardData?.CAC_STATUS!)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
          {trustEstablishmentStore.dashboardData?.CAC_DOCUMENT ? (
            <>
              <span className="text-green-600 font-bold">✔</span>
              <a
                href={trustEstablishmentStore.dashboardData?.CAC_DOCUMENT ? trustEstablishmentStore.dashboardData?.CAC_DOCUMENT : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 text-sm hover:underline"
                download
              >
                CAC Registration
              </a>
              <span className="text-xs text-gray-400">
                {/* 11 Sep, 2023 • 11:44am • 1.5MB */}
              </span>
              <button className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg" title="Delete">
                .
              </button>
            </>
          ) : "No CAC Registration Uploaded"}
        </div>
      </div>

      {/* OPEX Trends */}
      <div className="bg-white rounded-lg p-5 shadow col-span-2 mt-6">
        <h3 className="font-semibold text-lg mb-2">OPEX Trends</h3>
        <div className="h-[320px] flex items-center justify-center text-gray-400">
          <Line options={chartOptions} data={data1} />
        </div>
      </div>

      {/* Trust Development Plan & Budget */}
      <div className="bg-white rounded-lg p-5 shadow mt-6 flex flex-col items-center justify-center">
        <h3 className="font-semibold text-lg mb-2">Trust Development Plan & Budget</h3>
        {/* Replace this with your actual progress component */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-40 h-40 ">
            <Doughnut data={data} options={options} />
          </div>
        </div>
        <div className="flex justify-between w-full px-4 text-gray-500 text-sm">
          <span>{trustEstablishmentStore.dashboardData?.YEAR_START}<br /><span className="text-xs">Year Started</span></span>
          <span>{trustEstablishmentStore.dashboardData?.YEAR_EXPIRED}<br /><span className="text-xs">End Year</span></span>
        </div>
      </div>

      {/* Status of Needs Assessment */}
      <div className="bg-white rounded-lg p-5 shadow mt-6 col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Status of Needs Assessment</h3>
          <div className="w-32">
            <div className="border rounded px-2 py-1 text-sm">
              {trustEstablishmentStore.dashboardData?.YEAR_NEEDS}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Were the Leaders consulted?</span>
            <span className={classColors(trustEstablishmentStore.dashboardData?.LEADER_CONSULTED!)}>{translator(trustEstablishmentStore.dashboardData?.LEADER_CONSULTED!)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Were the Youth consulted?</span>
            <span className={classColors(trustEstablishmentStore.dashboardData?.YOUTH_CONSULTED!)}>{translator(trustEstablishmentStore.dashboardData?.YOUTH_CONSULTED!)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Were the Women consulted?</span>
            <span className={classColors(trustEstablishmentStore.dashboardData?.WOMEN_CONSULTED!)}>{translator(trustEstablishmentStore.dashboardData?.WOMEN_CONSULTED!)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Were the PwDs consulted?</span>
            <span className={classColors(trustEstablishmentStore.dashboardData?.PWD_CONSULTED!)}>{translator(trustEstablishmentStore.dashboardData?.PWD_CONSULTED!)}</span>
          </div>
        </div>
      </div>

      {/* Trust Compliance & Distribution Matrix */}
      <div className="bg-white rounded-lg p-5 shadow mt-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Trust Compliance</h3>
          {/* <div className="w-32">
            <select className="border rounded px-2 py-1 text-sm">
              <option>2024</option>
            </select>
          </div> */}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span>Trust Distribution Matrix Upload</span>
            <span className={classColors(trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX! ? 1 : 3)}>{translator2(trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX! ? 1 : 3)}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            {trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX ? (
              <>
                <span className="text-green-600 font-bold">✔</span>
                <a
                  href={trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 text-sm hover:underline"
                  download
                >
                  Distribution Matrix
                </a>
                <span className="text-xs text-gray-400">
                  {/* 11 Sep, 2023 • 11:44am • 1.5MB */}
                </span>
                <button className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg" title="Delete">
                  .
                </button>

              </>

            ) : "No Distribution Matrix Uploaded"}
          </div>
        </div>
      </div>
    </div>
  );
});

export default EstablishmentDashboard;