import { observer } from "mobx-react-lite";
import { IConflictView } from "../../types/interface";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Enable the plugin
dayjs.extend(relativeTime);

const ConflictDashboardView = observer(({ close, conflict }: { close: () => void, conflict: IConflictView }) => {
    const conflictData: IConflictView | null = conflict;

    return (
        <div className="p-4 bg-gray-100">
            {/* Header Section */}
            <div className="relative bg-white p-4 rounded-lg shadow-md mb-4">
                <button
                    onClick={close}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    ✕
                </button>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-base font-bold text-gray-800">
                            {conflictData?.userLastName + " " + conflictData?.userFirstName}
                        </h1>
                        {/* <p className="text-xs text-gray-600">
                            Project ID: {"CF-" + conflictData?.conflictId}
                        </p> */}
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Active
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <p className="text-xs text-gray-600">
                        <strong>Email:</strong> {conflictData?.userEmail}
                    </p>
                    <p className="text-xs text-gray-600">
                        <strong>Project Age:</strong>{" "}
                        {dayjs(conflictData?.projectCreateAt).fromNow()}
                    </p>
                    <p className="text-xs text-gray-600">
                        <strong>Report Date:</strong>{" "}
                        {dayjs(conflictData?.createAt).format("MMM DD, YYYY hh:mmA")}
                    </p>
                    <p className="text-xs text-gray-600">
                        <strong>Phone Number:</strong> {conflictData?.userPhoneNumber}
                    </p>
                </div>
            </div>

            {/* Conflict Details Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold text-gray-800">Conflict Details</h2>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        {conflictData?.conflictStatusName}
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-2">
                        <p className="text-xs text-gray-600">
                            <strong>Cause of conflict:</strong> {conflictData?.causeOfConflictName}
                        </p>
                        <p className="text-xs text-gray-600">
                            <strong>Parties Involved:</strong> {conflictData?.partiesInvolveName}
                        </p>
                        <p className="text-xs text-gray-600">
                            <strong>Issues Addressed by:</strong> {conflictData?.issuesAddressByName}
                        </p>
                        <p className="text-xs text-gray-600">
                            <strong>State of the court litigation:</strong>{" "}
                            {conflictData?.courtLitigationStatusName}
                        </p>
                        <p className="text-xs text-gray-600">
                            <strong>Status of the Conflict:</strong> {conflictData?.conflictStatusName}
                        </p>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                        <p className="text-xs text-gray-600">
                            <strong>Narrate Issues:</strong> {conflictData?.narrateIssues}
                        </p>
                        <p className="text-xs text-gray-600">
                            <strong>Project Name:</strong> {conflictData?.projectTitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ConflictDashboardView;