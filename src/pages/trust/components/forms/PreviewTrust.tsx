/* eslint-disable @typescript-eslint/no-explicit-any */

type PreviewProp = {
  fields: any;
  changeTab: React.Dispatch<React.SetStateAction<number>>;
  submit: () => void;
  isSubmitting: boolean;
};

import { Button } from "../../../../components/elements";

const PreviewTrust = ({
  fields,
  changeTab,
  submit,
  isSubmitting,
}: PreviewProp) => {
  console.log({
    fields,
  });
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
            {fields?.trustName}
          </span>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">Settlor Name:</h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.settlorId?.map((i: { label: string }) => (
              <span>{i.label}</span>
            ))}
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
              {fields?.state?.label}
            </span>
          </div>

          <div className="flex items-center gap-x-2">
            <h3 className="text-primary-100 font-bold text-sm">LGA</h3>
            <span className="font-medium text-sm text-[#1D2739]">
              {fields?.localGovernmentArea?.label}
            </span>
          </div>
        </div>

        <div className="flex gap-2 py-5 border-b border-t border-gray-11">
          <h3 className="text-primary-100 font-bold text-sm">
            Trust Communities:
          </h3>
          <span className="font-medium text-sm text-[#1D2739]">
            {fields?.trustCommunities?.map((i: string) => (
              <span>{i}</span>
            ))}
          </span>
        </div>

        <div className="border-t border-b border-gray-11 py-3">
          <div className=" space-y-4">
            {fields?.botDetails?.map(
              (bot: {
                firstName: string;
                lastName: string;
                email: string;
                phoneNumber: string;
              }) => (
                <div className="space-y-2">
                  <div className="flex gap-x-2">
                    <h3 className="text-primary-100 font-bold text-sm">
                      BoT Full Name
                    </h3>
                    <span className="font-medium text-sm text-[#1D2739]">
                      {bot?.firstName} {bot?.lastName}
                    </span>
                  </div>

                  <div className="flex gap-x-2">
                    <h3 className="text-primary-100 font-bold text-sm">
                      BoT Email
                    </h3>
                    <span className="font-medium text-sm text-[#1D2739]">
                      {bot?.email}
                    </span>
                  </div>

                  <div className="flex gap-x-2">
                    <h3 className="text-primary-100 font-bold text-sm">
                      BoT Phone Number
                    </h3>
                    <span className="font-medium text-sm text-[#1D2739]">
                      {bot?.phoneNumber}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
        <Button
          onClick={() => changeTab(1)}
          className="border text-black bg-white border-gray-7 rounded-lg py-2 px-4 lg:px-10"
          buttonText="Edit"
          width="w-fit"
        />

        <Button
          onClick={submit}
          padding="py-3"
          buttonText={isSubmitting ? "Saving.." : "Save"}
        />
      </div>
    </section>
  );
};

export default PreviewTrust;
