import { useForm } from "react-hook-form";
import CustomRadio from "../../../../components/elements/Radio";
import { Button } from "../../../../components/elements";
import { IEconomicImpactPayload, IEconomicImpactPayloadData, IEconomicImpactStore } from "../../types/interface";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { ITrustStore } from "../../../trust/types/interface";

const EconomicImpactForm = observer(({ close, economicImpactStore, trustStore }: { close: () => void, economicImpactStore: IEconomicImpactStore, trustStore: ITrustStore }) => {
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // console.log("Form Data:", data);
      const economicImpactData: IEconomicImpactPayloadData = {
        businessGrowth: Number(data.businessGrowth),
        incomeIncrease: Number(data.incomeIncrease),
        livelihoodImprove: Number(data.livelihoodImprove),
        accessAmenities: Number(data.accessAmenities),
        trustId: trustStore.selectedTrustId 
      };
      const payload: IEconomicImpactPayload = {
        isCreate: true,
        data: economicImpactData
      }
      const response = await economicImpactStore.createEconomicImpact(payload)
      if (response) {
        toast.success("Economic Impact Successfully Submitted");
        economicImpactStore.isAddModelOpen = false;
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

  return (
    <div className="p-6 bg-gray-100">
      <div className="relative mx-auto bg-white shadow-md rounded-lg p-8">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Economic Impact of HCDT in Host Communities
        </h1>
        <p className="text-gray-600 mb-6">
          Percent of host community members who reported that their income and
          livelihood have improved as a result of the activities/projects
          implemented by the HCDT
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Trust Establishment Status
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              These are your personal details, they are visible to the public
            </p>

            <div className="mb-4">
              <CustomRadio
                name="businessGrowth"
                control={control}
                rules={{ required: "This field is required" }}
                label="i. My business is generating more money since they implemented some of the HCDT projects in my community."
                options={[
                  { value: "1", label: "Very True" },
                  { value: "2", label: "Slightly" },
                  { value: "3", label: "Not True" },
                ]}
              />
            </div>

            <div className="mb-4">
              <CustomRadio
                name="incomeIncrease"
                control={control}
                rules={{ required: "This field is required" }}
                label="ii. My income has increased since the implementation of some of the HCDT projects in my community."
                options={[
                  { value: "1", label: "Very True" },
                  { value: "2", label: "Slightly" },
                  { value: "3", label: "Not True" },
                ]}
              />
            </div>

            <div className="mb-4">
              <CustomRadio
                name="livelihoodImprove"
                control={control}
                rules={{ required: "This field is required" }}
                label="iii. The implemented HCDT projects have bettered my livelihood and quality of lives."
                options={[
                  { value: "1", label: "Very True" },
                  { value: "2", label: "Slightly" },
                  { value: "3", label: "Not True" },
                ]}
              />
            </div>

            <div className="mb-4">
              <CustomRadio
                name="accessAmenities"
                control={control}
                rules={{ required: "This field is required" }}
                label="iv. As a result of the HCDT projects, my household/I now have access to these basic amenities than before."
                options={[
                  { value: "1", label: "Healthcare" },
                  { value: "2", label: "Education" },
                  { value: "3", label: "Portable Water" },
                  { value: "4", label: "Electricity" },
                  { value: "5", label: "Good Roads" },
                  { value: "6", label: "Market" },
                  { value: "7", label: "Favourable Business Environment" },
                ]}
              />
            </div>
          </div>
          <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
            <Button
              onClick={reset}
              className="border text-black bg-white border-blue-7 rounded-lg py-2 px-4 lg:px-10"
              buttonText="Cancel"
              width="w-fit"
            />

            <Button padding="py-3" buttonText={economicImpactStore.isSubmitting ? "Submitting..." : "Submit"} />
          </div>
        </form>
      </div>
    </div>
  );
});

export default EconomicImpactForm;