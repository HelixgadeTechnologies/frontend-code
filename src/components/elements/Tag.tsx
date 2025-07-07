import React from "react";

interface TagProps {
    label: string;
    type: "approve" | "reject" | "default";
    onClick?: () => void;
    icon?: React.ReactNode | string; // Accepts ReactNode or string URL
}

const Tag: React.FC<TagProps> = ({ label, type, onClick, icon }) => {
    const baseStyles = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors";
    const typeStyles =
        type === "approve"
            ? "bg-green-100 text-green-700 hover:bg-green-700 hover:text-white"
            : type === "reject"
            ? "bg-red-100 text-red-700 hover:bg-red-700 hover:text-white"
            : "border border-blue-500 text-blue-500 rounded-full text-sm font-medium cursor-pointer transition-colors hover:bg-blue-700 hover:text-white";

    return (
        <span className={`${baseStyles} ${typeStyles}`} onClick={onClick}>
            {icon &&
                (typeof icon === "string" ? (
                    <img src={icon} alt="tag icon" className="w-4 h-4" />
                ) : (
                    <span className="w-4 h-4 flex items-center">{icon}</span>
                ))}
            {label}
        </span>
    );
};

export default Tag;