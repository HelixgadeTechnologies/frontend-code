import { Button } from "../../../components/elements";
import TrustTable from "./table/TrustTable";
import { trustStore as TrustStore } from "../store/trustStore";
import { createContext, useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";
import CreateTrust from "./forms/CreateTrust";
import EditTrust from "./forms/EditTrust";

const trustStoreCTX = createContext(TrustStore);
const Trusts = observer(() => {
  const trustStore = useContext(trustStoreCTX);
  const search = useCallback((keyword: string) => {
    trustStore.searchTrust(keyword);
  }, [trustStore]);

  const switchPage = useCallback(() => {
    trustStore.trustFormData = {} as any;
    trustStore.pageSwitched = 2;
  }, [trustStore]);
  return (
    <>
      {trustStore.pageSwitched == 1 && (
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
                onChange={(e) => search(e.target.value)}
              />

              <div>
                <Button
                  onClick={switchPage}
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

      )}

      {trustStore.pageSwitched == 2 && (
        <CreateTrust />
      )}

      {trustStore.pageSwitched == 3 && (
        <EditTrust />
      )}
    </>
  );
});

export default Trusts;
