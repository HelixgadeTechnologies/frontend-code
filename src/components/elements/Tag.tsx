import React from "react";

interface TagProps {
    label: string;
    type: "approve" | "reject";
    onClick?: () => void;
    icon?: string; // Optional prop for an SVG or icon
}

const Tag: React.FC<TagProps> = ({ label, type, onClick, icon }) => {
    const baseStyles = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors";
    const typeStyles =
        type === "approve"
            ? "bg-green-100 text-green-700 hover:bg-green-700 hover:text-white"
            : "bg-red-100 text-red-700 hover:bg-red-700 hover:text-white";

    return (
        <span className={`${baseStyles} ${typeStyles}`} onClick={onClick}>
            {icon && <img src={icon} alt="filter admin table"className="w-4 h-4" />} {/* Render the icon if provided */}
            {label}
        </span>
    );
};

export default Tag;