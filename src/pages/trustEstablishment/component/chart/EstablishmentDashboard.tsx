import { createContext, useCallback, useContext, useState } from "react";
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
import { Doughnut, Line, Pie } from "react-chartjs-2";
import { trustEstablishmentStore as TrustEstablishmentStore } from "../../store/trustEstablishmentStore"
import { observer } from "mobx-react-lite";
import FileCard from "./FileCard";
import dayjs from "dayjs";
import { CustomSelect, Modal } from "../../../../components/elements";
import { DeleteFile } from "../modal/DeleteFile";
import { Controller, useForm } from "react-hook-form";
import { year } from "../../../../utils/data";
import { IFundsStatusDashboardData } from "../../types/interface";
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
  const { control } = useForm();

  const [type, setType] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
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
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
  const classColors = (data: number | undefined): string => {
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
  const translator1 = (data: number | undefined): string => {
    if (data == 1) return "YES";
    if (data == 2) return "IN PROGRESS";
    if (data == 3) return "NO";
    return "NOT SELECTED";
  }
  const translator2 = (data: number): string => {
    if (data == 1) return "UPLOADED";
    if (data == 2) return "IN PROGRESS";
    if (data == 3) return "NO UPLOAD";
    return "NO UPLOAD";
  }

  const translator3 = (data: number): string => {
    if (data == 1) return "COMPLETED";
    if (data == 2) return "IN PROGRESS";
    if (data == 3) return "YET TO BE CONDUCTED";
    return "NO DATA";
  }
  const translator4 = (data: number): string => {
    if (data == 1) return "FULLY RECEIVED";
    if (data == 2) return "PARTLY RECEIVED";
    if (data == 3) return "NOT RECEIVED";
    return "NO DATA";
  }

  const handelFileDelete = useCallback((url: string, type: string) => {
    setUrl(url);
    setType(type);
  }, [url, type]);

  const handelClose = useCallback(() => {
    setUrl(null);
    setType(null);
  }, [url, type]);

  const changeYear = useCallback((year: number) => {
    async function getInfo() {
      trustEstablishmentStore.selectedYear = year;
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      await trustEstablishmentStore.getFundsDashboardByTrustIdAndYear(selectedTrustId as string, year);
    }
    getInfo()

  }, [trustEstablishmentStore]);

  const setSwitch = useCallback(() => {
    trustEstablishmentStore.summarySwitch = !trustEstablishmentStore.summarySwitch
  }, [trustEstablishmentStore]);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Financial Summary */}
        <div className="bg-white rounded-xl p-5 flex flex-col gap-4 shadow min-h-[320px]">
          <div className="flex items-center justify-between space-x-4">
            <p></p>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={trustEstablishmentStore.summarySwitch}
                  onChange={setSwitch}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
              <span className="text-sm text-gray-600 ml-2">Funds</span>
            </div>

          </div>
          {trustEstablishmentStore.summarySwitch ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg mb-2">Funds received by trust</h3>
                {/* Year Filter */}
                <div>
                  <Controller
                    control={control}
                    name="yearOfNeedsAssessment"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomSelect
                        // className="border border-gray-300 rounded px-3 py-1 text-sm bg-white focus:outline-none"
                        label=""
                        id="needs-assessment-year"
                        {...field}
                        options={year}
                        isMulti={false}
                        value={{ value: String(trustEstablishmentStore.selectedYear), label: trustEstablishmentStore.selectedYear == 0 ? "All" : String(trustEstablishmentStore.selectedYear) }}
                        placeholder="Select Year"
                        onChange={(e) => changeYear(Number(e?.value))}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 mb-4">
                  <Pie
                    data={{
                      labels: ["Reserve", "Capital expenditure"],
                      datasets: [
                        {
                          data: [
                            // trustEstablishmentStore.dashboardData?.ADMIN || 0,
                            trustEstablishmentStore.fundsDashboardData?.reservePercentage || 0,
                            trustEstablishmentStore.fundsDashboardData?.capitalPercentage || 0,
                            // trustEstablishmentStore.dashboardData?.TOTAL_FUNDS || 0,
                          ],
                          backgroundColor: [
                            // "#3366CC", // Admin - blue
                            "#34C759", // Reserve - green
                            "#FF3B30", // Capital expenditure - red
                            // "#FFCC00", // Total Funds - yellow
                          ],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                      cutout: "70%",
                    }}
                  />
                </div>
                <ul className="space-y-2 w-full">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#34C759" }}></span>
                    <span className="text-gray-600 flex-1">Reserve</span>
                    <span className="font-medium text-gray-900">NGN {trustEstablishmentStore.fundsDashboardData?.reserveReceived?.toLocaleString() || 0}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#FF3B30" }}></span>
                    <span className="text-gray-600 flex-1">Capital expenditure</span>
                    <span className="font-medium text-gray-900">NGN {trustEstablishmentStore.fundsDashboardData?.capitalExpenditureReceived?.toLocaleString() || 0}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#FFCC00" }}></span>
                    <span className="text-gray-600 flex-1">Total Funds</span>
                    <span className="font-medium text-gray-900">NGN {trustEstablishmentStore.fundsDashboardData?.totalFundsReceived?.toLocaleString() || 0}</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="rounded-xl mt-2 col-span-2 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4">
                <h3 className="font-semibold text-lg text-gray-900">Funds received by trust</h3>
              </div>
              <div className="bg-white px-4 py-2">
                <ul className="divide-y divide-gray-100">
                  {trustEstablishmentStore.fundsStatusDashboard.map((value: IFundsStatusDashboardData) => (
                    <li
                      key={value.yearReceived}
                      className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">{value.yearReceived}</span>
                      </div>
                      <span className={classColors(value.paymentCheck)}>
                        {translator4(value.paymentCheck)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Trust Establishment and Governance */}
        <div className="bg-white rounded-lg p-5 flex flex-col gap-4 shadow col-span-2">
          <h3 className="font-semibold text-lg mb-2">Trust Establishment and Governance</h3>
          {/* <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Trust Setup</span>
              <span className="text-gray-600">{trustEstablishmentStore.dashboardData?.COMPLETION_STATUS ? trustEstablishmentStore.dashboardData?.COMPLETION_STATUS : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${trustEstablishmentStore.dashboardData?.COMPLETION_STATUS ? trustEstablishmentStore.dashboardData?.COMPLETION_STATUS : 0}%` }} />
            </div>
          </div> */}
          <div className="flex items-center gap-2">
            <label htmlFor="year-select" className="text-gray-500 text-sm mr-2">Registered Year</label>
            <div
              id="year-select"
              className="border rounded px-3 py-1 text-sm bg-white focus:outline-none"
            >
              {trustEstablishmentStore.dashboardData?.CAC_YEAR}
            </div>
            <br />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trust Registered with CAC</span>
              <span className={classColors(trustEstablishmentStore.dashboardData?.CAC_STATUS!)}>{translator1(trustEstablishmentStore.dashboardData?.CAC_STATUS!)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2  p-2 rounded">
            {trustEstablishmentStore.dashboardData?.CAC_DOCUMENT ? (
              <FileCard
                fileName="CAC Registration Document"
                fileUrl={trustEstablishmentStore.dashboardData?.CAC_DOCUMENT ? trustEstablishmentStore.dashboardData?.CAC_DOCUMENT : "#"}
                uploadedAt={dayjs(trustEstablishmentStore.dashboardData?.DATE_UPDATED as string).format("DD MMM, YYYY  h:mmA")}
                fileSize="1.3MB"
                onDelete={() => handelFileDelete(trustEstablishmentStore.dashboardData?.CAC_DOCUMENT!, "CAC")}
              />
            ) : "No CAC Registration Uploaded"}
          </div>
          <div className="rounded-xl mt-6 col-span-2 overflow-hidden">

            <div className="bg-[#F3F5F7] flex items-center justify-between px-6 py-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900"> Status of Trust Board of Trustee and Management Committee and Advisory Committee</h3>
              </div>
            </div>

            <div className="bg-white px-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>BoT constituted and inaugurated</span>
                  <span className={classColors(trustEstablishmentStore.dashboardData?.BOT_INAUGURATION_CHECK?.botYesPercentage)}>{translator1(trustEstablishmentStore.dashboardData?.BOT_INAUGURATION_CHECK?.botYesPercentage!)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Management Committee constituted and inaugurated</span>
                  <span className={classColors(trustEstablishmentStore.dashboardData?.BOT_INAUGURATION_CHECK?.managementYesPercentage)}>{translator1(trustEstablishmentStore.dashboardData?.BOT_INAUGURATION_CHECK?.managementYesPercentage)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Advisory Committee constituted and inaugurated</span>
                  <span className={classColors(trustEstablishmentStore.dashboardData?.BOT_INAUGURATION_CHECK?.advisoryYesPercentage)}>{translator1(trustEstablishmentStore.dashboardData?.BOT_INAUGURATION_CHECK?.advisoryYesPercentage)}</span>
                </div>

              </div>
            </div>
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
          <div className="relative flex items-center justify-center w-44 h-44 my-4">
            <Doughnut data={data} options={options} />
            <span className="absolute text-3xl font-bold text-gray-900">{trustEstablishmentStore.dashboardData?.DEVELOP_PLAN_AND_BUDGET_PERCENTAGE!}%</span>
          </div>
          {/* <div className="relative flex items-center justify-center my-4">
          <div className="w-40 h-40 ">
            <Doughnut data={data} options={options} />
          </div>
        </div> */}
          <div className="flex justify-between w-full px-4 text-gray-500 text-sm">
            <span>{trustEstablishmentStore.dashboardData?.YEAR_START}<br /><span className="text-xs">Year Started</span></span>
            <span>{trustEstablishmentStore.dashboardData?.YEAR_EXPIRED}<br /><span className="text-xs">End Year</span></span>
          </div>
        </div>


        <div className="rounded-xl mt-6 col-span-2 overflow-hidden">

          <div className="bg-[#F3F5F7] flex items-center justify-between px-6 py-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Status of Needs Assessment</h3>
              <p className="text-gray-500 text-sm mt-6">Status needs assessment for the trust</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <label htmlFor="year-select" className="text-gray-500 text-sm mr-2">Selected Year</label>
                <div
                  id="year-select"
                  className="border rounded px-3 py-1 text-sm bg-white focus:outline-none"
                >
                  {trustEstablishmentStore.dashboardData?.YEAR_NEEDS}
                </div>
                <br />
              </div>
              <p className="text-gray-500 text-sm mt-6"><span className={`${classColors(trustEstablishmentStore.dashboardData?.STATUS_OF_NEED_ASSESSMENT!)}`}>{translator3(trustEstablishmentStore.dashboardData?.STATUS_OF_NEED_ASSESSMENT!)}</span></p>

            </div>
          </div>

          <div className="bg-white px-6 py-4">
            <div className="space-y-3">
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
        </div>

        {/* Trust Compliance & Distribution Matrix */}
        {/* <div className="bg-white rounded-lg p-5 shadow mt-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Trust Compliance</h3>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span>Trust Distribution Matrix Upload</span>
            <span className={classColors(trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX! ? 1 : undefined)}>{translator2(trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX! ? 1 : 3)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded">
            {trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX ? (

              <FileCard
                fileName={`${trustEstablishmentStore.dashboardData?.YEAR_NEEDS} Distribution Matrix`}
                fileUrl={trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX || "#"}
                uploadedAt={dayjs(trustEstablishmentStore.dashboardData?.DATE_UPDATED as string).format("DD MMM, YYYY  h:mmA")}
                fileSize="1.3MB"
                onDelete={() => handelFileDelete(trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX!, "Matrix")}
              />

            ) : "No Distribution Matrix Uploaded"}
          </div>
        </div>
      </div> */}
        <div className="bg-white rounded-xl p-6 shadow mt-6 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Trust Compliance</h3>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Trust Distribution Matrix Upload</span>
              <span className={classColors(trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX! ? 1 : undefined)}>
                {translator2(trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX! ? 1 : 3)}
              </span>
            </div>
            <div className="flex items-center">
              {trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX ? (
                <div className="w-full">
                  <div className="bg-[#F8FAFB] rounded-lg p-4">
                    <FileCard
                      fileName={`${trustEstablishmentStore.dashboardData?.YEAR_NEEDS} Distribution Matrix`}
                      fileUrl={trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX || "#"}
                      uploadedAt={dayjs(trustEstablishmentStore.dashboardData?.DATE_UPDATED as string).format("DD MMM, YYYY  h:mmA")}
                      fileSize="1.3MB"
                      onDelete={() => handelFileDelete(trustEstablishmentStore.dashboardData?.DISTRIBUTION_MATRIX!, "Matrix")}
                    />
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">No Distribution Matrix Uploaded</span>
              )}
            </div>
          </div>

        </div>
      </div>
      {url && (
        <Modal
          body={
            <DeleteFile
              close={handelClose}
              type={type as string}
              url={url}
              store={trustEstablishmentStore}
            />
          }
        />
      )}
    </>
  );
});

export default EstablishmentDashboard;