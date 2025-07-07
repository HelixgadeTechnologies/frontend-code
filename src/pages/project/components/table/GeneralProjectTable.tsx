import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Observer, observer } from "mobx-react-lite";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { RowSelectionState } from "@tanstack/react-table";
import { IProjectView } from "../../types/interface";
import { EmptyTable, LoadingTable, Table, Tag } from "../../../../components/elements";
import { checkIcon } from "../../../../assets/icons";
import IMG from "../../../../assets/svgs/dashboardConflictNotFound.svg";

import { dashboardStore as DashboardStore } from "../../../dashboard/store/dashboardStore";

const ProjectStoreCTX = createContext(ProjectStore)
const dashboardStoreCTX = createContext(DashboardStore)
// const authStoreCTX = createContext(AuthStore)
const GeneralProjectTable = observer(() => {
    const projectStore = useContext(ProjectStoreCTX)
    const dashboardStore = useContext(dashboardStoreCTX)
    // const authStore = useContext(authStoreCTX)

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleView = useCallback(async (project: IProjectView) => {
        projectStore.selectedProject = project
        dashboardStore.selectedTab = 33;
        // Add your logic here
    }, []);


    // Define columns with memoization
    const columns = useMemo(
        () => [
            {
                id: "projectTitle",
                header: "Project Title",
                accessorKey: "projectTitle",
            },
            {
                id: "projectCategory",
                header: "Project Category",
                accessorKey: "projectCategory",
            },
            {
                id: "date",
                header: "Award Date",
                accessorKey: "date",
                cell: ({ row }: { row: { original: IProjectView } }) => {
                    const economicImpact = row.original;
                    const data = economicImpact.createAt ? new Date(economicImpact.createAt).toDateString() : "";
                    return <span>{data}</span>;
                },
            },
            {
                id: "community",
                header: "Community",
                accessorKey: "community",
            },
            {
                id: "projectStatusName",
                header: "Project Status",
                accessorKey: "projectStatusName",

            },
            {
                id: "actions",
                header: "",
                cell: ({ row }: { row: { original: IProjectView } }) => {
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
    // Define table head
    const tableHead = ["Project Title", "Project Category", "Award Date", "Community", "Action"];
    // const selectTrust = useCallback((v: string) => {
    //     async function getInfo() {
    //         projectStore.selectedTrust = v;
    //         projectStore.searchProject(v);
    //         projectStore.selectedProject = null;
    //     }
    //     getInfo()
    // }, [projectStore]);
    return (
        <div className="mt-10  p-4  ">
            <>
                {projectStore.isLoading ? (
                    <LoadingTable headArr={tableHead} />
                ) : projectStore.sortedProjects.size > 0 ? (
                    <Table
                        columns={columns}
                        data={[...projectStore.sortedProjects.values()].map((project, i: number) => ({
                            ...project, id: i.toString()
                        } as IProjectView))
                        }
                        count={projectStore.sortedProjects.size}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        totalPage={projectStore.sortedProjects.size}
                    // refresh={()=>economicImpactStore.getEconomicImpactByTrustId(trustStore.selectedTrustId)}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No project data available."
                        // text={<span>You can   to create a project</span>}
                        img={IMG}
                    />
                )}
            </>
        </div>
    );
});

export default GeneralProjectTable;
