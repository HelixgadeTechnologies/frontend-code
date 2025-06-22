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
import { OpexFieldsArray } from "./OpexFieldsArray";
import { IFundsReceived, IOperationalExpenditure, ITrustEstablishmentPayload } from "../../types/interface";
import { trustStore as TrustStore } from "../../../trust/store/trustStore"
import { convertFileToBase64 } from "../../../../utils/helpers";
import { FundsReceived } from "./FundsReceived";
const TrustStoreCTx = createContext(TrustStore);
const trustEstablishmentStoreCTx = createContext(TrustEstablishmentStore);
const SettingStoreCTx = createContext(SettingStore);

const EditTrustEstablishmentForm = observer(() => {
  const trustEstablishmentStore = useContext(trustEstablishmentStoreCTx);
  const settingStore = useContext(SettingStoreCTx);
  const trustStore = useContext(TrustStoreCTx);
  const { name } = useParams();
  // const navigate = useNavigate();

  const { control, handleSubmit, reset, register, formState: { errors }, } = useForm();
  // Populate form on mount for edit
  useEffect(() => {
    // Fetch or use already loaded data from store
    const data = trustEstablishmentStore.trustEstablishmentStatus; // adjust this to your actual store property
    let adminInfo = settingStore.allAdmin.get(data?.admin as string);
    if (data) {
      reset({
        trustRegisteredWithCAC: String(data.trustRegisteredWithCAC),
        cscDocument: undefined, // File inputs can't be pre-filled
        yearIncorporated: { value: data.yearIncorporated, label: String(data.yearIncorporated) },
        botConstitutedAndInaugurated: String(data.botConstitutedAndInaugurated),
        managementCommitteeConstitutedAndInaugurated: String(data.managementCommitteeConstitutedAndInaugurated),
        advisoryCommitteeConstitutedAndInaugurated: String(data.advisoryCommitteeConstitutedAndInaugurated),
        isTrustDevelopmentPlanReadilyAvailable: String(data.isTrustDevelopmentPlanReadilyAvailable),
        isTrustDevelopmentPlanBudgetReadilyAvailable: String(data.isTrustDevelopmentPlanBudgetReadilyAvailable),
        yearDeveloped: data.yearDeveloped,
        yearExpired: data.yearExpired,
        developmentPlanDocument: undefined,
        totalFunds: Array.isArray(data.fundsReceive)
          ? data.fundsReceive.sort((a: IFundsReceived, b: IFundsReceived) => a.yearReceived! - b.yearReceived!).map((fn: IFundsReceived) => ({
            year: { value: fn.yearReceived, label: String(fn.yearReceived) },
            capitalExpenditure: fn.capitalExpenditureReceived,
            reserved: fn.reserveReceived,
            paymentCheck: String(fn.paymentCheck)
          }))
          : [],
        admin: { value: data.admin, label: `${adminInfo?.firstName} ${adminInfo?.lastName}` }, // adjust as needed
        yearOfNeedsAssessment: { value: data.yearOfNeedsAssessment, label: String(data.yearOfNeedsAssessment) },
        statusOfNeedsAssessment: String(data.statusOfNeedAssessment),
        communityWomenConsulted: String(data.communityWomenConsulted),
        pwDsConsulted: String(data.pwDsConsulted),
        communityYouthsConsulted: String(data.communityYouthsConsulted),
        communityLeadershipConsulted: String(data.communityLeadershipConsulted),
        attendanceSheet: String(data.attendanceSheet),
        distributionMatrixDevelopedBySettlor: data.distributionMatrixDevelopedBySettlor ? "1" : "0",
        trustDistributionMatrixDocument: undefined,
        opex: Array.isArray(data.settlorOperationalExpenditures)
          ? data.settlorOperationalExpenditures.sort((a: IOperationalExpenditure, b: IOperationalExpenditure) => a.settlorOperationalExpenditureYear! - b.settlorOperationalExpenditureYear!).map((op: IOperationalExpenditure) => ({
            year: { value: op.settlorOperationalExpenditureYear, label: String(op.settlorOperationalExpenditureYear) },
            amount: op.settlorOperationalExpenditure,
          }))
          : [],
        isTrustDevPlanBudgetAvailable: String(data.isTrustDevelopmentPlanBudgetReadilyAvailable),
        developmentPlanBudgetDocument: undefined,
      });
    }
  }, [trustEstablishmentStore, reset]);
  const onSubmit = async (data: any) => {
    try {
      // console.log("Form Data:", data);
      trustEstablishmentStore.isSubmitting = true;
      let opex: Array<IOperationalExpenditure> = [];

      if (data.opex && data.opex.length > 0) {
        // Map through the opex array and create IOperationalExpenditure objects  
        data.opex.forEach((op: any) => {
          opex.push({
            OperationalExpenditureId: "",
            settlorOperationalExpenditureYear: Number(op.year.value),
            settlorOperationalExpenditure: Number(op.amount),
            trustEstablishmentStatusId: trustEstablishmentStore.trustEstablishmentStatus?.trustEstablishmentStatusId || "",
          } as IOperationalExpenditure);
        });
      }


      let totalFunds: Array<IFundsReceived> = [];

      if (data.totalFunds && data.totalFunds.length > 0) {
        // Map through the totalFunds array and create IFundsReceived objects  
        data.totalFunds.forEach((fn: any) => {
          totalFunds.push({
            yearReceived: Number(fn.year.value),
            reserveReceived: Number(fn.reserved),
            capitalExpenditureReceived: Number(fn.capitalExpenditure),
            paymentCheck: Number(fn.paymentCheck),
            totalFundsReceived: (Number(fn.reserved) + Number(fn.capitalExpenditure)),
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
        trustEstablishmentStatusId: "hello",
        trustId: trustStore.selectedTrustId as string,
        admin: data.admin.value as string,
        advisoryCommitteeConstitutedAndInaugurated: Number(data.advisoryCommitteeConstitutedAndInaugurated),
        attendanceSheet: Number(data.attendanceSheet),
        botConstitutedAndInaugurated: Number(data.botConstitutedAndInaugurated),
        fundsReceive: totalFunds,
        communityLeadershipConsulted: Number(data.communityLeadershipConsulted),
        communityWomenConsulted: Number(data.communityWomenConsulted),
        communityYouthsConsulted: Number(data.communityYouthsConsulted),
        distributionMatrixDevelopedBySettlor: data.distributionMatrixDevelopedBySettlor == "0" ? false : true,
        isTrustDevelopmentPlanBudgetReadilyAvailable: Number(data.isTrustDevelopmentPlanBudgetReadilyAvailable),
        isTrustDevelopmentPlanReadilyAvailable: Number(data.isTrustDevelopmentPlanReadilyAvailable),
        managementCommitteeConstitutedAndInaugurated: Number(data.managementCommitteeConstitutedAndInaugurated),
        pwDsConsulted: Number(data.pwDsConsulted),

        statusOfNeedAssessment: Number(data.statusOfNeedsAssessment),
        trustRegisteredWithCAC: Number(data.trustRegisteredWithCAC),
        yearDeveloped: Number(data.yearDeveloped),
        yearExpired: Number(data.yearExpired),
        yearIncorporated: Number(data.yearIncorporated.value),
        yearOfNeedsAssessment: Number(data.yearOfNeedsAssessment.value),
        settlorOperationalExpenditures: opex,
        cscDocument: uploadResCscDocument.success ? uploadResCscDocument.data : trustEstablishmentStore.trustEstablishmentStatus?.cscDocument,
        cscDocumentMimeType: cscDocument == undefined ? trustEstablishmentStore.trustEstablishmentStatus?.cscDocumentMimeType! : cscDocument.mimeType,
        developmentPlanBudgetDocument: uploadResDevelopmentPlanBudgetDocument.success ? uploadResDevelopmentPlanBudgetDocument.data : trustEstablishmentStore.trustEstablishmentStatus?.developmentPlanBudgetDocument,
        developmentPlanBudgetDocumentMimeType: developmentPlanBudgetDocument == undefined ? trustEstablishmentStore.trustEstablishmentStatus?.developmentPlanBudgetDocumentMimeType! : developmentPlanBudgetDocument.mimeType,
        developmentPlanDocument: uploadResDevelopmentPlanDocument.success ? uploadResDevelopmentPlanDocument.data : trustEstablishmentStore.trustEstablishmentStatus?.developmentPlanDocument,
        developmentPlanDocumentMimeType: developmentPlanDocument == undefined ? trustEstablishmentStore.trustEstablishmentStatus?.developmentPlanDocumentMimeType! : developmentPlanDocument.mimeType,
        trustDistributionMatrixDocument: uploadResTrustDistributionMatrixDocument.success ? uploadResTrustDistributionMatrixDocument.data : trustEstablishmentStore.trustEstablishmentStatus?.trustDistributionMatrixDocument,
        trustDistributionMatrixDocumentMimeType: trustDistributionMatrixDocument == undefined ? trustEstablishmentStore.trustEstablishmentStatus?.trustDistributionMatrixDocumentMimeType! : trustDistributionMatrixDocument.mimeType,
      };
      const completion = trustEstablishmentStore.calculateTrustEstablishmentCompletion(establishmentData);
      establishmentData.completionStatus = completion;

      const response = await trustEstablishmentStore.createTrustEstablishment(establishmentData)
      if (response) {
        toast.success("Trust Establishment Successfully Updated");
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
    <div className="py-4 px-7">
      <GoBack action={setSwitch} page="Trust Establishment" trustName={name || ""} />

      <div className="my-7 flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-black capitalize">
          Trust Establishment and Governance <br /> Structure
        </h2>
        <button className="px-3 py-2 rounded-md border border-black text-black font-medium text-sm" onClick={setSwitch}>
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
                rules={{ required: "Please select a status" }}
                label="Trust registered with CAC"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              {errors.trustRegisteredWithCAC && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.trustRegisteredWithCAC?.message!)}</p>
              )}
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
                {errors.cscDocument && (
                  <p className="text-red-500 text-xs mt-1">Please select a file</p>
                )}
                {trustEstablishmentStore.trustEstablishmentStatus?.cscDocument && (
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="text-green-600 font-bold">✔</span>
                    <a
                      href={trustEstablishmentStore.trustEstablishmentStatus.cscDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 text-gray-700 text-sm hover:underline"
                    >
                      Click here to preview the already uploaded file
                    </a>
                  </div>
                )}
              </div>
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
              {errors.yearIncorporated && (
                <p className="text-red-500 text-xs mt-1">Please select year</p>
              )}
            </div>

            <div className="mt-6 space-y-8">
              <CustomRadio
                name="botConstitutedAndInaugurated"
                control={control}
                rules={{ required: "Please select a status" }}
                label="BoT constituted and Inaugurated"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              {errors.botConstitutedAndInaugurated && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.botConstitutedAndInaugurated?.message!)}</p>
              )}
              <CustomRadio
                name="managementCommitteeConstitutedAndInaugurated"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Management committee Constituted and Inaugurated"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              {errors.managementCommitteeConstitutedAndInaugurated && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.managementCommitteeConstitutedAndInaugurated?.message!)}</p>
              )}
              <CustomRadio
                name="advisoryCommitteeConstitutedAndInaugurated"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Advisory committee has been constituted and inaugurated"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              {errors.advisoryCommitteeConstitutedAndInaugurated && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.advisoryCommitteeConstitutedAndInaugurated?.message!)}</p>
              )}
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
                rules={{ required: "Please select a status" }}
                label="Is the trust development plan readily available?"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              {errors.isTrustDevelopmentPlanReadilyAvailable && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.isTrustDevelopmentPlanReadilyAvailable?.message!)}</p>
              )}
              <CustomRadio
                name="isTrustDevelopmentPlanBudgetReadilyAvailable"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Is the trust development plan budget readily available?"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                ]}
              />
              {errors.isTrustDevelopmentPlanBudgetReadilyAvailable && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.isTrustDevelopmentPlanBudgetReadilyAvailable?.message!)}</p>
              )}
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
                    registerOptions={{
                      required: "Field is required",
                    }}
                    className="mt-4 w-full border py-3 text-center  border-[#525866] focus:border-primary-100 rounded-md"
                    error={errors.yearDeveloped}
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
                    registerOptions={{
                      required: "Field is required",
                    }}
                    className="mt-4 w-full border py-3 text-center  border-[#525866] focus:border-primary-100 rounded-md"
                    error={errors.yearExpired}
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
                {errors.developmentPlanDocument && (
                  <p className="text-red-500 text-xs mt-1">select a file</p>
                )}
                {trustEstablishmentStore.trustEstablishmentStatus?.developmentPlanDocument && (
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="text-green-600 font-bold">✔</span>
                    <a
                      href={trustEstablishmentStore.trustEstablishmentStatus.developmentPlanDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 text-gray-700 text-sm hover:underline"
                    >
                      Click here to preview the already uploaded file
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-black mb-1 mt-8">
              Total funds received by trust
            </h2>
            <FundsReceived control={control} register={register} />

            {/* Admin */}
            <div>
              <Controller
                control={control}
                name="admin"
                rules={{ required: true }}
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
              {errors.admin && (
                <p className="text-red-500 text-xs mt-1">Select an admin</p>
              )}
            </div>
          </section>
        </div>

        <div className="bg-white p-3">
          <div className="bg-white p-6 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-3 mb-6">
              <div>
                <h2 className="font-semibold text-xl text-gray-800">Status of Needs Assessment</h2>
                <p className="text-sm text-gray-500 mt-1">
                  These are your personal details, they are visible to the public
                </p>
              </div>
              <div className="w-40">
                <Controller
                  control={control}
                  name="yearOfNeedsAssessment"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomSelect
                      label=""
                      id="needs-assessment-year"
                      {...field}
                      options={year}
                      isMulti={false}
                      placeholder="Select Year"
                    />
                  )}
                />
                {errors.yearOfNeedsAssessment && (
                  <p className="text-red-500 text-xs mt-1">Pleas select year</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Status of needs assessment */}
              <CustomRadio
                name="statusOfNeedsAssessment"
                control={control}
                label="Status of needs assessment"
                rules={{ required: "Please select a status" }}
                options={[
                  { value: "1", label: "Complete" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "yet to be conducted" },
                ]}
              />
              {errors.statusOfNeedsAssessment && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.statusOfNeedsAssessment?.message!)}</p>
              )}

              {/* Were the community women consulted? */}
              <CustomRadio
                name="communityWomenConsulted"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Were the community women consulted?"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                  { value: "4", label: "Not in all communities" },
                ]}
              />
              {errors.communityWomenConsulted && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.communityWomenConsulted?.message!)}</p>
              )}
              {/* Were the PwDs consulted? */}
              <CustomRadio
                name="pwDsConsulted"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Were the PwDs consulted?"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                  { value: "4", label: "Not in all communities" },
                ]}
              />
              {errors.pwDsConsulted && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.pwDsConsulted?.message!)}</p>
              )}
              {/* Were community Youths consulted? */}
              <CustomRadio
                name="communityYouthsConsulted"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Were community Youths consulted?"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                  { value: "4", label: "Not in all communities" },
                ]}
              />
              {errors.communityYouthsConsulted && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.communityYouthsConsulted?.message!)}</p>
              )}
              {/* Were community leadership consulted? */}
              <CustomRadio
                name="communityLeadershipConsulted"
                control={control}
                rules={{ required: "Please select a status" }}
                label="Were community leadership consulted?"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "2", label: "In progress" },
                  { value: "3", label: "No" },
                  { value: "4", label: "Not in all communities" },
                ]}
              />
              {errors.communityLeadershipConsulted && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.communityLeadershipConsulted?.message!)}</p>
              )}
              {/* Attach attendance sheet (optional) */}
              <CustomRadio
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
              )}
            </div>
          </div>
          {/* NEXT */}
          <div className="bg-white p-6 rounded-lg mt-8">
            {/* Trust has a distribution matrix */}
            <h2 className="font-semibold text-xl text-black mb-2">
              Trust has a distribution matrix developed by settlor
            </h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="flex items-center gap-8 mb-4">
              <CustomRadio
                name="distributionMatrixDevelopedBySettlor"
                control={control}
                rules={{ required: "Please select a status" }}
                options={[
                  { value: "1", label: "Yes" },
                  { value: "0", label: "No" },
                ]}
              />
              {errors.distributionMatrixDevelopedBySettlor && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.distributionMatrixDevelopedBySettlor?.message!)}</p>
              )}
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
              {errors.trustDistributionMatrixDocument && (
                <p className="text-red-500 text-xs mt-1">{String(errors?.trustDistributionMatrixDocument?.message!)}</p>
              )}
              {trustEstablishmentStore.trustEstablishmentStatus?.trustDistributionMatrixDocument && (
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="text-green-600 font-bold">✔</span>
                  <a
                    href={trustEstablishmentStore.trustEstablishmentStatus.trustDistributionMatrixDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 text-gray-700 text-sm hover:underline"
                  >
                    Click here to preview the already uploaded file
                  </a>
                </div>
              )}
            </div>

            {/* Settlor Operational Expenditure (OPEX) */}
            <h2 className="font-semibold text-xl text-black mb-1 mt-8">
              Settlor Operational Expenditure (OPEX)
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              This will be annually starting from 2021
            </p>
            <OpexFieldsArray control={control} register={register} />
            {/* Is the trust development plan budget readily available? */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is the trust development plan budget readily available?
              </label>
              <div className="flex items-center gap-8 mb-4">
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
                {errors.developmentPlanBudgetDocument && (
                  <p className="text-red-500 text-xs mt-1">{String(errors?.developmentPlanBudgetDocument?.message!)}</p>
                )}
                {trustEstablishmentStore.trustEstablishmentStatus?.developmentPlanBudgetDocument && (
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="text-green-600 font-bold">✔</span>
                    <a
                      href={trustEstablishmentStore.trustEstablishmentStatus.developmentPlanBudgetDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 text-gray-700 text-sm hover:underline"
                    >
                      Click here to preview the already uploaded file
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">

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

export default EditTrustEstablishmentForm;
