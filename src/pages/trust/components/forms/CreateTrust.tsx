import { useState } from "react";

import BasicDetails from "./BasicDetails";
import BotDetails from "./BotDetails";
import Bot_AC from "./Bot_AC";
import PreviewTrust from "./PreviewTrust";

import { CreateTrustProps, TrustInputFields } from "../../../../utils/types";

// import { useAddUpdateTrust } from "../../../utils/hooks/useTrusts";

// import { toast } from "react-toastify";
// import { useQueryClient } from "@tanstack/react-query";

const CreateTrust = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<number>(tabs[0].id);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);

  const [fields, setFields] = useState<Partial<TrustInputFields>>({});

  const updateFields = (data: Partial<CreateTrustProps>) => {
    const updatedFields = { ...fields, ...data };
    setFields(updatedFields);

    // Mark the current tab as completed
    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs([...completedTabs, activeTab]);
    }
  };

  // Function to check if a tab can be accessed
  const canAccessTab = (tabId: number) => {
    if (tabId === 1) return true; // First tab is always accessible
    return (
      completedTabs.includes(Number(tabId) - 1) ||
      completedTabs.includes(Number(tabId))
    );
  };

  // Function to handle tab change
  const handleTabChange = (tabId: number) => {
    if (canAccessTab(tabId)) {
      setActiveTab(tabId);
    }
  };

  //  add admin
  // const { mutate: mutateAddTrust } = useAddUpdateTrust();

  const submitForm = async () => {
    setIsSubmitting(true);

    // const payload = {
    //   isCreate: true,
    //   data: {
    //     ...fields,
    //     settlorId: fields?.settlorId?.map((i) => i.value),
    //     trustCommunities: fields?.trustCommunities?.join(","),
    //     country: "Nigeria",
    //     state: fields?.state?.value ?? "",
    //     localGovernmentArea: fields?.localGovernmentArea?.value,
    //   },
    // } as CreateTrustProps;

    // mutateAddTrust(payload, {
    //   onSuccess: (res) => {
    //     toast.success(res?.data?.message);
    //     queryClient.invalidateQueries({ queryKey: ["trusts"] });
    //     setIsSubmitting(false);
    //   },
    //   onError: (error) => {
    //     const err = error as { response?: { data?: { error?: string } } };
    //     toast.error(`Error: ${err?.response?.data?.error}`);
    //     setIsSubmitting(false);
    //   },
    // });
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-x-8">
      <section className="lg:col-span-8 bg-white">
        {activeTab === 1 && (
          <BasicDetails
            changeTab={setActiveTab}
            fields={fields}
            updateFields={updateFields}
          />
        )}

        {activeTab === 2 && (
          <BotDetails
            changeTab={setActiveTab}
            fields={fields}
            updateFields={updateFields}
          />
        )}

        {activeTab === 3 && (
          <Bot_AC
            changeTab={setActiveTab}
            fields={fields}
            updateFields={updateFields}
          />
        )}

        {activeTab === 4 && (
          <PreviewTrust
            changeTab={setActiveTab}
            fields={fields}
            submit={submitForm}
            isSubmitting={isSubmitting}
          />
        )}
      </section>
      <section className="lg:col-span-4 bg-white p-6">
        <ul className="space-y-2 mt-2">
          {tabs?.map((item) => {
            const isCompleted = completedTabs.includes(item.id);
            const isAccessible = canAccessTab(item.id);
            return (
              <li
                onClick={() => isAccessible && handleTabChange(item.id)}
                className={`${activeTab === item.id
                  ? "bg-blue-0 "
                  : isAccessible
                    ? " hover:bg-blue-0/50"
                    : " cursor-not-allowed"
                  } flex items-center justify-between list-none p-2 text-sm font-medium ${isAccessible ? "cursor-pointer" : ""
                  }`}
                key={item.id}
              >
                <span className=" flex items-center gap-x-2">
                  <span
                    className={` h-10 w-10 rounded-full flex items-center justify-center font-bold text-base lg:text-xl ${isCompleted
                      ? "bg-primary-200 text-white"
                      : activeTab === item.id
                        ? "bg-primary-200 text-white"
                        : "bg-white border border-[#98A2B3] text-[#98A2B3]"
                      } `}
                  >
                    {item.id}
                  </span>
                  <span
                    className={` ${isCompleted
                      ? "text-primary-100 font-bold"
                      : activeTab === item.id
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
  );
};

export default CreateTrust;

interface TabType {
  id: number;
  name: string;
  desc: string;
}

const tabs: TabType[] = [
  {
    id: 1,
    name: "Create New Trust",
    desc: "Fill out these details and get your trust ready",
  },
  {
    id: 2,
    name: "Create Segments",
    desc: "Get full control over your audience",
  },
  {
    id: 3,
    name: "Add BoT,MC and AC",
    desc: "Optimize your campaign reach with adsense",
  },
  {
    id: 4,
    name: "Preview Trust",
    desc: "Setup your customer journey flow",
  },
];
