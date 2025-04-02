import { Button } from "../../../components/elements";
import TrustTable from "../../../components/sections/trusts/TrustTable";

const Trusts = () => {
  return (
    <div className="px-10 py-11">
      <section>
        <h2 className="text-lg lg:text-2xl font-semibold text-primary-100">
          Trusts
        </h2>
        <p className="mt-1 text-xs text-gray-4">
          Control your profile setup and integrations
        </p>

        <div className=" mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-x-8 gap-y-4">
          <input
            className="flex-1 bg-white  py-3 px-4 rounded-lg"
            type="text"
            placeholder="Search Trust"
          />

          <div>
            <Button
              href="/dashboard/trusts/create-trust"
              padding="py-2 px-6"
              buttonText="Create Trust"
            />
          </div>
        </div>
      </section>

      <section>
        <TrustTable />
      </section>
    </div>
  );
};

export default Trusts;
