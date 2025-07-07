import { RowSelectionState } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { checkIcon } from "../../../../assets/icons";
import { EmptyTable, LoadingTable, Table } from "../../../../components/elements";
// import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import Tag from "../../../../components/elements/Tag";
import { satisfactionStore as SatisfactionStore } from "../../store/satisfactionStore";
import { IAverageCommunitySatisfactionView } from "../../types/interface";
import { dashboardStore as DashboardStore } from "../../../dashboard/store/dashboardStore";


const SatisfactionStoreCtx = createContext(SatisfactionStore);
const dashboardStoreCtx = createContext(DashboardStore);

export const GeneralSatisfactionTable = observer(() => {
    const satisfactionStore = useContext(SatisfactionStoreCtx);
    const dashboardStore = useContext(dashboardStoreCtx);

    useEffect(() => {
        async function loadRequests() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustIdG")
            await satisfactionStore.getSatisfactionByTrustId(selectedTrustId as string);
            satisfactionStore.selectedSatisfaction = null;
        }
        loadRequests();
    }, []);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleView = useCallback(async (satisfaction: IAverageCommunitySatisfactionView) => {
        // console.log(`View user : ${satisfaction}`);
        satisfactionStore.selectedSatisfaction = satisfaction
        dashboardStore.selectedTab = 55;
        // Add your logic here
    }, [satisfactionStore]);


    // Define columns with memoization
    const columns = useMemo(
        () => [
            {
                id: "date",
                header: "Award Date",
                accessorKey: "date",
                cell: ({ row }: { row: { original: IAverageCommunitySatisfactionView } }) => {
                    const satisfaction = row.original;
                    const data = satisfaction.createAt ? new Date(satisfaction.createAt).toDateString() : "";
                    return <span>{data}</span>;
                },
            },
            {
                id: "infoProjectsStatus",
                header: "Info Projects",
                accessorKey: "infoProjectsStatus",
            },
            {
                id: "communityConsultStatus",
                header: "Community Consult",
                accessorKey: "communityConsultStatus",
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }: { row: { original: IAverageCommunitySatisfactionView } }) => {
                    const satisfaction = row.original;

                    return (
                        <div className="flex gap-2">
                            <Tag
                                label="View"
                                type="default"
                                icon={checkIcon}
                                onClick={() => handleView(satisfaction)} // Add your view handler
                            />
                        </div>
                    );
                },
            },
        ],
        [handleView],
    );

    const tableHead = ["Info Projects", "Community Consult", "Local Participation", "Report Mechanism", "Action"];

    return (
        <div className="mt-4 p-4">
            <>
                {satisfactionStore.isLoading ? (
                    <LoadingTable headArr={tableHead} />
                ) : satisfactionStore.satisfactionByTrust.size > 0 ? (
                    <Table
                        columns={columns}
                        data={[...satisfactionStore.satisfactionByTrust.values()].map((satisfaction, i: number) => ({
                            ...satisfaction, id: i.toString()
                        } as IAverageCommunitySatisfactionView))
                        }
                        count={satisfactionStore.satisfactionByTrust.size}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        totalPage={satisfactionStore.satisfactionByTrust.size}
                    // refresh={()=>economicImpactStore.getEconomicImpactByTrustId(trustStore.selectedTrustId)}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No satisfaction data available."
                        text="Create Satisfaction to get started!"
                    />
                )}
            </>

        </div>
    );
});