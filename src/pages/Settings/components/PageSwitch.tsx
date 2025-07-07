import React, { JSX, useState } from "react";
import { RoutedTabs } from "../../../components/layouts";
import { chatBlueIcon, timerIcon } from "../../../assets/icons";
interface AdminSwitchProps {
    type: string;
    // type: "Admin" | "DRA" | "NUPRC" | "Settlor";
    approvedCount: number;
    pendingCount: number;
    renderApprovedTable: () => JSX.Element;
    renderPendingTable: () => JSX.Element;
}

const PageSwitch: React.FC<AdminSwitchProps> = ({
    type,
    // type,
    approvedCount,
    pendingCount,
    renderApprovedTable,
    renderPendingTable,
}) => {
    const [activeTab, setActiveTab] = useState<"approved" | "pending">("approved");

    return (
        <div>
            {/* Switch Buttons */}
            <section className="mt-5 flex items-center gap-x-3">
                <div
                    className={`w-fit flex items-center gap-x-2 p-3 rounded-lg border cursor-pointer ${activeTab === "approved"
                        ? "bg-primary-200/40 border-primary-200"
                        : "bg-off-white-2 border-gray-1"
                        }`}
                    onClick={() => setActiveTab("approved")}
                >
                    <img src={chatBlueIcon} alt="approved admin" />
                    <span className="font-medium text-sm text-black">Approved {type}</span>
                    <span
                        className={`px-2 py-1 rounded-3xl font-medium text-xs ${activeTab === "approved"
                            ? "bg-primary-200 text-white"
                            : "bg-gray-5 text-black"
                            }`}
                    >
                        {approvedCount}
                    </span>
                </div>

                <div
                    className={`w-fit flex items-center gap-x-2 p-3 rounded-lg border cursor-pointer ${activeTab === "pending"
                        ? "bg-primary-200/40 border-primary-200"
                        : "bg-off-white-2 border-gray-1"
                        }`}
                    onClick={() => setActiveTab("pending")}
                >
                    <img src={timerIcon} alt="pending admin" />
                    <span className="font-medium text-sm text-black">Pending {type}</span>
                    <span
                        className={`px-2 py-1 rounded-3xl font-medium text-xs ${activeTab === "pending"
                            ? "bg-primary-200 text-white"
                            : "bg-gray-5 text-black"
                            }`}
                    >
                        {pendingCount}
                    </span>
                </div>
            </section>

            {/* Render Tables */}
            <div className="mt-14">
                <RoutedTabs />
                <section>
                    {activeTab === "approved" ? renderApprovedTable() : renderPendingTable()}
                </section>
            </div>
        </div>
    );
};

export default PageSwitch;