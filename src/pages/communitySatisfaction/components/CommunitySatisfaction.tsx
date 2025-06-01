import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Button, DashboardSkeleton, GoBack } from "../../../components/elements";
// import { EconomicImpactTable } from "./table/EconomicImpactTable";
// import EconomicImpactDashboard from "./chart/EconomicImpactDashboard";
import { satisfactionStore as SatisfactionStore } from "../store/satisfactionStore";
import { trustStore as TrustStore } from "../../trust/store/trustStore";

import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import CommunitySatisfactionForm from "./form/CommunitySatisfactionForm";
import { CommunitySatisfactionTable } from "./table/CommunitySatisfactionTable";
import CommunitySatisfactionDashboard from "./chart/CommunitySatisfactionDasboard";
const SatisfactionStoreCtx = createContext(SatisfactionStore);
const TrustStoreCtx = createContext(TrustStore);

const CommunitySatisfaction = observer(() => {
    const satisfactionStore = useContext(SatisfactionStoreCtx);
    const trustStore = useContext(TrustStoreCtx);
    const [isTableView, setIsTableView] = useState(true);
    const { name } = useParams();
    const navigate = useNavigate();

    const openAddForm = useCallback(() => {
        satisfactionStore.isAddFunctionalityNeeded = true;
    }, [satisfactionStore]);

    useEffect(() => {
        async function loadRequests() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
            satisfactionStore.dashboardData = null;
            await satisfactionStore.getSatisfactionDashboardByTrustId(selectedTrustId as string);
        }
        loadRequests();
    }, []);

    return (

        satisfactionStore.isAddFunctionalityNeeded ? (
            <CommunitySatisfactionForm
                satisfactionStore={satisfactionStore}
                trustStore={trustStore}
            />
        ) : (
            <div className=" mx-auto p-8">
                <GoBack action={() => navigate(-1)} trustName={name || ""} page="Average Community Satisfaction" />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Average Community Satisfaction
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Charts</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!isTableView}
                                    onChange={() => setIsTableView(!isTableView)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </label>
                            <span className="text-sm text-gray-600 ml-2">Table</span>
                        </div>
                        <Button
                            onClick={openAddForm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            buttonText="Add Component"
                            width="w-fit"
                            type="button"
                        />
                    </div>
                </div>

                <p className="text-gray-600 mb-4">
                    Average community satisfaction with the process / inclusion/abroach/conflict management of the HCDTs
                    by governing structure (BoT, Management & advisory committee)
                </p>
                <p className="text-sm text-gray-500">
                    These are your personal details, they are visible to the public
                </p>

                <div className="mt-4 bg-white  rounded-lg ">
                    {isTableView && (
                        <div>
                            {satisfactionStore.isDashboardLoading ? (
                                <DashboardSkeleton />
                            ) : (<CommunitySatisfactionDashboard
                                satisfactionStore={satisfactionStore}
                            />
                            )}
                        </div>
                    )}
                    {!isTableView && (
                        <div><CommunitySatisfactionTable /></div>
                    )}
                </div>
            </div>
        )


    );
});

export default CommunitySatisfaction;