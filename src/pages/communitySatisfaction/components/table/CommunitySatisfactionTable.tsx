import { RowSelectionState } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { caretDownIcon, filterIcon, sortIcon, checkIcon } from "../../../../assets/icons";
import { EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
// import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import Tag from "../../../../components/elements/Tag";
import { satisfactionStore as SatisfactionStore } from "../../store/satisfactionStore";
import { IAverageCommunitySatisfactionView } from "../../types/interface";
import CommunitySatisfactionView from "../modal/CommunitysatisfactionView";


const SatisfactionStoreCtx = createContext(SatisfactionStore);
// const TrustStoreCtx = createContext(TrustStore);

export const CommunitySatisfactionTable = observer(() => {
    const satisfactionStore = useContext(SatisfactionStoreCtx);
    // const trustStore = useContext(TrustStoreCtx);

    useEffect(() => {
        async function loadRequests() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
            await satisfactionStore.getSatisfactionByTrustId(selectedTrustId as string);
            satisfactionStore.selectedSatisfaction = null;
        }
        loadRequests();
    }, []);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleView = useCallback(async (satisfaction: IAverageCommunitySatisfactionView) => {
        console.log(`View user : ${satisfaction}`);
        satisfactionStore.selectedSatisfaction = satisfaction
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
            // {
            //     id: "localParticipationStatus",
            //     header: "Local Participation",
            //     accessorKey: "localParticipationStatus",
            // },
            // {
            //     id: "reportMechanismStatus",
            //     header: "Report Mechanism",
            //     accessorKey: "reportMechanismStatus",
            // },
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
        <div className="mt-10 bg-white p-4 rounded-2xl border border-gray-8 ">
            <section className="mb-4 flex items-center justify-end gap-x-3">
                <button className=" shadow-sm border border-gray-10 px-3 py-2  rounded-xl flex items-center gap-x-2">
                    <img src={filterIcon} alt="filter admin table" />
                    <span className="font-medium text-sm  text-[#525866]">Filter</span>
                </button>

                <button className="shadow-sm border border-gray-10 px-3 py-2  rounded-xl flex items-center gap-x-2">
                    <img src={sortIcon} alt="filter admin table" />
                    <span className="font-medium text-sm  text-[#525866]">Sort</span>
                    <img src={caretDownIcon} alt="filter admin table" />
                </button>
            </section>

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
            {/* Modals */}
            {satisfactionStore.selectedSatisfaction && (
                <Modal
                    body={
                        <CommunitySatisfactionView
                            close={() => satisfactionStore.selectedSatisfaction = null}
                            satisfactionStore={satisfactionStore}
                        />
                    }
                    close={() => satisfactionStore.selectedSatisfaction = null}
                />
            )}
        </div>
    );
});