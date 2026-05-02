import { observer } from "mobx-react-lite";
import EntryDashboardHeader from "../../components/layouts/EntryDashboardHeader";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import MultiSelect from "../../components/elements/MultiSelect";
import { ICauseOfConflict, IConflictPayload, IConflictPayloadData, IConflictStatus, ICourtLitigationStatus, IIssuesAddressBy, IPartiesInvolve } from "../conflict/types/interface";
import { useLocation, useParams } from "react-router-dom";
import { conflictStore as ConflictStore } from "../conflict/store/conflictStore";
import { trustStore as TrustStore } from "../trust/store/trustStore";
import IMG from "../../assets/icons/access2.svg"
import IMG2 from "../../assets/icons/notfound.svg"
import IMG3 from "../../assets/icons/thanks.svg"

const trustStoreCTX = createContext(TrustStore);
const conflictStoreCTX = createContext(ConflictStore);
const ConflictDataForm = observer(() => {
  const trustStore = useContext(trustStoreCTX);
  const conflictStore = useContext(conflictStoreCTX);
  const { register, handleSubmit, reset, watch, setValue, control } = useForm();
  const watchedIssueAddressBy = watch("issueAddressedBy");
  const { trustId } = useParams(); // if your route is /page/:id
  const [submitted, setSubmitted] = useState(false);
  const [trustName, setTrustName] = useState("");
  const location = useLocation();
  useEffect(() => {
    async function fetchData() {
      const queryParams = new URLSearchParams(location.search);
      const trustName = queryParams.get("trust_name");
      setTrustName(trustName || "");
      // console.log("Fetching data for trustId:", trustId);
      if (trustId) {
        await trustStore.getATrust(trustId as string);
        await conflictStore.getCauseOfConflict()
        await conflictStore.getConflictStatus()
        await conflictStore.getCourtLitigation()
        await conflictStore.getIssuesAddressedBy()
        await conflictStore.getPartiesInvolve()
      }
    }
    fetchData();
  }, [conflictStore, trustStore]);

  const onSubmit = async (data: any) => {
    try {
      // console.log("Form Data:", data);

      // normalize partiesInvolved: Controller MultiSelect returns array of {label, value}
      let partiesInvolveStr = "";
      const partiesSelected = data.partiesInvolved;
      if (Array.isArray(partiesSelected)) {
        const labels = partiesSelected.map((opt: any) => opt?.label).filter(Boolean) as string[];
        partiesInvolveStr = labels.join(",");
      } else if (partiesSelected && partiesSelected.label) {
        // single selected object
        partiesInvolveStr = partiesSelected.label;
      } else {
        // fallback: maybe an id or empty
        const found = [...conflictStore.partiesInvolve.values()].find((p: IPartiesInvolve) => String(p.partiesInvolveId) === String(partiesSelected));
        partiesInvolveStr = found?.partiesInvolve ?? String(partiesSelected ?? "");
      }

      const conflictPayloadData: IConflictPayloadData = {
        causeOfConflictId: Number(data.causeOfConflict),
        conflictStatusId: Number(data.statusOfConflict),
        narrateIssues: data.narrateIssues,
        issuesAddressById: Number(data.issueAddressedBy),
        partiesInvolve: partiesInvolveStr,
        courtLitigationStatusId: Number(data.issueAddressedBy) === 5 ? Number(data.statusOfCourtLitigation) : null,
        trustId: trustId as string,
      };

      // console.log("Conflict Payload Data:", conflictPayloadData);

      const payload: IConflictPayload = {
        isCreate: true,
        data: conflictPayloadData
      }
      const response = await conflictStore.createConflict(payload, trustId as string)
      if (response) {
        reset();
        setSubmitted(true);
        // toast.success("Conflict Successfully Submitted");
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
    <div className="flex flex-col min-h-screen">
      <EntryDashboardHeader />
      <div className="flex-1">
      {!submitted && (
        <>
          {trustStore.trust?.disableConflictSurvey == 1 && (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
              <div >
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
                  {trustName} Conflict Data Reporting
                </h2>
                <p className="text-center text-gray-600 mb-10 text-lg">
                  Help us understand and resolve issues better. Please fill out the details below.
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Standard Two-Column Inputs */}
                    <div>
                      <label className="block mb-1 text-base font-medium text-gray-700">Cause of Conflict</label>
                      <select
                        {...register("causeOfConflict")}
                        className="w-full border border-gray-300 rounded-lg p-4 text-base focus:ring-blue-500 focus:border-blue-500">
                        <option value={""}>Select cause of conflict</option>
                        {[...conflictStore.causeOfConflict.values()].map((v: ICauseOfConflict) => (
                          <option key={v.causeOfConflictId} value={v.causeOfConflictId}>
                            {v.causeOfConflict}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Controller
                        control={control}
                        name="partiesInvolved"
                        render={({ field }) => {
                          const options = [...conflictStore.partiesInvolve.values()].map((v: IPartiesInvolve) => ({ label: v.partiesInvolve as string, value: v.partiesInvolve as string }));
                          return (
                            <div>
                              <label className="block mb-1 text-base font-medium text-gray-700">Parties Involved</label>
                              {/* MultiSelect is a wrapper around react-select and expects option shape {label, value} */}
                              <MultiSelect
                                id="parties-involved-select"
                                options={options}
                                placeholder="Select parties involved"
                                value={field.value}
                                onChange={(val: any) => field.onChange(val)}
                                isLoading={conflictStore.isLoading}
                                label=""
                              />
                              <p className="mt-1 text-xs text-gray-500">Tap items to select (mobile friendly)</p>
                            </div>
                          );
                        }}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-base font-medium text-gray-700">Status of Conflict</label>
                      <select
                        {...register("statusOfConflict")}
                        className="w-full border border-gray-300 rounded-lg p-4 text-base focus:ring-blue-500 focus:border-blue-500">
                        <option value={""}>Select status of conflict</option>
                        {[...conflictStore.conflictStatus.values()].map((v: IConflictStatus) => (
                          <option key={v.conflictStatusId} value={v.conflictStatusId}>
                            {v.conflictStatus}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-base font-medium text-gray-700">Issue Addressed By</label>
                      <select
                        {...register("issueAddressedBy", {
                          onChange: (e) => {
                            const val = e.target.value;
                            // if selected value is not 5, clear the court litigation status as it's not applicable
                            if (Number(val) !== 5) {
                              setValue('statusOfCourtLitigation', '');
                            }
                          }
                        })}
                        className="w-full border border-gray-300 rounded-lg p-4 text-base focus:ring-blue-500 focus:border-blue-500">
                        <option value={""}>Select issue addressed by</option>
                        {[...conflictStore.issuesAddressBy.values()].map((v: IIssuesAddressBy) => (
                          <option key={v.issuesAddressById} value={v.issuesAddressById}>
                            {v.issuesAddressBy}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Full-width: Status of Court Litigation (only shown when issueAddressedBy === 5) */}
                  {Number(watchedIssueAddressBy) === 5 && (
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-base font-medium text-gray-700">Status of Court Litigation</label>
                      <select
                        {...register("statusOfCourtLitigation")}
                        className="w-full border border-gray-300 rounded-lg p-4 text-base focus:ring-blue-500 focus:border-blue-500">
                        <option value={""}> Select status of the court litigation</option>
                        {[...conflictStore.courtLitigationStatus.values()].map((v: ICourtLitigationStatus) => (
                          <option key={v.courtLitigationStatusId} value={v.courtLitigationStatusId}>
                            {v.courtLitigationStatus}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Full-width: Narrate Issues */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-base font-medium text-gray-700">Narrate Issues</label>
                    <textarea
                      {...register("narrateIssues")}
                      rows={5}
                      placeholder="Describe the issue..."
                      className="w-full border border-gray-300 rounded-lg p-4 text-base focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  {/* Buttons aligned to the right */}
                  <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-base"
                      onClick={() => reset()}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base"
                    >
                      {conflictStore.isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          )}
          {/* Access Denied Section */}
          {trustStore.trust?.disableConflictSurvey == 0 && (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
              <div>
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
                  Conflict Data Reporting
                </h2>
                <p className="text-center text-gray-600 mb-10 text-lg">
                  Help us understand and resolve issues better. Please contact the administrator for access.
                </p>
                <div className="flex items-center justify-center w-full h-80">
                  <img
                    src={IMG}
                    className="object-contain h-full max-h-80 w-auto"
                    alt="Centered"
                  />
                </div>
                <h3 className="text-3xl font-bold text-center">Access denied</h3>
              </div>
            </div>
          )}
          {/* NotFound*/}
          {trustStore.trust == null && (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
              <div>
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
                  Conflict Data Reporting
                </h2>
                <p className="text-center text-gray-600 mb-10 text-lg">
                  Help us understand and resolve issues better. Please contact the administrator for access.
                </p>
                <div className="flex items-center justify-center w-full h-80">
                  <img
                    src={IMG2}
                    className="object-contain h-full max-h-80 w-auto"
                    alt="Centered"
                  />
                </div>
                <h3 className="text-3xl font-bold text-center">Invalid Trust ID</h3>
              </div>
            </div>
          )}
        </>
      )}
      {submitted && (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Conflict Data Submitted Successfully</h2>
            <p className="text-gray-600 mb-6">Thank you for your submission. Your conflict data has been recorded.</p>
            <div className="flex items-center justify-center w-full h-80">
              <img
                src={IMG3}
                className="object-contain h-full max-h-80 w-auto"
                alt="Centered"
              />
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-6"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      )}


      </div>
    </div>
  );
});

export default ConflictDataForm;