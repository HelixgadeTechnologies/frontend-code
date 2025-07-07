import { FormInput, Button } from "../../../../components/elements";
import { observer } from "mobx-react-lite";
import { trustStore as TrustStore } from "../../store/trustStore";
import { createContext, useContext } from "react";
import { ITrustPayloadData } from "../../types/interface";

const trustStoreCTX = createContext(TrustStore);
const Bot_AC = observer(({ method }: { method: any }) => {
  const trustStore = useContext(trustStoreCTX);
  const { register, handleSubmit, formState: { errors } } = method;
  const onSubmit = (data: any) => {
    trustStore.isSaving = true
    // console.log("Form Data:", data, );

    const trustFormData: ITrustPayloadData = {
      ...trustStore.trustFormData,
      totalMaleBotMembers: Number(data.totalMaleBotMembers),
      totalFemaleBotMembers: Number(data.totalFemaleBotMembers),
      totalPwdBotMembers: Number(data.totalPwdBotMembers),
      totalMaleAdvisoryCommitteeMembers: Number(data.totalMaleAdvisoryCommitteeMembers),
      totalFemaleAdvisoryCommitteeMembers: Number(data.totalFemaleAdvisoryCommitteeMembers),
      totalPwdAdvisoryCommitteeMembers: Number(data.totalPwdAdvisoryCommitteeMembers),
      totalMaleManagementCommitteeMembers: Number(data.totalMaleManagementCommitteeMembers),
      totalFemaleManagementCommitteeMembers: Number(data.totalFemaleManagementCommitteeMembers),
      totalPwdManagementCommitteeMembers: Number(data.totalPwdManagementCommitteeMembers)
    }


    //save to store
    trustStore.trustFormData = trustFormData
    trustStore.isSaving = false
    //move to the next form
    trustStore.setCompletedTab();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-8 px-4">
      <div className="text-center">
        <h2 className="text-lg lg:text-2xl font-semibold text-primary-100">
          Create New Trust
        </h2>
        <p className="mt-1 text-xs text-gray-4">
          Fill out these details to build your broadcast
        </p>
      </div>

      <div className="mt-6">
        <h2 className=" mb-6 text-base font-bold text-primary-100">
          Total Number of BoT members
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <FormInput
              label={`Male`}
              error={errors.totalMaleBotMembers}
              name="totalMaleBotMembers"
              type="number"
              placeholder="Male"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
              />
          </div>

          <div>
            <FormInput
              label={`Female`}
              error={errors.totalFemaleBotMembers}
              name="totalFemaleBotMembers"
              type="number"
              placeholder="Female"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
            />
          </div>

          <div>
            <FormInput
              label={`PwD`}
              error={errors.totalPwdBotMembers}
              name="totalPwdBotMembers"
              type="number"
              placeholder="Female"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
            />
          </div>
        </div>
      </div>

      <div className="my-8">
        <h2 className="mb-6  text-base font-bold text-primary-100">
          Total Number if Advisory committee Members{" "}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <FormInput
              label={`Male`}
              error={errors.totalMaleAdvisoryCommitteeMembers}
              name="totalMaleAdvisoryCommitteeMembers"
              type="number"
              placeholder="Male"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
            />
          </div>

          <div>
            <FormInput
              label={`Female`}
              error={errors.totalFemaleAdvisoryCommitteeMembers}
              name="totalFemaleAdvisoryCommitteeMembers"
              type="number"
              placeholder="Female"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
            />
          </div>

          <div>
            <FormInput
              label={`PwD`}
              error={errors.totalPwdAdvisoryCommitteeMembers}
              name="totalPwdAdvisoryCommitteeMembers"
              type="number"
              placeholder="Female"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
            />
          </div>
        </div>
      </div>

      <div className="">
        <h2 className="mb-6  text-base font-bold text-primary-100">
          Total Number of Management Committee members{" "}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <FormInput
              label={`Male`}
              error={errors.totalMaleManagementCommitteeMembers}
              name="totalMaleManagementCommitteeMembers"
              type="number"
              placeholder="Male"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
            />
          </div>

          <div>
            <FormInput
              label={`Female`}
              error={errors.totalFemaleManagementCommitteeMembers}
              name="totalFemaleManagementCommitteeMembers"
              type="number"
              placeholder="Female"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
            />
          </div>

          <div>
            <FormInput
              label={`PwD`}
              error={errors.totalPwdManagementCommitteeMembers}
              name="totalPwdManagementCommitteeMembers"
              type="number"
              placeholder="Female"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              errorMessage="This field is required"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">

        <Button padding="py-3" buttonText={trustStore.isSaving?"Saving...":"Next"} />
      </div>
    </form>
  );
});

export default Bot_AC;
