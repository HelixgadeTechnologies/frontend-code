import BasicDetails from "./BasicDetails";
import BotDetails from "./BotDetails";
import Bot_AC from "./Bot_AC";
import PreviewTrust from "./PreviewTrust";
import { observer } from "mobx-react-lite";
import { trustStore as TrustStore } from "../../store/trustStore";
import { createContext, useCallback, useContext, useEffect } from "react";
import { TabType } from "../../../project/types/interface";
import { useForm } from "react-hook-form";
import { settingStore as SettingStore } from "../../../Settings/store/settingStore";
import { toast } from "react-toastify";
import { ITrustPayload, ITrustPayloadData } from "../../types/interface";
import { GoBack } from "../../../../components/elements";
import { useParams } from "react-router-dom";

const settingStoreCTX = createContext(SettingStore);
const trustStoreCTX = createContext(TrustStore)
const CreateTrust = observer(() => {
  const trustStore = useContext(trustStoreCTX);
  const settingStore = useContext(settingStoreCTX);
  const { name } = useParams();

  const method = useForm({
    defaultValues: {
      ...trustStore.trustFormData,
      totalMaleBotMembers: 0,
      totalFemaleBotMembers: 0,
      totalPwdBotMembers: 0,
      totalMaleAdvisoryCommitteeMembers: 0,
      totalFemaleAdvisoryCommitteeMembers: 0,
      totalPwdAdvisoryCommitteeMembers: 0,
      totalMaleManagementCommitteeMembers: 0,
      totalFemaleManagementCommitteeMembers: 0,
      totalPwdManagementCommitteeMembers: 0,
    },
    shouldUnregister: false,
  })
  useEffect(() => {
    async function loadRequests() {
      trustStore.getFormSteps();
      trustStore.getAllStates();
      await settingStore.getAllSettlor();
    }
    loadRequests();
  }, []);
  const handleTabChange = useCallback((tab: TabType) => {
    trustStore.setActiveTab(tab)
  }, [trustStore]);


  const saveProjectData = useCallback(() => {
    async function loadRequests() {
      try {
        const completion = trustStore.calculateTrustCompletion(trustStore.trustFormData);
        trustStore.trustFormData.completionStatus = completion;

        const payload: ITrustPayload = {
          isCreate: true,
          data: trustStore.trustFormData
        }
        const response = await trustStore.createTrust(payload)
        if (response) {
          toast.success("Trust Successfully Created");
          trustStore.trustFormData = {} as ITrustPayloadData;
          method.reset()
          trustStore.getFormSteps()
          trustStore.pageSwitched = 1
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
    }
    loadRequests()
  }, [trustStore]);

  const switchPage = useCallback(() => {
    trustStore.pageSwitched = 1;
  }, [trustStore]);

  return (
    <>
      <div className="py-2 px-7">
        <GoBack action={switchPage} trustName={name || "Trust"} />
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-x-8">
        <section className="lg:col-span-8 bg-white">
          {trustStore.activeTap?.id === 1 && (
            <BasicDetails method={method} />
          )}

          {trustStore.activeTap?.id === 2 && (
            <BotDetails method={method} />
          )}

          {trustStore.activeTap?.id === 3 && (
            <Bot_AC method={method} />
          )}

          {trustStore.activeTap?.id === 4 && (
            <PreviewTrust onSave={saveProjectData} trustStore={trustStore} />
          )}
        </section>
        <section className="lg:col-span-4 bg-white p-6">
          <ul className="space-y-2 mt-8">
            {[...trustStore.formTab.values()]?.map((item: TabType) => {

              return (
                <li
                  onClick={() => handleTabChange(item)}
                  className={`${item.isActive
                    ? "bg-blue-0 "
                    : item.isVisible
                      ? " hover:bg-blue-0/50"
                      : " cursor-not-allowed"
                    } flex items-center justify-between list-none p-2 text-sm font-medium ${item.isVisible ? "cursor-pointer" : ""
                    }`}
                  key={item.id}
                >
                  <span className=" flex items-center gap-x-2">
                    <span
                      className={` h-10 w-10 rounded-full flex items-center justify-center font-bold text-base lg:text-xl ${item.isCompleted
                        ? "bg-primary-200 text-white"
                        : item.isActive
                          ? "bg-primary-200 text-white"
                          : "bg-white border border-[#98A2B3] text-[#98A2B3]"
                        } `}
                    >
                      {item.id}
                    </span>
                    <span
                      className={` ${item.isCompleted
                        ? "text-primary-100 font-bold"
                        : item.isActive
                          ? "text-primary-100"
                          : "text-primary-100"
                        } `}
                    >
                      {item.name}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
});

export default CreateTrust;

