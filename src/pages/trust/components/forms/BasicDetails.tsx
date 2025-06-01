import { FormInput, CustomSelect, Button } from "../../../../components/elements";
import { Controller } from "react-hook-form";
import { Observer, observer } from "mobx-react-lite";
import { trustStore as TrustStore } from "../../store/trustStore"
import { createContext,useCallback, useContext, useState } from "react";
import { ITrustPayloadData } from "../../types/interface";
import { settingStore as SettingStore } from "../../../Settings/store/settingStore";
import { IDropdownProp, ISettlor } from "../../../Settings/types/interface";
import { authStore as AuthStore } from "../../../auth/store/authStore";

const AuthStoreCTX = createContext(AuthStore);
const settingStoreCTX = createContext(SettingStore);
const trustStoreCTX = createContext(TrustStore);
const BasicDetails = observer(({ method }: { method: any }) => {
  const authStore = useContext(AuthStoreCTX);
  const trustStore = useContext(trustStoreCTX);
  const settingStore = useContext(settingStoreCTX);
  const { control, register, handleSubmit, formState: { errors } } = method;
  const [lg, setSetLg] = useState<Array<string>>([]);
  const onSubmit = (data: any) => {
    trustStore.isSaving = true
    // console.log("Form Data:", data,);

    const trustFormData: ITrustPayloadData = {
      ...trustStore.trustFormData,
      trustName: data.trustName,
      settlor: data.settlor.map((e: IDropdownProp) => e.value).join(", "),
      nameOfOmls: data.nameOfOmls,
      userId: authStore.user.userId,
      country: data.country.value,
      state: data.state.value,
      localGovernmentArea: data.localGovernmentArea.value,
      trustCommunities: data.trustCommunities,
    }


    //save to store
    trustStore.trustFormData = trustFormData
    trustStore.isSaving = false
    //move to the next form
    trustStore.setCompletedTab();
  };

  const selectState = useCallback((v: IDropdownProp) => {
    trustStore.allLGA.clear();
    let localGov = trustStore.getLG(String(v?.value));
    if (localGov.length > 0) {
      setSetLg(localGov);
    }
    trustStore.selectedState = String(v?.value);
    method.setValue("state", v); //set state field
    method.setValue("localGovernmentArea", null); // Reset LGA field
  }, [trustStore, method]);

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

      <div className="space-y-6 mt-6">
        <div className="lg:flex-row flex flex-col  lg:items-center gap-x-4 gap-y-6">
          <div className="flex-1">
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
          <div className="flex-1">
            <FormInput
              label="Name of OMLs *"
              name="nameOfOmls"
              type="text"
              register={register}
              registerOptions={{
                required: "This field is required.",
              }}
              placeholder="Enter oml name"
              error={errors.trustName}
              errorMessage={`This field  is required`}
              required
            />

          </div>
        </div>

        <div>
          <Controller
            control={control}
            name="settlor"
            rules={{ required: true }}
            render={({ field }) => (
              <CustomSelect
                id="settlor-select"
                {...field}
                isLoading={settingStore.isLoading}
                options={[...settingStore.allSettlor.values()].map((v: ISettlor) => {
                  return {
                    label: String(v?.settlorName),
                    value: v?.settlorName
                  }
                })}
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
              // rules={{}}
              render={({ field }) => (
                <CustomSelect
                  id="state-select"
                  {...field}
                  // isLoading={trustLoading}
                  options={[...trustStore.allStates.values()].map((s: string) => {
                    return {
                      label: s,
                      value: s
                    }
                  })}
                  label="State"
                  isMulti={false}
                  placeholder="Select state"
                  onChange={(v) => selectState(v as IDropdownProp)}
                />
              )}
            />
            {errors.state && (
              <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
            )}
          </div>
          <Observer>
            {() => (
              <div className="flex-1">
                <Controller
                  control={control}
                  name="localGovernmentArea"
                  // rules={{}}

                  render={({ field }) => (
                    <CustomSelect
                      id="lga-select"
                      {...field}
                      // isLoading={trustLoading}
                      options={lg.map((s: string) => {
                        return {
                          label: s,
                          value: s
                        }
                      })}
                      label="Local Government Area"
                      isMulti={false}
                      // isDisabled={true}
                      isDisabled={trustStore.selectedState ? false : true}
                      placeholder="Select"
                    />
                  )}
                />
                {errors.localGovernmentArea && (
                  <p className="mt-2 mb-4 text-xs  text-red-400 ">Assign a trust</p>
                )}
              </div>
            )}
          </Observer>
        </div>

        <div>
          <FormInput
            label="Trust Communities"
            name="trustCommunities"
            type="text"
            register={register}
            registerOptions={{
              required: "This field is required.",
            }}
            placeholder="Enter trust name"
            error={errors.trustCommunities}
            errorMessage={`This field  is required`}
            required
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
        <Button padding="py-3" buttonText={trustStore.isSaving ? "Saving..." : "Next"} />
      </div>
    </form>
  );
});

export default BasicDetails;

const arr = [
  {
    label: "Nigeria",
    value: "Nigeria",
  },
];

