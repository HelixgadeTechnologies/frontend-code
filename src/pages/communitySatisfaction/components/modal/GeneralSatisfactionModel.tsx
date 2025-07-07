import { observer } from "mobx-react-lite";
import { ISatisfactionStore } from "../../types/interface";
import { createContext, useCallback, useContext } from "react";
import { dashboardStore as DashboardStore } from "../../../dashboard/store/dashboardStore";
import GoBackT from "../../../../components/elements/GoBackT";

const dashboardStoreCtx = createContext(DashboardStore);
const GeneralSatisfactionModel = observer(
    ({ satisfactionStore }: { satisfactionStore: ISatisfactionStore }) => {
        const dashboardStore = useContext(dashboardStoreCtx);
        const getStatusClass = (option: string): string => {
            switch (option) {
                case "STRONGLY DISAGREE":
                    return "px-3 py-1 bg-red-700 text-white rounded-full text-xs font-medium";
                case "AGREE":
                    return "px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium";
                case "SLIGHTLY AGREE":
                    return "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium";
                case "DISAGREE":
                    return "px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium";
                case "TRUE":
                    return "px-3 py-1 bg-green-700 text-white rounded-full text-xs font-medium";
                case "IN PROGRESS":
                    return "px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium";
                case "NOT TRUE":
                    return "px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium";
                case "STRONGLY AGREE":
                    return "px-3 py-1 bg-green-700 text-white rounded-full text-xs font-medium";
                default:
                    return "px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium";
            }
        };

        const closeTable = useCallback(() => {
            dashboardStore.selectedTab = 5;
        }, [dashboardStore]);

        return (
            <>
                <GoBackT action={closeTable} page="Average Community Satisfaction table" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    Average Community Satisfaction Status
                </h1>
                <p className="text-xs text-gray-600 mb-4" >
                    These are details for a single satisfaction, they are visible to the public
                </p>

                <div className="p-4 flex items-center justify-center bg-white shadow-md rounded-lg">

                    <div className="relative w-full">
                        {/* Header Section */}
                        {/* Questions Section */}
                        <div className="space-y-4">
                            {/* Question 1 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (i). We feel well-informed about the implemented projects by the Trust governing structure.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.infoProjectsStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.infoProjectsStatus}
                                </span>
                            </div>

                            {/* Question 2 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (ii). We feel the community has been sufficiently consulted about the implemented projects by the Trust governing structure.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.communityConsultStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.communityConsultStatus}
                                </span>
                            </div>

                            {/* Question 3 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (iii). We feel sufficient opportunities have been given to local community members to participate in the HCDT projects.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.localParticipationStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.localParticipationStatus}
                                </span>
                            </div>

                            {/* Question 4 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (iv). There is a clear mechanism to report concerns to the governing structures and community complaints/concerns are efficiently addressed.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.reportMechanismStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.reportMechanismStatus}
                                </span>
                            </div>

                            {/* Question 5 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (v). The way the governing structures have acted has minimized the potential for conflict in my community.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.conflictMinimizationStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.conflictMinimizationStatus}
                                </span>
                            </div>
                            {/* Question 6 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (vi) Communities Satisfaction with the the Settlor's.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.settlorActionStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.settlorActionStatus}
                                </span>
                            </div>
                            {/* Question 7 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (vii)   Communities Satisfaction with the the NUPRC’s.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.nuprcActionStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.nuprcActionStatus}
                                </span>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800 mt-6 mb-2">
                            Existence, and activeness of sustainability management structure/committees established by the Trust
                        </h1>
                        <p className="text-xs text-gray-600 mb-4">
                            These are your personal details, they are visible to the public
                        </p>

                        <div className="space-y-4">
                            {/* Question 6 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (i). The Trust commissioned and handed over completed projects <br />
                                    in our community to the community leadership.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.projectHandoverStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.projectHandoverStatus}
                                </span>
                            </div>

                            {/* Question 7 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (ii). The Trust has consulted our community leadership to discuss or develop maintenance plans for all the completed projects implemented in our community.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.maintenanceConsultStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.maintenanceConsultStatus}
                                </span>
                            </div>

                            {/* Question 8 */}
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-700" style={{ width: "600px" }}>
                                    (iii). The Trust implemented or is implementing at least one income-generating project for the host communities.
                                </p>
                                <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.incomeProjectStatus!)}>
                                    {satisfactionStore.selectedSatisfaction?.incomeProjectStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

export default GeneralSatisfactionModel;
// export default CommunitySatisfactionView;