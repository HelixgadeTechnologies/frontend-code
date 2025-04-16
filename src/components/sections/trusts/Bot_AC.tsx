/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateTrustProps } from "../../../utils/types";

import { FormInput, Button } from "../../elements";

type BotFormType = {
  fields: any;
  updateFields: (data: CreateTrustProps) => void;
  changeTab: React.Dispatch<React.SetStateAction<number>>;
};

import { useForm } from "react-hook-form";

const Bot_AC = ({ fields, updateFields, changeTab }: BotFormType) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      totalMaleBotMembers: fields?.totalMaleBotMembers || "",
      totalFemaleBotMembers: fields?.totalFemaleBotMembers || "",
      totalPwdBotMembers: fields?.totalPwdBotMembers || "",

      totalMaleAdvisoryCommitteeMembers:
        fields?.totalMaleAdvisoryCommitteeMembers || "",
      totalFemaleAdvisoryCommitteeMembers:
        fields?.totalFemaleAdvisoryCommitteeMembers || "",
      totalPwdAdvisoryCommitteeMembers:
        fields?.totalPwdAdvisoryCommitteeMembers || "",

      totalMaleManagementCommitteeMembers:
        fields?.totalMaleManagementCommitteeMembers || "",
      totalFemaleManagementCommitteeMembers:
        fields?.totalFemaleManagementCommitteeMembers || "",
      totalPwdManagementCommitteeMembers:
        fields?.totalPwdManagementCommitteeMembers || "",
    },
  });

  const updateData = handleSubmit(async (data) => {
    updateFields(data as unknown as CreateTrustProps);
    changeTab(4);
  });

  console.log({ fields });

  return (
    <form onSubmit={updateData} className="py-8 px-4">
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
        <Button
          onClick={() => changeTab(2)}
          className="border text-black bg-white border-gray-7 rounded-lg py-2 px-4 lg:px-10"
          buttonText="Back"
          width="w-fit"
        />

        <Button padding="py-3" buttonText="Next" />
      </div>
    </form>
  );
};

export default Bot_AC;
