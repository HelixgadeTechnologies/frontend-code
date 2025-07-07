import { observer } from "mobx-react-lite";
import { IConflictView } from "../../types/interface";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { conflictStore as ConflictStore } from "../../store/conflictStore"
import { createContext, useCallback, useContext } from "react";
import IMG from "../../../../assets/images/download.jpeg"
import { dashboardStore as DashboardStore } from "../../../dashboard/store/dashboardStore";
import GoBackT from "../../../../components/elements/GoBackT";
// Enable the plugin
dayjs.extend(relativeTime);
const dashboardStoreCTX = createContext(DashboardStore)
const ConflictStoreCTX = createContext(ConflictStore)
const GeneralConflictView = observer(() => {
    const dashboardStore = useContext(dashboardStoreCTX)
    const conflictStore = useContext(ConflictStoreCTX)
    const conflictData: IConflictView | null = conflictStore.selectedConflict;

   
    const closeTable = useCallback(() => {
        dashboardStore.selectedTab = 4;
    }, [dashboardStore]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header Section */}
            <GoBackT action={closeTable} page="Conflict table" />
            <br />
            <h1 className="text-xl font-bold text-gray-800">
                Conflict View
            </h1>
            <br />
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-4">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {conflictData?.userEmail}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Project Age:</strong> {dayjs(conflictData?.projectCreateAt).fromNow()}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Report Date:</strong> {dayjs(conflictData?.createAt).format("DD-MM-YYYY")}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Phone Number:</strong> {conflictData?.userPhoneNumber}
                    </p>
             
                </div>
           
            </div>

            {/* Conflict Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Conflict Details</h2>
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                        {conflictData?.conflictStatusName}
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            <strong>Cause of conflict:</strong> {conflictData?.causeOfConflictName}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Parties Involved:</strong> {conflictData?.partiesInvolveName}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Issues Addressed by:</strong> {conflictData?.issuesAddressByName}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>State of the court litigation:</strong> {conflictData?.courtLitigationStatusName}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Status of the Conflict:</strong> {conflictData?.conflictStatusName}
                        </p>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                            <img
                                src={IMG || "/default-project.png"}
                                alt="Project"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            <strong>Narrate Issues:</strong> {conflictData?.narrateIssues}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm text-gray-600">
                                {/* <strong>Trust Name:</strong> {conflictData?.trustName} */}
                            </p>
                            <p className="text-sm text-gray-600">
                                {/* <strong>Project Name:</strong> {conflictData?.projectTitle} */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GeneralConflictView;