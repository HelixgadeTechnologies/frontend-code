import { GoBack } from "../../../components/elements";
import { useNavigate, useParams } from "react-router-dom";
import { trustStore as TrustStore } from "../store/trustStore";
import { createContext, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { ISurveyType, ISurveyTypePayload } from "../types/interface";

const trustStoreCTX = createContext(TrustStore);
const TrustSettingsPage = observer(() => {
  const trustStore = useContext(trustStoreCTX);
  const { name } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      await trustStore.getATrust(selectedTrustId as string);
    }
    fetchData();
  }, [trustStore]);

  const onSubmit = async (accessType: ISurveyType) => {
    try {
      const surveyAccessPayload: ISurveyTypePayload = {
        trustId: trustStore.selectedTrustId as string,
        accessName: accessType.type,
      };

      const response = await trustStore.surveyAccess(surveyAccessPayload);
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
      onChange: (value: boolean) => {
        trustStore.setConflictForm = value;
        const payloadType:ISurveyType= {type:"CONFLICT"};
        onSubmit(payloadType);
      }
    },
    {
      key: "communitySatisfaction",
      label: "Community Satisfaction Survey Form",
      description: "Enable or disable the community satisfaction survey form for this trust.",
      value: trustStore.setSatisfactionForm,
      onChange: (value: boolean) => {
        trustStore.setSatisfactionForm = value;
        const payloadType:ISurveyType= {type:"SATISFACTION"};
        onSubmit(payloadType);
      }
    },
    {
      key: "economicImpact",
      label: "Economic Impact Survey Form",
      description: "Enable or disable the economic impact survey form for this trust.",
      value: trustStore.setEconomicImpactForm,
      onChange: (value: boolean) => {
        trustStore.setEconomicImpactForm = value;
        const payloadType:ISurveyType= {type:"ECONOMIC"};
        onSubmit(payloadType);
      }
    },
  ];

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
                    <div className="font-medium text-gray-900">{setting.label}</div>
                    <div className="text-gray-500 text-sm">{setting.description}</div>
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