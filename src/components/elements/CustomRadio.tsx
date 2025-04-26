import React from "react";
import { useController, UseControllerProps, FieldValues } from "react-hook-form";

type RadioOption = {
  value: string;
  label: string;
};

type CustomRadioProps<T extends FieldValues> = {
  options: RadioOption[];
  label?: string;
  className?: string;
  disabled?: boolean;
} & UseControllerProps<T>;

const CustomRadio = <T extends FieldValues>({
  name,
  control,
  rules,
  options,
  label,
  className = "",
  disabled = false,
}: CustomRadioProps<T>) => {
  const { field } = useController({
    name,
    control,
    rules,
  });

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex space-x-6">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              className="hidden"
              checked={field.value === option.value}
              disabled={disabled}
              onChange={() => field.onChange(option.value)}
              onBlur={field.onBlur}
              name={name}
              ref={field.ref}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={`relative pl-8 py-2 cursor-pointer flex items-center text-sm ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border ${
                  field.value === option.value
                    ? "border-primary-200 bg-white"
                    : "border-gray-300 bg-white"
                } ${disabled ? "border-gray-200" : ""}`}
              />
              {field.value === option.value && (
                <span className="absolute left-[5px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary-200" />
              )}
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomRadio;