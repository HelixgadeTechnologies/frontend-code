import { observer } from "mobx-react-lite";
import { ISatisfactionStore } from "../../types/interface";

const CommunitySatisfactionView = observer(
    ({ close, satisfactionStore }: { close: () => void; satisfactionStore: ISatisfactionStore }) => {
        const getStatusClass = (option: string): string => {
            switch (option) {
                case "STRONGLY DISAGREE":
                    return "px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium";
                case "AGREE":
                    return "px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium";
                case "SLIGHTLY Agree":
                    return "px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium";
                case "DISAGREE":
                    return "px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium";
                case "TRUE":
                    return "px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium";
                case "IN PROGRESS":
                    return "px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium";
                case "NOT TRUE":
                    return "px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium";
                default:
                    return "px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium";
            }
        };

        return (
            <div className="p-6 bg-gray-100 flex items-center justify-center">
                <div className="relative w-full mx-auto bg-white shadow-md rounded-lg p-6 sm:p-8">
                    {/* Section 1: Trust Establishment Status */}
                    <button
                        onClick={close}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                        Average Community Satisfaction Status
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        These are your personal details, they are visible to the public
                    </p>

                    <div className="space-y-6">
                        {/* Question 1 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (i). We feel well-informed about the implemented projects by the Trust governing structure.
                            </p>
                            <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.incomeProjectStatus!)}>
                                {satisfactionStore.selectedSatisfaction?.incomeProjectStatus}
                            </span>
                        </div>

                        {/* Question 2 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (ii). We feel the community has been sufficiently consulted about the implemented projects by the Trust governing structure.
                            </p>
                            <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.communityConsultStatus!)}>
                                {satisfactionStore.selectedSatisfaction?.communityConsultStatus}
                            </span>
                        </div>

                        {/* Question 3 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (iii). We feel sufficient opportunities have been given to local community members to participate in the HCDT projects.
                            </p>
                            <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.localParticipationStatus!)}>
                                {satisfactionStore.selectedSatisfaction?.localParticipationStatus}
                            </span>
                        </div>

                        {/* Question 4 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (iv). There is a clear mechanism to report concerns to the governing structures and community complaints/concerns are efficiently addressed.
                            </p>
                            <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.reportMechanismStatus!)}>
                                {satisfactionStore.selectedSatisfaction?.reportMechanismStatus}
                            </span>
                        </div>

                        {/* Question 5 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (v). The way the governing structures have acted has minimized the potential for conflict in my community.
                            </p>
                            <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.conflictMinimizationStatus!)}>
                                {satisfactionStore.selectedSatisfaction?.conflictMinimizationStatus}
                            </span>
                        </div>
                    </div>

                    {/* Section 2: Sustainability Management Structures */}
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-8 mb-4">
                        Existence, and activeness of sustainability management structure/committees established by the Trust
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        These are your personal details, they are visible to the public
                    </p>

                    <div className="space-y-6">
                        {/* Question 6 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (i). The Trust commissioned and handed over completed projects in our community to the community leadership.
                            </p>
                            <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.projectHandoverStatus!)}>
                                {satisfactionStore.selectedSatisfaction?.projectHandoverStatus}
                            </span>
                        </div>

                        {/* Question 7 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (ii). The Trust has consulted our community leadership to discuss or develop maintenance plans for all the completed projects implemented in our community.
                            </p>
                            <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.maintenanceConsultStatus!)}>
                                {satisfactionStore.selectedSatisfaction?.maintenanceConsultStatus}
                            </span>
                        </div>

                        {/* Question 8 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (iii). The Trust implemented or is implementing at least one income-generating project for the host communities.
                            </p>
                            <span className={getStatusClass(satisfactionStore.selectedSatisfaction?.incomeProjectStatus!)}>
                                {satisfactionStore.selectedSatisfaction?.incomeProjectStatus}
                            </span>
                        </div>
                    </div>

                    {/* Close Button
          <div className="flex justify-end mt-8">
            <button
              onClick={close}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div> */}
                </div>
            </div>
        );
    }
);

export default CommunitySatisfactionView;