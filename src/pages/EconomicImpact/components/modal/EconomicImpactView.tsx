import { observer } from "mobx-react-lite";
// import React from "react";
import { IEconomicImpactStore } from "../../types/interface";

export const EconomicImpactView = observer(({ close, economicImpactStore }: { close: () => void, economicImpactStore: IEconomicImpactStore }) => {
    const getStatusClass = (option: number | null | undefined): string => {
        switch (option) {
            case 1:
                return "px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium";
            case 2:
                return "px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium";
            case 3:
                return "px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium";
            default:
                return "px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"; // Default class for unknown options
        }
    };

    const getAmenitiesClass = (option: number | null | undefined): string => {
        switch (option) {
          case 1:
            return "px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"; // Healthcare
          case 2:
            return "px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"; // Education
          case 3:
            return "px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"; // Portable Water
          case 4:
            return "px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"; // Electricity
          case 5:
            return "px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"; // Good Roads
          case 6:
            return "px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"; // Market
          case 7:
            return "px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"; // Favourable Business Environment
          default:
            return "px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"; // Default class for unknown options
        }
      };
    return (
        <div className="p-6 ">
            <div className="relative mx-auto bg-white shadow-md rounded-lg p-8">
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    ✕
                </button>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Economic Impact of HCDT in Host Communities
                </h1>
                <p className="text-gray-600 mb-6">
                    Percent of host community members who reported that their income and
                    livelihood have improved as a result of the activities/projects
                    implemented by the HCDT
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        Trust Establishment Status
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        These are your personal details, they are visible to the public
                    </p>

                    <div className="space-y-4">
                        {/* Question 1 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (i). My business is generating more money since they implemented
                                some of the HCDT projects in my community.
                            </p>
                            <span className={getStatusClass(economicImpactStore.selectedEconomicImpact?.businessGrowth)}>
                                {economicImpactStore.selectedEconomicImpact?.businessGrowthStatus}
                            </span>
                        </div>

                        {/* Question 2 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (ii). My income has increased since the implementation of some
                                of the HCDT projects in my community.
                            </p>
                            <span className={getStatusClass(economicImpactStore.selectedEconomicImpact?.incomeIncrease)}>
                                {economicImpactStore.selectedEconomicImpact?.incomeIncreaseStatus}
                            </span>
                        </div>

                        {/* Question 3 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (iii). The implemented HCDT projects have bettered my livelihood
                                and quality of lives.
                            </p>
                            <span className={getStatusClass(economicImpactStore.selectedEconomicImpact?.livelihoodImprove)}>
                                {economicImpactStore.selectedEconomicImpact?.livelihoodImproveStatus}
                            </span>
                        </div>

                        {/* Question 4 */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">
                                (iv). As a result of the HCDT projects, my household/I now have
                                access to these basic amenities than before.
                            </p>
                            <span className={getAmenitiesClass(economicImpactStore.selectedEconomicImpact?.accessAmenities)}>
                                {economicImpactStore.selectedEconomicImpact?.accessAmenitiesStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default EconomicImpactView;