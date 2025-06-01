import { observer } from "mobx-react-lite";
import { Button } from "../../../../components/elements";
import { ITrustPayloadData, ITrustStore } from "../../types/interface";

const PreviewTrust = observer(({ onSave, trustStore }: { onSave: () => void; trustStore: ITrustStore }) => {
  const fields: ITrustPayloadData = trustStore.trustFormData;
  return (
    <section className="py-8 px-6">
      <div className="text-center">
        <h2 className="text-lg lg:text-2xl font-semibold text-primary-100">
          Trust Review
        </h2>
        <p className="mt-1 text-xs text-gray-4">
          Fill out these details to build your broadcast
        </p>
      </div>

      <div className="mt-6">
        <div className="flex gap-2 py-5 border-b border-t border-gray-11 ">
          <h3 className="text-primary-100 font-bold text-sm">Trust Name:</h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.trustName || ""}
          </span>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">Settlor Name:</h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.settlor || ""}
          </span>
        </div>

        <div className="flex gap-4 py-5 border-b border-t border-gray-11">
          <div className="flex items-center gap-x-2">
            <h3 className="text-primary-100 font-bold text-sm">Country</h3>
            <span className="font-medium text-sm text-[#1D2739]">Nigeria</span>
          </div>

          <div className="flex items-center gap-x-2">
            <h3 className="text-primary-100 font-bold text-sm">State</h3>
            <span className="font-medium text-sm text-[#1D2739]">
              {fields?.state || ""}
            </span>
          </div>

          <div className="flex items-center gap-x-2">
            <h3 className="text-primary-100 font-bold text-sm">LGA</h3>
            <span className="font-medium text-sm text-[#1D2739]">
              {fields?.localGovernmentArea}
            </span>
          </div>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">
            Trust Communities:
          </h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.trustCommunities || ""}
          </span>
        </div>

        <div className="border-t border-b border-gray-11 py-3">
          <div className=" space-y-4">

            <div className="space-y-2">
              <div className="flex gap-x-2">
                <h3 className="text-primary-100 font-bold text-sm">
                  BoT Full Name:
                </h3>
                <span className="font-medium text-sm text-[#1D2739]">
                  {fields?.botDetailsOneFirstName || ""} {fields?.botDetailsOneLastName || ""}
                </span>
              </div>

              <div className="flex gap-x-2">
                <h3 className="text-primary-100 font-bold text-sm">
                  BoT Email:
                </h3>
                <span className="font-medium text-sm text-[#1D2739]">
                  {fields?.botDetailsOneEmail || ""}
                </span>
              </div>

              <div className="flex gap-x-2">
                <h3 className="text-primary-100 font-bold text-sm">
                  BoT Phone Number:
                </h3>
                <span className="font-medium text-sm text-[#1D2739]">
                  {fields?.botDetailsOnePhoneNumber || ""}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-x-2">
                <h3 className="text-primary-100 font-bold text-sm">
                  BoT Full Name:
                </h3>
                <span className="font-medium text-sm text-[#1D2739]">
                  {fields?.botDetailsTwoFirstName || ""} {fields?.botDetailsTwoLastName || ""}
                </span>
              </div>

              <div className="flex gap-x-2">
                <h3 className="text-primary-100 font-bold text-sm">
                  BoT Email:
                </h3>
                <span className="font-medium text-sm text-[#1D2739]">
                  {fields?.botDetailsTwoEmail || ""}
                </span>
              </div>

              <div className="flex gap-x-2">
                <h3 className="text-primary-100 font-bold text-sm">
                  BoT Phone Number:
                </h3>
                <span className="font-medium text-sm text-[#1D2739]">
                  {fields?.botDetailsTwoPhoneNumber || ""}
                </span>
              </div>
            </div>


          </div>
        </div>

        {/* ? */}

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">Total Male Bot Members:</h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.totalMaleBotMembers || ""}
          </span>
        </div>

        <div className="flex gap-4 py-5 border-b border-t border-gray-11">
          <div className="flex items-center gap-x-2">
            <h3 className="text-primary-100 font-bold text-sm">Total Female Bot Members</h3>
            <span className="font-medium text-sm text-[#1D2739]"> {fields?.totalFemaleBotMembers || ""}</span>
          </div>

          <div className="flex items-center gap-x-2">
            <h3 className="text-primary-100 font-bold text-sm">Total Pwd Bot Members</h3>
            <span className="font-medium text-sm text-[#1D2739]">
              {fields?.totalPwdBotMembers || ""}
            </span>
          </div>

          <div className="flex items-center gap-x-2">
            <h3 className="text-primary-100 font-bold text-sm">Total Male Advisory Committee Members</h3>
            <span className="font-medium text-sm text-[#1D2739]">
              {fields?.totalMaleAdvisoryCommitteeMembers || ""}
            </span>
          </div>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">
          Total Female Advisory Committee Members:
          </h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.totalFemaleAdvisoryCommitteeMembers || ""}
          </span>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">
          Total Pwd Advisory Committee Members:
          </h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.totalPwdAdvisoryCommitteeMembers || ""}
          </span>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">
          Total Male Management Committee Members:
          </h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.totalMaleManagementCommitteeMembers || ""}
          </span>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">
          Total Female Management Committee Members:
          </h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.totalFemaleManagementCommitteeMembers || ""}
          </span>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">
          Total Pwd Management Committee Members:
          </h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.totalPwdManagementCommitteeMembers || ""}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
        <Button
          onClick={onSave}
          padding="py-3"
          buttonText={trustStore.isSubmitting ? "Saving.." : "Save"}
        />
      </div>
    </section>
  );
});

export default PreviewTrust;
