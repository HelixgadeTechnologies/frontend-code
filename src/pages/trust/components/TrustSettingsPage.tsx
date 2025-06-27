import { GoBack } from "../../../components/elements";
import { useNavigate, useParams } from "react-router-dom";
import { trustStore as TrustStore } from "../store/trustStore";
import { createContext, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { ISurveyType, ISurveyTypePayload } from "../types/interface";
import { FaCopy } from "react-icons/fa";

const trustStoreCTX = createContext(TrustStore);
const TrustSettingsPage = observer(() => {
  const trustStore = useContext(trustStoreCTX);
  const { name } = useParams();
  const navigate = useNavigate();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);


  useEffect(() => {
    async function fetchData() {
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      await trustStore.getATrust(selectedTrustId as string);
    }
    fetchData();
  }, [trustStore]);


  const onSubmit = async (accessType: ISurveyType, url: string) => {
    try {
      const surveyAccessPayload: ISurveyTypePayload = {
        trustId: trustStore.selectedTrustId as string,
        accessName: accessType.type,
      };

      const response = await trustStore.surveyAccess(surveyAccessPayload, url);
      if (response) {
        toast.success("Survey access updated successfully.");
      }

    } catch (error: any) {
      const message = error?.response?.body?.message;
      const message2 = error?.response?.body?.error;
      if (message?.includes("Please try again. Database connection failed.")) {
        toast.info(message);
      } else {
        toast.error(message2);
      }
    }
  };

  const settings = [
    {
      key: "conflictSurvey",
      label: "Conflict Survey Form",
      description: "Enable or disable the conflict survey form for this trust.",
      value: trustStore.setConflictForm,
      url: `${window.location.protocol}//${window.location.host}/conflict/${trustStore.selectedTrustId}`,
      onChange: (value: boolean) => {
        trustStore.setConflictForm = value;
        const payloadType: ISurveyType = { type: "CONFLICT" };
        const hostUrl = `${window.location.protocol}//${window.location.host}/conflict/${trustStore.selectedTrustId}`;
        onSubmit(payloadType, hostUrl);
      }
    },
    {
      key: "communitySatisfaction",
      label: "Community Satisfaction Survey Form",
      description: "Enable or disable the community satisfaction survey form for this trust.",
      value: trustStore.setSatisfactionForm,
      url: `${window.location.protocol}//${window.location.host}/satisfaction/${trustStore.selectedTrustId}`,
      onChange: (value: boolean) => {
        trustStore.setSatisfactionForm = value;
        const payloadType: ISurveyType = { type: "SATISFACTION" };
        const hostUrl = `${window.location.protocol}//${window.location.host}/satisfaction/${trustStore.selectedTrustId}`;
        onSubmit(payloadType, hostUrl);
      }
    },
    {
      key: "economicImpact",
      label: "Economic Impact Survey Form",
      description: "Enable or disable the economic impact survey form for this trust.",
      value: trustStore.setEconomicImpactForm,
      url: `${window.location.protocol}//${window.location.host}/economic-impact/${trustStore.selectedTrustId}`,
      onChange: (value: boolean) => {
        trustStore.setEconomicImpactForm = value;
        const payloadType: ISurveyType = { type: "ECONOMIC" };
        const hostUrl = `${window.location.protocol}//${window.location.host}/economic-impact/${trustStore.selectedTrustId}`;
        onSubmit(payloadType, hostUrl);
      }
    },
  ];


  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const classColors = (data: boolean | undefined): string => {
    if (data == true) return "bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium";
    if (data == false) return "bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-medium";
    return "bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-medium";
  }
  const translator2 = (data: boolean): string => {
    if (data == true) return "ACTIVE";
    if (data == false) return "NOT ACTIVE";
    return "UNKNOWN";
  }


  return (
    <div className=" mx-auto p-8">
      <GoBack action={() => navigate(-1)} trustName={name || ""} page="Settings" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mt-6">
          Trust Settings
        </h1>
      </div>
      <p className="text-gray-600 mb-4">
        Have control over the survey forms for this trust. You can enable or disable the conflict, community satisfaction, and economic impact survey forms as needed.
      </p>

      <div className=" mx-auto mb-6">
        <div className="flex items-center gap-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-3 rounded shadow animate-pulse">
          <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
          <span className="font-semibold">
            When you turn on any survey form, an email notification will be sent to the <span className="underline">ADMIN</span> and <span className="underline">DRA</span> assigned to this trust.
          </span>
        </div>
      </div>

      <div className="mt-2">
        <div className="min-h-screen bg-gray-50  ">
          <div className="p-8 ">
            {/* <h2 className="text-2xl font-bold text-blue-800 mb-2">Trust Settings</h2> */}
            <p className="text-gray-500 mb-8">
              Use the switches below to enable or disable survey forms for this trust.
            </p>
            <div className="space-y-6">
              {settings.map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {setting.label} {" "}
                      <span className={`${classColors(setting.value)} ml-9`}>{translator2(setting.value)}</span>
                    </div>
                    <div className="text-gray-500 text-sm">{setting.description}</div>
                    {setting.value && (
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <span className="text-green-600 font-bold">✔</span>
                        <a
                          href={setting.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-gray-700 text-sm hover:underline"
                        >
                          Click here to preview the form
                        </a>
                        {"  "}
                        <button
                          className="text-gray-400 hover:text-primary-400"
                          type="button"
                          onClick={() => handleCopy(setting.url, setting.key)}
                        >
                          <FaCopy />
                        </button>
                        {copiedKey === setting.key && (
                          <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-black text-white text-xs shadow z-10">
                            Copied!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.value}
                      onChange={() => setting.onChange(!setting.value)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200"></div>
                    <div className="absolute ml-1 mt-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-all duration-200"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TrustSettingsPage;