import { useController, UseControllerProps, FieldValues } from "react-hook-form";

type CheckboxOption = {
  value: string;
  label: string;
};

type CustomCheckboxGroupProps<T extends FieldValues> = {
  options: CheckboxOption[];
  label?: string;
  className?: string;
  disabled?: boolean;
} & UseControllerProps<T>;

const CustomCheckboxGroup = <T extends FieldValues>({
  name,
  control,
  rules,
  options,
  label,
  className = "",
  disabled = false,
}: CustomCheckboxGroupProps<T>) => {
  const { field, fieldState } = useController({ name, control, rules });

  const selected: string[] = field.value
    ? field.value.split(",").filter(Boolean)
    : [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    field.onChange(next.length ? next.join(",") : "");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-6">
        {options.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`${name}-${option.value}`}
                className="hidden"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(option.value)}
                onBlur={field.onBlur}
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className={`relative pl-8 py-2 cursor-pointer flex items-center text-sm ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 rounded border ${
                    checked ? "border-primary-200 bg-white" : "border-gray-300 bg-white"
                  } ${disabled ? "border-gray-200" : ""}`}
                />
                {checked && (
                  <span className="absolute left-[3px] top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-sm bg-primary-200" />
                )}
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {fieldState.error && (
        <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
      )}
    </div>
  );
};

export default CustomCheckboxGroup;
