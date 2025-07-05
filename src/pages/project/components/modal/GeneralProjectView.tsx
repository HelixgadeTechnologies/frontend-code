import { observer } from "mobx-react-lite";
import { IProjectView } from "../../types/interface";
import dayjs from "dayjs";
import { useCallback } from "react";
import { IDashboardStore } from "../../../dashboard/types/interface";
import GoBackT from "../../../../components/elements/GoBackT";

const GeneralProjectView = observer(({ projectData, dashboardStore }: { projectData: IProjectView; dashboardStore: IDashboardStore }) => {
  
    const closeTable = useCallback(() => {
        dashboardStore.selectedTab = 1;
    }, [dashboardStore]);
    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case "YET TO START":
                return "bg-yellow-100 text-yellow-700";
            case "IN PROGRESS":
                return "bg-blue-100 text-blue-700";
            case "GOOD":
                return "bg-green-100 text-green-700";
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "ABANDONED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header Section */}
            <GoBackT action={closeTable}  page="project table" />
            <div className="flex justify-between items-center">
                <div>
                    {/* <h1 className="text-lg font-bold text-gray-800">Project Page</h1> */}
                    {/* <p className="text-sm text-gray-600">Showing data for a selected Project</p> */}
                </div>

            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-8">

                {/* Project Overview */}
                <div className="flex justify-between items-center mb-6 ">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{projectData.projectTitle || "Project Title"}</h2>
                        {/* <p className="text-sm text-gray-600">Project ID: {projectData.projectId || "N/A"}</p> */}
                    </div>
                    <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(projectData.projectStatusName as string)}`}>
                        {projectData.projectStatusName || "N/A"}
                    </span>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <p className="text-sm text-gray-600">
                        <strong>Project Category:</strong> {projectData.projectCategory || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Total Project Budget:</strong> {projectData.totalBudget || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Award Date:</strong> {dayjs(projectData.awardDate).format("DD-MM-YYYY") || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Contractor:</strong> {projectData.nameOfContractor || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Community:</strong> {projectData.community || "N/A"}
                    </p>

                </div>

            </div>

            {/* Quality Rating Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Quality Rating</h2>
                    <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        {projectData.qualityRatingName || "Good"}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Left Column */}

                    {/* Left Column */}
                    <div className="space-y-6">
                        <p className="text-sm text-gray-600">
                            <strong>Number of Males Employed by Contractor:</strong> {projectData.numberOfMaleEmployedByContractor || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Number of Females Employed by Contractor:</strong> {projectData.numberOfFemaleEmployedByContractor || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Number of PwDs Employed by Contractor:</strong> {projectData.numberOfPwDsEmployedByContractor || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Number of Host Community Members Contracted:</strong> {projectData.numberOfHostCommunityMemberContracted || "N/A"}
                        </p>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Type of Work:</strong>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {projectData.typeOfWork
                                    ? projectData.typeOfWork.split(",").map((work: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                                        >
                                            {work.trim()}
                                        </span>
                                    ))
                                    : "N/A"}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}

                    <div className="space-y-4">
                        <div className="w-full bg-gray-200 rounded-lg overflow-hidden">
                            {projectData.projectVideoMimeType?.startsWith("image/") && (
                                <a href={projectData.projectVideo as string} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={projectData.projectVideo as string}
                                        alt="Project Media"
                                        className="w-full h-64 object-cover rounded-lg shadow-md"
                                    />
                                </a>
                            )}
                            {projectData.projectVideoMimeType?.startsWith("video/") && (
                                <video
                                    src={projectData.projectVideo as string}
                                    controls
                                    className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                            )}
                            {projectData.projectVideoMimeType === "application/pdf" && (
                                <iframe
                                    src={projectData.projectVideo as string}
                                    title="Project PDF"
                                    className="w-full h-64 rounded-lg shadow-md"
                                />
                            )}
                            {!projectData.projectVideoMimeType && (
                                <p className="text-sm text-gray-600">No media available</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm text-gray-600">
                                <strong>Annual Approved Budget:</strong> {projectData.annualApprovedBudget || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Project Name:</strong> {projectData.projectTitle || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GeneralProjectView;