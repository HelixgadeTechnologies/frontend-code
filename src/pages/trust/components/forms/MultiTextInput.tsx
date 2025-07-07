import React, { useState } from "react";

const MultiTextInput = ({ label, placeholder, onChange, value = [] }: {
    label: string;
    placeholder?: string;
    onChange: (values: string[]) => void;
    value?: Array<string>;
}) => {
    const [input, setInput] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && input.trim()) {
            e.preventDefault();
            if (!value.includes(input.trim())) {
                onChange([...value, input.trim()]);
            }
            setInput("");
        }
    };

    const removeItem = (idx: number) => {
        const newArr = value.filter((_, i) => i !== idx);
        onChange(newArr);
    };

    return (
        <div>
            <label className="block text-gray-700 mb-1">{label}</label>
            <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white">
                {value.length > 0 && value.map((val, idx) => (
                    <span key={idx} className="bg-primary-100 text-white px-2 py-1 rounded flex items-center gap-1">
                        {val}
                        <button
                            type="button"
                            className="text-red-500 ml-1"
                            onClick={() => removeItem(idx)}
                            aria-label="Remove"
                        >
                            &times;
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    className="flex-1 border-none outline-none py-1"
                    placeholder={placeholder}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

export default MultiTextInput;