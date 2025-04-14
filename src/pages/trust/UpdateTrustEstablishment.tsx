import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  GoBack,
  CustomRadio,
  FileUpload,
  CustomSelect,
  FormInput,
} from "../../components/elements";
import { useForm, Controller } from "react-hook-form";

import { EstablishmentFormValues } from "../../utils/types";
import { year } from "../../utils/data";

import { useGetAdmins } from "../../utils/hooks/useManageAdmin";

const UpdateTrustEstablishment = () => {
  const { name, id } = useParams();
  const [yearSelected, setYearSelected] = useState(false);

  const { isLoading, data } = useGetAdmins();

  const admins = useMemo(() => {
    const adminData = data?.data?.data || [];
    return adminData.map(
      (admin: { userId: string; firstName: string; lastName: string }) => ({
        label: admin.firstName + " " + admin.lastName,
        value: admin.userId,
      }),
    );
  }, [data]);

  const { control, register } = useForm<EstablishmentFormValues>();

  const handleYearChange = (selected: any) => {
    if (selected && selected.value) {
      setYearSelected(true);
    } else {
      setYearSelected(false);
    }
  };

  return (
    <div className="py-4 px-7">
      <GoBack page="Trust Establishment" trustName={name || ""} />

      <div className="my-7 flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-black capitalize">
          Trust Establishment and Governance <br /> Structure Dashboard
        </h2>

        <Link to={`/trust/${name}/${id}`}>
          <button className="px-3 py-2 rounded-md border border-black text-black font-medium text-sm">
            Back to Dashbaord
          </button>
        </Link>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6">
          <section>
            <h2 className="font-semibold text-xl text-black capitalize">
              Trust Establishment Status{" "}
            </h2>
            <p className="text-base text-[#8C94A6]">
              These are your personal details, they are visible to the public{" "}
            </p>

            <div className="mt-6 space-y-8">
              <CustomRadio<EstablishmentFormValues>
                name="trustRegisteredWithCAC"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Trust registered with CAC"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "in_progress", label: "In progress" },
                  { value: "no", label: "No" },
                ]}
              />

              <FileUpload<EstablishmentFormValues>
                name="cscDocument"
                control={control}
                label="Upload your document"
                helperText="PDF format • Max. 5MB"
                accept="application/pdf"
                maxSize={5 * 1024 * 1024} // 5MB
                buttonText="Upload"
              />
            </div>
          </section>

          <section className="my-8">
            <h2 className="font-semibold text-xl text-black capitalize">
              Year incorporated
            </h2>

            <div>
              <Controller
                control={control}
                name="yearIncorporated"
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomSelect
                    id="year"
                    {...field}
                    label=""
                    options={year}
                    isMulti={false}
                    placeholder="Select year"
                  />
                )}
              />
            </div>

            <div className="mt-6 space-y-8">
              <CustomRadio<EstablishmentFormValues>
                name="botConstitutedAndInaugurated"
                control={control}
                rules={{ required: "Please select a status" }}
                label="BoT constituted and Inaugurated"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "in_progress", label: "In progress" },
                  { value: "no", label: "No" },
                ]}
              />

              <CustomRadio<EstablishmentFormValues>
                name="managementCommitteeConstitutedAndInaugurated"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Management committee Constituted and Inaugrated"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "in_progress", label: "In progress" },
                  { value: "no", label: "No" },
                ]}
              />

              <CustomRadio<EstablishmentFormValues>
                name="advisoryCommitteeConstitutedAndInaugurated"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Advisory committee has been constituted and inaugurated"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "in_progress", label: "In progress" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
          </section>

          <section className="my-8">
            <h2 className="font-semibold text-xl text-black capitalize">
              Status of the trust Development plan and development plan budget{" "}
            </h2>
            <p className="text-base text-[#8C94A6]">
              These are your personal details, they are visible to the public{" "}
            </p>

            <div className="mt-6 space-y-8">
              <CustomRadio<EstablishmentFormValues>
                name="isTrustDevelopmentPlanReadilyAvailable"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Is the trust development plan readily available?"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "in_progress", label: "In progress" },
                  { value: "no", label: "No" },
                ]}
              />

              <CustomRadio<EstablishmentFormValues>
                name="isTrustDevelopmentPlanBudgetReadilyAvailable"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Is the trust development plan budget readily available?"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "in_progress", label: "In progress" },
                  { value: "no", label: "No" },
                ]}
              />

              <div className="lg:flex gap-x-4 justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Year Developed
                  </label>

                  <input
                    className="mt-4 w-full border py-3 text-center  border-[#525866] focus:border-primary-100 rounded-md"
                    type="text"
                    placeholder="2021"
                    {...register("yearDeveloped")}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Year Expired
                  </label>

                  <input
                    className="mt-4 w-full border py-3 text-center  border-[#525866] focus:border-primary-100 rounded-md"
                    type="text"
                    placeholder="2021"
                    {...register("yearExpired")}
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8C94A6] text-base mb-2 block">
                  If yes? Attach
                </label>
                <FileUpload<EstablishmentFormValues>
                  name="developmentPlanBudgetDocument"
                  control={control}
                  label="Upload your document"
                  helperText="PDF format • Max. 5MB"
                  accept="application/pdf"
                  maxSize={5 * 1024 * 1024} // 5MB
                  buttonText="Upload"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between ">
              <h2 className="mb-6 font-semibold text-xl text-black capitalize">
                Total funds received by trust
              </h2>

              <div>
                <Controller
                  control={control}
                  name="yearOfFundsReceivedByTrust"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomSelect
                      id="yearOfFundsReceivedByTrust"
                      {...field}
                      isLoading={isLoading}
                      label="Select Year"
                      options={year}
                      isMulti={false}
                      placeholder="2021"
                    />
                  )}
                />
              </div>

              {/* Total Funds */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Total funds</h3>
                <div className="flex">
                  <div className="w-1/4 mr-2">
                    <Controller
                      name="totalFunds.currency"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          id="total-funds-currency"
                          label=""
                          options={currencyOptions}
                          onChange={(selected) =>
                            field.onChange(selected ? selected.value : "USD")
                          }
                          defaultValue={currencyOptions[0]}
                        />
                      )}
                    />
                  </div>
                  <div className="w-3/4">
                    <FormInput
                      label=""
                      name="totalFunds.amount"
                      register={register}
                      registerOptions={{
                        required: "Amount is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Please enter a valid amount",
                        },
                      }}
                      error={errors.totalFunds?.amount}
                      placeholder="Total funds"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Capital Expenditure */}
              <div className="my-6">
                <h3 className="text-lg font-medium mb-4">
                  Capital expenditure
                </h3>
                <div className="flex">
                  <div className="w-1/4 mr-2">
                    <Controller
                      name="capitalExpenditure.currency"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          id="capital-expenditure-currency"
                          label=""
                          options={currencyOptions}
                          onChange={(selected) =>
                            field.onChange(selected ? selected.value : "USD")
                          }
                          defaultValue={currencyOptions[0]}
                        />
                      )}
                    />
                  </div>
                  <div className="w-3/4">
                    <FormInput
                      label=""
                      name="capitalExpenditure.amount"
                      register={register}
                      registerOptions={{
                        required: "Amount is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Please enter a valid amount",
                        },
                      }}
                      error={errors.capitalExpenditure?.amount}
                      placeholder="Capital expenditure"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Reserve */}
              <div className="my-6">
                <h3 className="text-lg font-medium mb-4">Reserve</h3>
                <div className="flex">
                  <div className="w-1/4 mr-2">
                    <Controller
                      name="reserve.currency"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          id="reserve-currency"
                          label=""
                          options={currencyOptions}
                          onChange={(selected) =>
                            field.onChange(selected ? selected.value : "USD")
                          }
                          defaultValue={currencyOptions[0]}
                        />
                      )}
                    />
                  </div>
                  <div className="w-3/4">
                    <FormInput
                      label=""
                      name="reserve.amount"
                      register={register}
                      registerOptions={{
                        required: "Amount is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Please enter a valid amount",
                        },
                      }}
                      error={errors.reserve?.amount}
                      placeholder="Reserve"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Controller
                control={control}
                name="admin"
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomSelect
                    id="admin"
                    {...field}
                    isLoading={isLoading}
                    label="Admin"
                    options={admins}
                    isMulti={false}
                    placeholder="Select admin"
                  />
                )}
              />
            </div>
          </section>
        </div>

        <div className="bg-white p-6">b</div>
      </form>
    </div>
  );
};

export default UpdateTrustEstablishment;
