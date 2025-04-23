/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useGetSettlors } from "../../../../utils/hooks/useManageSettlors";
import { CreateTrustProps } from "../../../../utils/types";
import { FormInput, CustomSelect, TagInput, Button } from "../../../../components/elements";

import { useForm, Controller, FieldError } from "react-hook-form";

type BasicDetailsProps = {
  fields: any;
  updateFields: (data: CreateTrustProps) => void;
  changeTab: React.Dispatch<React.SetStateAction<number>>;
};

const BasicDetails = ({
  fields,
  updateFields,
  changeTab,
}: BasicDetailsProps) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {
      trustName: fields?.trustName || "",
      country: fields.country || "",
      localGovernmentArea: fields.localGovernmentArea || "",
      settlorId: fields.settlorId || "",
      state: fields.state || "",
      trustCommunities: fields.trustCommunities || [],
    },
  });

  const updateData = handleSubmit(async (data: any) => {
    console.log({ data });
    updateFields(data);
    changeTab(2);
  });

  const { isLoading, data } = useGetSettlors();

  const settlors = useMemo(() => {
    const settlorData = data?.data?.data || [];
    return settlorData.map(
      (settlor: { settlorId: string; settlorName: string }) => ({
        label: settlor?.settlorName,
        value: settlor?.settlorId,
      }),
    );
  }, [data]);

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

      <div className="space-y-6 mt-6">
        <div>
          <FormInput
            label="Name of Trust *"
            name="trustName"
            type="text"
            register={register}
            registerOptions={{
              required: "This field is required.",
            }}
            placeholder="Enter trust name"
            error={errors.trustName}
            errorMessage={`This field  is required`}
            required
          />
        </div>

        <div>
          <Controller
            control={control}
            name="settlorId"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="settlor-select"
                {...field}
                isLoading={isLoading}
                options={settlors}
                label="Name of Settlor"
                isMulti={true}
                placeholder="Select Settlor"
              />
            )}
          />
          {errors.settlorId && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name="country"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="country-select"
                {...field}
                // isLoading={trustLoading}
                options={arr}
                label="Country"
                isMulti={false}
                placeholder="Select Country"
              />
            )}
          />
          {errors.country && (
            <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
          )}
        </div>

        <div className="lg:flex-row flex flex-col  lg:items-center gap-x-4 gap-y-6">
          <div className="flex-1">
            <Controller
              control={control}
              name="state"
              rules={{}}
              render={({ field }) => (
                <CustomSelect
                  id="state-select"
                  {...field}
                  // isLoading={trustLoading}
                  options={state}
                  label="State"
                  isMulti={false}
                  placeholder="Select state"
                />
              )}
            />
            {errors.state && (
              <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
            )}
          </div>

          <div className="flex-1">
            <Controller
              control={control}
              name="localGovernmentArea"
              rules={{}}
              render={({ field }) => (
                <CustomSelect
                  id="lga-select"
                  {...field}
                  // isLoading={trustLoading}
                  options={lga}
                  label="Local Government Area"
                  isMulti={false}
                  placeholder="Select"
                />
              )}
            />
            {errors.localGovernmentArea && (
              <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
            )}
          </div>
        </div>

        <div>
          <TagInput
            name="trustCommunities"
            register={register}
            setValue={setValue}
            defaultValue={fields?.trustCommunities || []}
            registerOptions={{
              required: "Fields are required",
              validate: (value: string) =>
                value.length > 0 || "At least one community is required",
            }}
            clearErrors={clearErrors}
            placeholder="Onne, Eleme"
            errors={errors as Record<string, FieldError | undefined>}
            withCustomLabel={
              <label className={`block text-base text-primary-100 font-medium`}>
                Trust Communities
              </label>
            }
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
        <Button
          onClick={close}
          className="border text-black bg-white border-gray-7 rounded-lg py-2 px-4 lg:px-10"
          buttonText="Cancel"
          width="w-fit"
        />

        <Button padding="py-3" buttonText="Next" />
      </div>
    </form>
  );
};

export default BasicDetails;

const arr = [
  {
    label: "Nigeria",
    value: "Nigeria",
  },
];

const state = [
  {
    label: "Rivers",
    value: "Rivers",
  },
];

const lga = [
  {
    label: "Obio-kpor",
    value: "Obio-kpor",
  },
];
