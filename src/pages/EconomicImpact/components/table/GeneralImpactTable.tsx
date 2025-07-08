import { RowSelectionState } from "@tanstack/react-table";
import { Observer, observer } from "mobx-react-lite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {checkIcon } from "../../../../assets/icons";
import { EmptyTable, LoadingTable, Modal, Table } from "../../../../components/elements";
import { economicImpactStore as EconomicImpactStore } from "../../store/economicImpactStore"
// import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import { IEconomicImpactView } from "../../types/interface";
import Tag from "../../../../components/elements/Tag";
import EconomicImpactView from "../modal/EconomicImpactView";


const EconomicImpactStoreCtx = createContext(EconomicImpactStore);
// const TrustStoreCtx = createContext(TrustStore);

export const GeneralImpactTable = observer(() => {
    const economicImpactStore = useContext(EconomicImpactStoreCtx);
    // const trustStore = useContext(TrustStoreCtx);

    useEffect(() => {
        async function loadRequests() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustIdG")
            await economicImpactStore.getEconomicImpactByTrustId(selectedTrustId as string);
            economicImpactStore.selectedEconomicImpact = null;
        }
        loadRequests();
    }, []);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleView = useCallback(async (economicImpact: IEconomicImpactView) => {
        console.log(`Approved user : ${economicImpact}`);
        economicImpactStore.selectedEconomicImpact = economicImpact
        // Add your logic here
    }, []);


    // Define columns with memoization
    const columns = useMemo(
        () => [
            {
                id: "date",
                header: "Award Date",
                accessorKey: "date",
                cell: ({ row }: { row: { original: IEconomicImpactView } }) => {
                    const economicImpact = row.original;
                    const data = economicImpact.createAt ? new Date(economicImpact.createAt).toDateString() : "";
                    return <span>{data}</span>;
                },
            },
            {
                id: "businessGrowthStatus",
                header: "Business Growth",
                accessorKey: "businessGrowthStatus",
            },
            {
                id: "incomeIncreaseStatus",
                header: "Income Increase",
                accessorKey: "incomeIncreaseStatus",
            },
            {
                id: "livelihoodImproveStatus",
                header: "Livelihood Improve",
                accessorKey: "livelihoodImproveStatus",
            },
            {
                id: "accessAmenitiesStatus",
                header: "Access Amenities",
                accessorKey: "accessAmenitiesStatus",
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }: { row: { original: IEconomicImpactView } }) => {
                    const economicImpact = row.original;

                    return (
                        <Observer>
                            {() => (
                                <div className="flex gap-2">
                                    <Tag
                                        label="View"
                                        type="default"
                                        icon={checkIcon}
                                        onClick={() => handleView(economicImpact)} // Add your view handler
                                    />
                                </div>
                            )}
                        </Observer>
                    );
                },
            },
        ],
        [handleView],
    );

    const tableHead = ["Business Growth", "Income Increase", "Livelihood Improve", "Access Amenities", "Action"];

    return (
        <div className="mt-10 p-4 ">
 
            <>
                {economicImpactStore.isLoading ? (
                    <LoadingTable headArr={tableHead} />
                ) : economicImpactStore.economicImpactsByTrust.size > 0 ? (
                    <Table
                        columns={columns}
                        data={[...economicImpactStore.economicImpactsByTrust.values()].map((economicImpact, i: number) => ({
                            ...economicImpact, id: i.toString()
                        } as IEconomicImpactView))
                        }
                        count={economicImpactStore.economicImpactsByTrust.size}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        totalPage={economicImpactStore.economicImpactsByTrust.size}
                    // refresh={()=>economicImpactStore.getEconomicImpactByTrustId(trustStore.selectedTrustId)}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No Admin data available."
                        text="Create admin to get started!"
                    />
                )}
            </>
            {/* Modals */}
            {economicImpactStore.selectedEconomicImpact && (
                <Modal
                    body={
                        <EconomicImpactView
                            close={() => economicImpactStore.selectedEconomicImpact = null}
                            economicImpactStore={economicImpactStore}
                        />
                    }
                    close={() => economicImpactStore.selectedEconomicImpact = null}
                />
            )}
        </div>
    );
});