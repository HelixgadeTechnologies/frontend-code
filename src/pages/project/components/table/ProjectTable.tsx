import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Observer, observer } from "mobx-react-lite";
import { projectStore as ProjectStore } from "../../store/projectStore";
import { RowSelectionState } from "@tanstack/react-table";
import { IProjectView } from "../../types/interface";
import { EmptyTable, LoadingTable, Table, Tag } from "../../../../components/elements";
import { caretDownIcon, checkIcon, filterIcon, sortIcon } from "../../../../assets/icons";
import IMG from "../../../../assets/svgs/dashboardConflictNotFound.svg";
import { FaEdit } from "react-icons/fa";
const ProjectStoreCTX = createContext(ProjectStore)
const ProjectTable = observer(() => {
    const projectStore = useContext(ProjectStoreCTX)

    useEffect(() => {
        async function loadRequests() {
            let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
            await projectStore.getProjects(selectedTrustId as string);
            projectStore.selectedProject = null;
        }
        loadRequests();
    }, []);

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleView = useCallback(async (project: IProjectView) => {
        // console.log(`Approved user : ${project}`);
        projectStore.selectedProject = project
        projectStore.selectedProjectScreen = 3
        // Add your logic here
    }, []);
    const handleEdit = useCallback(async (project: IProjectView) => {
        const pCategory = [...projectStore.projectCategories.values()].find((category) => category.categoryName?.toLowerCase() === project.projectCategory?.toLowerCase());
        projectStore.projectFormData = {
            projectId: project.projectId,
            projectTitle: project.projectTitle as string,
            projectCategoryId: pCategory?.projectCategoryId,
            totalBudget: project.totalBudget as number,
            community: project.community as string,
            awardDate: project.awardDate as string,
            nameOfContractor: project.nameOfContractor as string,
            annualApprovedBudget: project.annualApprovedBudget as string,
            projectStatus: project.projectStatus as number,
            qualityRatingId: project.qualityRatingId as number,
            projectVideo: project.projectVideo as string,
            projectVideoMimeType: project.projectVideoMimeType as string,
            numberOfMaleEmployedByContractor: project.numberOfMaleEmployedByContractor as number,
            numberOfFemaleEmployedByContractor: project.numberOfFemaleEmployedByContractor as number,
            numberOfPwDsEmployedByContractor: project.numberOfPwDsEmployedByContractor as number,
            typeOfWork: project.typeOfWork as string,
            numberOfHostCommunityMemberContracted: project.numberOfHostCommunityMemberContracted as number,
            numberOfMaleBenefited: project.numberOfMaleBenefited as number,
            numberOfFemaleBenefited: project.numberOfFemaleBenefited as number,
            numberOfPwDsBenefited: project.numberOfPwDsBenefited as number,
            trustId: project.trustId as string,
        };
        projectStore.selectedProject = project
        projectStore.selectedProjectScreen = 4

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
                                    <Tag
                                        label="Edit"
                                        type="default"
                                        icon={<FaEdit />}
                                        onClick={() => handleEdit(economicImpact)} // Add your Edit handler
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
    const handleCreate = useCallback(() => {
        projectStore.isViewDialogOpen = true
    }, [projectStore]);

    const tableHead = ["Project Title", "Project Category", "Award Date", "Community", "Action"];

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
                {projectStore.isLoading ? (
                    <LoadingTable headArr={tableHead} />
                ) : projectStore.projects.size > 0 ? (
                    <Table
                        columns={columns}
                        data={[...projectStore.projects.values()].map((project, i: number) => ({
                            ...project, id: i.toString()
                        } as IProjectView))
                        }
                        count={projectStore.projects.size}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    // refresh={()=>economicImpactStore.getEconomicImpactByTrustId(trustStore.selectedTrustId)}
                    />
                ) : (
                    <EmptyTable
                        headArr={tableHead}
                        heading="No project data available."
                        text={<span>You can  <button className="text-blue-600 text-md font-medium hover:underline" onClick={handleCreate}>click here</button> to create a project</span>}
                        img={IMG}
                    />
                )}
            </>
        </div>
    );
});

export default ProjectTable;
