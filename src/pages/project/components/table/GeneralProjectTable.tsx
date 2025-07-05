import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Observer, observer } from "mobx-react-lite";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { RowSelectionState } from "@tanstack/react-table";
import { IProjectView } from "../../types/interface";
import { EmptyTable, LoadingTable, Table, Tag } from "../../../../components/elements";
import { checkIcon } from "../../../../assets/icons";
import IMG from "../../../../assets/svgs/dashboardConflictNotFound.svg";
// import { FaEdit } from "react-icons/fa";
// import { authStore as AuthStore } from "../../../auth/store/authStore";
import { trustStore } from "../../../trust/store/trustStore";
import { ITrustList } from "../../../trust/types/interface";
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
        // console.log(`Approved user : ${project}`);
        projectStore.selectedProject = project
        projectStore.selectedProjectScreen = 3
        dashboardStore.selectedTab = 2;
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
    const selectTrust = useCallback((v: string) => {
        async function getInfo() {
            projectStore.selectedTrust = v;
            projectStore.searchProject(v);
            projectStore.selectedProject = null;
        }
        getInfo()
    }, [projectStore]);
    return (
        <div className="mt-10  p-4  ">
            <div>
                <h2 className="font-semibold text-xl text-gray-900">All Project</h2>
                <p className="text-gray-500 text-sm">View Projects created on a specific Trust.</p>
            </div>
            <section className="mb-4 flex items-center justify-end gap-x-3">
                <div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 w-full justify-end">
                        <div className="flex flex-col">
                            <Observer>
                                {() => (
                                    <>
                                        <label className="text-sm font-medium text-gray-700 mb-1">Select Trust</label>
                                        <select
                                            className="border border-gray-300 rounded px-4 py-2 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white text-gray-700"
                                            value={projectStore.selectedTrust}
                                            onChange={e => selectTrust(e.target.value)}

                                        >
                                            <option key="ALL" value="ALL">ALL</option>
                                            {[...trustStore.allTrustList.values()].map((v: ITrustList) => (
                                                <option key={v.trustName} value={v.trustId}>{v.trustName}</option>
                                            ))}
                                        </select>

                                    </>
                                )}
                            </Observer>
                        </div>

                    </div>

                </div>
            </section>

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
