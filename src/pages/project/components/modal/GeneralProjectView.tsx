import { observer } from "mobx-react-lite";
import { IProjectView } from "../../types/interface";
import dayjs from "dayjs";
import { useCallback } from "react";
import { IDashboardStore } from "../../../dashboard/types/interface";
import GoBackT from "../../../../components/elements/GoBackT";
import IMG from "../../../../assets/svgs/fileNotFound.svg"

const GeneralProjectView = observer(({ projectData, dashboardStore }: { projectData: IProjectView; dashboardStore: IDashboardStore }) => {

    const closeTable = useCallback(() => {
        dashboardStore.selectedTab = 3;
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
            <GoBackT action={closeTable} page="Project table" />
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
                        <h2 className="text-lg font-bold text-gray-800">{projectData?.projectTitle || "Project Title"}</h2>
                        {/* <p className="text-sm text-gray-600">Project ID: {projectData.projectId || "N/A"}</p> */}
                    </div>
                    <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(projectData?.projectStatusName as string)}`}>
                        {projectData?.projectStatusName || "N/A"}
                    </span>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <p className="text-sm text-gray-600">
                        <strong>Project Category:</strong> {projectData?.projectCategory || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Total Project Budget:</strong> {projectData?.totalBudget || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Award Date:</strong> {dayjs(projectData?.awardDate).format("DD-MM-YYYY") || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Contractor:</strong> {projectData?.nameOfContractor || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Community:</strong> {projectData?.community || "N/A"}
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
                            <strong>Number of Males Employed by Contractor:</strong> {projectData?.numberOfMaleEmployedByContractor || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Number of Females Employed by Contractor:</strong> {projectData?.numberOfFemaleEmployedByContractor || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Number of PwDs Employed by Contractor:</strong> {projectData?.numberOfPwDsEmployedByContractor || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Number of Host Community Members Contracted:</strong> {projectData?.numberOfHostCommunityMemberContracted || "N/A"}
                        </p>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Type of Work:</strong>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {projectData?.typeOfWork
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
                        <div className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            {(() => {
                                const url = projectData?.projectVideo as string;
                                const mimeType = projectData?.projectVideoMimeType;
                                
                                if (!url) {
                                    return (
                                        <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                            <img
                                                src={IMG}
                                                alt="No Media Available"
                                                width={100}
                                                className="opacity-50 mb-2"
                                            />
                                            <p className="text-gray-400 text-sm italic">No media available</p>
                                        </div>
                                    );
                                }

                                const type = mimeType?.toLowerCase() || "";
                                const isImage = type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                                const isVideo = type.startsWith("video/") || /\.(mp4|webm|ogg)$/i.test(url);
                                const isPdf = type === "application/pdf" || /\.pdf$/i.test(url);

                                if (isImage) {
                                    return (
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
                                            <div className="relative overflow-hidden rounded-lg shadow-md">
                                                <img src={url} alt="Project Media" className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">View Full Image</span>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                }

                                if (isVideo) {
                                    return (
                                        <video src={url} controls className="w-full h-64 object-cover rounded-lg shadow-md" />
                                    );
                                }

                                if (isPdf) {
                                    return (
                                        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-gray-700 mb-4">Project Document (PDF)</p>
                                            <a 
                                                href={url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-6 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                View PDF
                                            </a>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
                                        <p className="text-sm text-gray-600 mb-4 font-medium">Attached File</p>
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all px-4">
                                            {url.split('/').pop() || 'Download File'}
                                        </a>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm text-gray-600">
                                <strong>Annual Approved Budget:</strong> {projectData?.annualApprovedBudget || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Project Name:</strong> {projectData?.projectTitle || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GeneralProjectView;