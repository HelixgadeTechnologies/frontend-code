import { createContext, useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  GoBack,
  CustomRadio,
  FileUpload,
  CustomSelect,
  FormInput,
  Button,
} from "../../../../components/elements";
import { useForm, Controller } from "react-hook-form";
import { year } from "../../../../utils/data";
import { trustEstablishmentStore as TrustEstablishmentStore } from "../../store/trustEstablishmentStore";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { settingStore as SettingStore } from "../../../Settings/store/settingStore"
import { IAdmin } from "../../../Settings/types/interface";
// import { OpexFieldsArray } from "./OpexFieldsArray";
import { IFundsReceived, IOperationalExpenditure, ITrustEstablishmentPayload } from "../../types/interface";
import { trustStore as TrustStore } from "../../../trust/store/trustStore"
import { convertFileToBase64 } from "../../../../utils/helpers";
import { FundsReceived } from "./FundsReceived";
const TrustStoreCTx = createContext(TrustStore);
const trustEstablishmentStoreCTx = createContext(TrustEstablishmentStore);
const SettingStoreCTx = createContext(SettingStore);

const TrustEstablishmentForm = observer(() => {
  const trustEstablishmentStore = useContext(trustEstablishmentStoreCTx);
  const settingStore = useContext(SettingStoreCTx);
  const trustStore = useContext(TrustStoreCTx);
  const { name } = useParams();
  // const navigate = useNavigate();

  const { control, handleSubmit, reset, register, watch, setValue } = useForm();
  const watchedTrustRegisteredWithCAC = watch("trustRegisteredWithCAC");
  const watchedIsTrustDevelopmentPlanReadilyAvailable = watch("isTrustDevelopmentPlanReadilyAvailable");
  const watchedStatusOfNeedsAssessment = watch("statusOfNeedsAssessment");
  const watchedIsTrustDevelopmentPlanBudgetReadilyAvailable = watch("isTrustDevelopmentPlanBudgetReadilyAvailable");

  // clear dependent year fields when parent is not 'Yes' (value '1')
  useEffect(() => {
    if (Number(watchedStatusOfNeedsAssessment) !== 1) {
      try {
        // clear selected year when needs assessment isn't completed
        setValue('yearOfNeedsAssessment', { label: '', value: '' });
        // set sensible defaults for hidden consultation radios so they don't block submit
        setValue('communityWomenConsulted', { label: '', value: '' });
        setValue('pwDsConsulted', { label: '', value: '' });
        setValue('communityYouthsConsulted', { label: '', value: '' });
        setValue('communityLeadershipConsulted', { label: '', value: '' });
      } catch (e) { }
    }
  }, [watchedStatusOfNeedsAssessment, setValue]);

  useEffect(() => {
    if (Number(watchedTrustRegisteredWithCAC) !== 1) {
      try {
        (setValue as any)('yearIncorporated', { label: '', value: '' });
      } catch (e) { }
    }
  }, [watchedTrustRegisteredWithCAC]);

  useEffect(() => {
    if (Number(watchedIsTrustDevelopmentPlanReadilyAvailable) !== 1) {
      try {
        setValue('yearDeveloped', '');
        setValue('yearExpired', '');
      } catch (e) { }
    }
  }, [watchedIsTrustDevelopmentPlanReadilyAvailable]);
  const onSubmit = async (data: any) => {
    try {
      trustEstablishmentStore.isSubmitting = true;
      let opex: Array<IOperationalExpenditure> = [];

      if (data.opex && data.opex.length > 0) {
        data.opex.forEach((op: any) => {
          opex.push({
            OperationalExpenditureId: "",
            settlorOperationalExpenditureYear: Number(op.year?.value || 0),
            settlorOperationalExpenditure: Number(op.amount || 0),
            trustEstablishmentStatusId: ""
          } as IOperationalExpenditure);
        });
      }

      let totalFunds: Array<IFundsReceived> = [];

      if (data.totalFunds && data.totalFunds.length > 0) {
        data.totalFunds.forEach((fn: any) => {
          totalFunds.push({
            yearReceived: Number(fn.year?.value || 0),
            reserveReceived: Number(fn.reserved || 0),
            capitalExpenditureReceived: Number(fn.capitalExpenditure || 0),
            paymentCheck: Number(fn.paymentCheck || 0),
            totalFundsReceived: (Number(fn.reserved || 0) + Number(fn.capitalExpenditure || 0)),
            trustEstablishmentStatusId: ""
          } as IFundsReceived);
        });
      }

      let cscDocument = data.cscDocument == undefined ? undefined : await convertFileToBase64(data.cscDocument)
      const uploadResCscDocument = cscDocument == undefined ? { success: false, message: "", data: "" } : await trustEstablishmentStore.uploadFile(cscDocument)

      let developmentPlanBudgetDocument = data.developmentPlanBudgetDocument == undefined ? undefined : await convertFileToBase64(data.developmentPlanBudgetDocument)
      const uploadResDevelopmentPlanBudgetDocument = developmentPlanBudgetDocument == undefined ? { success: false, message: "", data: "" } : await trustEstablishmentStore.uploadFile(developmentPlanBudgetDocument)

      let developmentPlanDocument = data.developmentPlanDocument == undefined ? undefined : await convertFileToBase64(data.developmentPlanDocument)
      const uploadResDevelopmentPlanDocument = developmentPlanDocument == undefined ? { success: false, message: "", data: "" } : await trustEstablishmentStore.uploadFile(developmentPlanDocument)

      let trustDistributionMatrixDocument = data.trustDistributionMatrixDocument == undefined ? undefined : await convertFileToBase64(data.trustDistributionMatrixDocument)
      const uploadResTrustDistributionMatrixDocument = trustDistributionMatrixDocument == undefined ? { success: false, message: "", data: "" } : await trustEstablishmentStore.uploadFile(trustDistributionMatrixDocument)

      const establishmentData: ITrustEstablishmentPayload = {
        trustEstablishmentStatusId: "",
        trustId: trustStore.selectedTrustId as string,
        admin: data.admin?.value as string || "",
        advisoryCommitteeConstitutedAndInaugurated: Number(data.advisoryCommitteeConstitutedAndInaugurated || 0),
        botConstitutedAndInaugurated: Number(data.botConstitutedAndInaugurated || 0),
        communityLeadershipConsulted: Number(data.statusOfNeedsAssessment) === 1 ? Number(data.communityLeadershipConsulted || 0) : null,
        communityWomenConsulted: Number(data.statusOfNeedsAssessment) === 1 ? Number(data.communityWomenConsulted || 0) : null,
        communityYouthsConsulted: Number(data.statusOfNeedsAssessment) === 1 ? Number(data.communityYouthsConsulted || 0) : null,
        distributionMatrixDevelopedBySettlor: Number(data.distributionMatrixDevelopedBySettlor || 0),
        isTrustDevelopmentPlanBudgetReadilyAvailable: Number(data.isTrustDevelopmentPlanBudgetReadilyAvailable || 0),
        isTrustDevelopmentPlanReadilyAvailable: Number(data.isTrustDevelopmentPlanReadilyAvailable || 0),
        managementCommitteeConstitutedAndInaugurated: Number(data.managementCommitteeConstitutedAndInaugurated || 0),
        pwDsConsulted: Number(data.statusOfNeedsAssessment) === 1 ? Number(data.pwDsConsulted || 0) : null,
        statusOfNeedAssessment: Number(data.statusOfNeedsAssessment || 0),
        fundsReceive: totalFunds,
        trustRegisteredWithCAC: Number(data.trustRegisteredWithCAC || 0),
        yearDeveloped: Number(data.isTrustDevelopmentPlanReadilyAvailable) == 1 ? Number(data.yearDeveloped || 0) : null,
        yearExpired: Number(data.isTrustDevelopmentPlanReadilyAvailable) == 1 ? Number(data.yearExpired || 0) : null,
        yearIncorporated: Number(data.trustRegisteredWithCAC) == 1 ? Number(data.yearIncorporated?.value || 0) : null,
        yearOfNeedsAssessment: Number(data.statusOfNeedsAssessment) === 1 ? Number(data.yearOfNeedsAssessment?.value || 0) : null,
        settlorOperationalExpenditures: opex,
        cscDocument: uploadResCscDocument.success ? uploadResCscDocument.data : "",
        cscDocumentMimeType: cscDocument == undefined ? "" : cscDocument.mimeType,
        developmentPlanBudgetDocument: uploadResDevelopmentPlanBudgetDocument.success ? uploadResDevelopmentPlanBudgetDocument.data : "",
        developmentPlanBudgetDocumentMimeType: developmentPlanBudgetDocument == undefined ? "" : developmentPlanBudgetDocument.mimeType,
        developmentPlanDocument: uploadResDevelopmentPlanDocument.success ? uploadResDevelopmentPlanDocument.data : "",
        developmentPlanDocumentMimeType: developmentPlanDocument == undefined ? "" : developmentPlanDocument.mimeType,
        trustDistributionMatrixDocument: uploadResTrustDistributionMatrixDocument.success ? uploadResTrustDistributionMatrixDocument.data : "",
        trustDistributionMatrixDocumentMimeType: trustDistributionMatrixDocument == undefined ? "" : trustDistributionMatrixDocument.mimeType
      };

      const completion = trustEstablishmentStore.calculateTrustEstablishmentCompletion(establishmentData);
      establishmentData.completionStatus = completion;

      const response = await trustEstablishmentStore.createTrustEstablishment(establishmentData)
      if (response) {
        toast.success("Trust Establishment Successfully Submitted");
        reset({})
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
  const setSwitch = useCallback(() => {
    trustEstablishmentStore.pageSwitch = 1;
  }, [trustEstablishmentStore]);
  return (
    <div className="py-4 px-4 sm:px-7">
      <GoBack action={setSwitch} page="Trust Establishment" trustName={name || ""} />

      <div className="my-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-semibold text-xl sm:text-2xl text-black capitalize">
          Trust Establishment and Governance Structure Dashboard
        </h1>


        <button className="w-fit px-3 py-2 rounded-md border border-black text-black font-medium text-sm" onClick={setSwitch}>
          Back to Dashboard
        </button>

      </div>

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white p-6">
          <section>
            <h2 className="font-semibold text-xl text-black capitalize">
              Trust Establishment Status{" "}
            </h2>
            <p className="text-base text-[#8C94A6]">
              These are your personal details, they are visible to the public{" "}
            </p>

            <div className="mt-6 space-y-8">
              <CustomRadio
                name="trustRegisteredWithCAC"
                control={control}
                label="Trust registered with CAC"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              <div>
                <label className="text-[#8C94A6] text-base mb-2 block">
                  CAC document upload is optional.
                </label>
                <FileUpload
                  name="cscDocument"
                  control={control}
                  label="Upload your document"
                  helperText="PDF format • Max. 5MB"
                  // accept="application/pdf"
                  maxSize={5 * 1024 * 1024} // 5MB
                  buttonText="Upload"
                />
              </div>
            </div>
          </section>

          <section className="my-8">
            {Number(watchedTrustRegisteredWithCAC) === 1 && (
              <>
                <h2 className="font-semibold text-xl text-black capitalize">
                  Year incorporated
                </h2>
                <div>
                  <Controller
                    control={control}
                    name="yearIncorporated"
                    // rules={{ required: true }}
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
              </>
            )}

            <div className="mt-6 space-y-8">
              <CustomRadio
                name="botConstitutedAndInaugurated"
                control={control}
                label="BoT constituted and Inaugurated"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              <CustomRadio
                name="managementCommitteeConstitutedAndInaugurated"
                control={control}
                label="Management committee Constituted and Inaugrated"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              <CustomRadio
                name="advisoryCommitteeConstitutedAndInaugurated"
                control={control}
                label="Advisory committee has been constituted and inaugurated"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
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
              <CustomRadio
                name="isTrustDevelopmentPlanReadilyAvailable"
                control={control}
                label="Is the trust development plan readily available?"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />


              {Number(watchedIsTrustDevelopmentPlanReadilyAvailable) === 1 && (
                <>
                  <div className="lg:flex gap-x-4 justify-between">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Year Developed
                      </label>
                      <FormInput
                        label=""
                        name="yearDeveloped"
                        type="text"
                        placeholder="2021"
                        register={register}
                        // registerOptions={{
                        //   required: "Field is required",
                        // }}
                        className="mt-4 w-full border py-3 text-center  border-[#525866] focus:border-primary-100 rounded-md"
                      // error={errors.yearDeveloped}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Year Expired
                      </label>
                      <FormInput
                        label=""
                        name="yearExpired"
                        type="text"
                        placeholder="2021"
                        register={register}
                        // registerOptions={{
                        //   required: "Field is required",
                        // }}
                        className="mt-4 w-full border py-3 text-center  border-[#525866] focus:border-primary-100 rounded-md"
                      // error={errors.yearExpired}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#8C94A6] text-base mb-2 block">
                      If yes? Attach
                    </label>
                    <FileUpload
                      name="developmentPlanDocument"
                      control={control}
                      label="Upload your document"
                      helperText="PDF format • Max. 5MB"
                      accept="application/pdf"
                      maxSize={5 * 1024 * 1024} // 5MB
                      buttonText="Upload"
                    />
                  </div>
                </>
              )}


              <CustomRadio
                name="isTrustDevelopmentPlanBudgetReadilyAvailable"
                control={control}
                label="Is the trust development plan budget readily available?"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              {watchedIsTrustDevelopmentPlanBudgetReadilyAvailable === "1" && (
                <div>
                  <FileUpload
                    name="developmentPlanBudgetDocument"
                    control={control}
                    label="Upload your document"
                    helperText="PDF format • Max. 5MB"
                    accept="application/pdf"
                    maxSize={5 * 1024 * 1024} // 5MB
                    buttonText="Upload"
                  />
                </div>

              )}

            </div>
          </section>

          <section>
            {/* Total funds received by trust */}

            <h2 className="font-semibold text-xl text-black mb-1 mt-8">
              Total funds received by trust
            </h2>

            <FundsReceived control={control} register={register} />

            {/* Admin */}
            <div>
              <Controller
                control={control}
                name="admin"
                render={({ field }) => (
                  <CustomSelect
                    id="admin"
                    {...field}
                    isLoading={settingStore.isLoading}
                    label="Admin"
                    options={[...settingStore.allAdmin.values()].map((admin: IAdmin) => ({
                      value: admin.userId,
                      label: `${admin.firstName} ${admin.lastName}`,
                    }))}
                    isMulti={false}
                    placeholder="Select admin"
                  />
                )}
              />
            </div>
          </section>
        </div>

        <div className="bg-white p-3">
          <div className="bg-white p-6 rounded-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-100 rounded-md px-4 py-3 mb-6 gap-4">
              <div>
                <h2 className="font-semibold text-lg sm:text-xl text-gray-800">Status of Needs Assessment</h2>
                <p className="text-sm text-gray-500 mt-1">
                  These are your personal details, they are visible to the public
                </p>
              </div>
              <div className="w-full sm:w-40">

              </div>
            </div>

            <div className="space-y-6">
              {/* Status of needs assessment */}
              <CustomRadio
                name="statusOfNeedsAssessment"
                control={control}
                label="Status of needs assessment"
                options={[
                  { value: "1", label: "Completed" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "yet to be conducted" },
                ]}

              />
              {Number(watchedStatusOfNeedsAssessment) === 1 && (
                <>
                  {/* <h3 className="font-semibold text-xl text-black capitalize">
                    Year Of Needs Assessment
                  </h3> */}
                  <Controller
                    control={control}
                    name="yearOfNeedsAssessment"
                    // rules={{ required: true }}
                    render={({ field }) => (
                      <CustomSelect
                        label="Year Conducted"
                        id="needs-assessment-year"
                        {...field}
                        options={year}
                        isMulti={false}
                        placeholder="Select Year"
                      />
                    )}
                  />

                  {/* Were the community women consulted? */}
                  <CustomRadio
                    name="communityWomenConsulted"
                    control={control}
                    label="Were the community women consulted?"
                    options={[
                      { value: "1", label: "Yes, jointly consulted" },
                      { value: "2", label: "yes, separately consulted" },
                      { value: "3", label: "No" },
                      { value: "4", label: "Not in all communities" },
                    ]}
                  />
                  {/* Were the PwDs consulted? */}
                  <CustomRadio
                    name="pwDsConsulted"
                    control={control}
                    label="Were the PwDs consulted?"
                    options={[
                      { value: "1", label: "Yes, jointly consulted" },
                      { value: "2", label: "yes, separately consulted" },
                      { value: "3", label: "No" },
                      { value: "4", label: "Not in all communities" },
                    ]}
                  />
                  {/* Were community Youths consulted? */}
                  <CustomRadio
                    name="communityYouthsConsulted"
                    control={control}
                    label="Were community Youths consulted?"
                    options={[
                      { value: "1", label: "Yes, jointly consulted" },
                      { value: "2", label: "yes, separately consulted" },
                      { value: "3", label: "No" },
                      { value: "4", label: "Not in all communities" },
                    ]}
                  />
                  {/* Were community leadership consulted? */}
                  <CustomRadio
                    name="communityLeadershipConsulted"
                    control={control}
                    label="Were community leadership consulted?"
                    options={[
                      { value: "1", label: "Yes, jointly consulted" },
                      { value: "2", label: "yes, separately consulted" },
                      { value: "3", label: "No" },
                      { value: "4", label: "Not in all communities" },
                    ]}
                  />

                </>
              )}

              {/* Attach attendance sheet (optional) */}
              {/* <CustomRadio
                name="attendanceSheet"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Attach attendance sheet (optional)"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                  { value: "4", label: "Not in all communities" },
                ]}
              />
              {errors.attendanceSheet && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.attendanceSheet?.message!)}</p>
              )} */}
            </div>
          </div>
          {/* NEXT */}
          <div className="bg-white p-6 rounded-lg mt-8">
            {/* Trust has a distribution matrix */}
            <h2 className="font-semibold text-xl text-black mb-2">
              Trust has a distribution matrix developed by settlor
            </h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="mb-4">
              <CustomRadio
                name="distributionMatrixDevelopedBySettlor"
                control={control}
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
            </div>
            {/* If yes? Attach */}
            <div>
              <label className="text-[#8C94A6] text-base mb-2 block">
                If yes? Attach
              </label>
              <FileUpload
                name="trustDistributionMatrixDocument"
                control={control}
                label="Upload your document"
                helperText="PDF format • Max. 5MB"
                accept="application/pdf"
                maxSize={5 * 1024 * 1024} // 5MB
                buttonText="Upload"
              />
            </div>

            {/* Settlor Operational Expenditure (OPEX) */}
            {/* <h2 className="font-semibold text-xl text-black mb-1 mt-8">
              Settlor Operational Expenditure (OPEX)
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              This will be annually starting from 2021
            </p>
            <OpexFieldsArray control={control} register={register} /> */}
            {/* Is the trust development plan budget readily available? */}
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is the trust development plan budget readily available?
              </label>
              <div className="mb-4">
                <CustomRadio
                  name="isTrustDevPlanBudgetAvailable"
                  control={control}
                  rules={{ required: "Please select a status" }}
                  options={[
                    { value: "1", label: "Yes" },
                    { value: "2", label: "No" },
                  ]}
                />
                {errors.isTrustDevPlanBudgetAvailable && (
                  <p className="text-red-500 text-xs mt-1">{String(errors?.isTrustDevPlanBudgetAvailable?.message!)}</p>
                )}
              </div>

            </div> */}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col items-center gap-8 justify-between">

              <Button
                onClick={reset}
                className="border text-black bg-white border-blue-7 rounded-lg py-2 px-4 lg:px-10"
                buttonText="Clear"
                width="w-fit"
              />
              <Button padding="py-3" buttonText={trustEstablishmentStore.isSubmitting ? "Submitting..." : "Save Changes"} />
              <button className="px-3 py-2 rounded-md border border-black text-black font-medium text-sm" onClick={setSwitch}>
                Back to Dashboard
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
});

export default TrustEstablishmentForm;
