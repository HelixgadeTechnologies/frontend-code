import React, { useState, useRef, useEffect, ReactNode } from "react";
import {
  UseFormRegister,
  RegisterOptions,
  UseFormSetValue,
  UseFormClearErrors,
  FieldValues,
  FieldError,
  Path,
  PathValue,
} from "react-hook-form";

interface TagInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  placeholder?: string;
  withCustomLabel?: ReactNode;
  className?: string;
  errors?: Record<string, FieldError | undefined>;
  clearErrors: UseFormClearErrors<TFieldValues>;
  defaultValue?: string[] | string;
  setValue: UseFormSetValue<TFieldValues>;
}

const TagInput = <TFieldValues extends FieldValues>({
  name,
  register,
  registerOptions = {},
  placeholder = "Add tags...",
  withCustomLabel,
  className,
  errors,
  clearErrors,
  defaultValue = [],
  setValue,
}: TagInputProps<TFieldValues>) => {
  const [tags, setTags] = useState<string[]>(
    Array.isArray(defaultValue)
      ? defaultValue.filter((tag) => tag.trim())
      : typeof defaultValue === "string"
      ? defaultValue.split(",").filter((tag) => tag.trim())
      : [],
  );
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setInputValue("");
      setValue(name, newTags as PathValue<TFieldValues, Path<TFieldValues>>);
      clearErrors(name);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue(name, newTags as PathValue<TFieldValues, Path<TFieldValues>>);
    clearErrors(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  useEffect(() => {
    // Update the value of the hidden input when the tags state changes
    setValue(name, tags as PathValue<TFieldValues, Path<TFieldValues>>);
  }, [tags, setValue, name]);

  return (
    <div className="flex flex-col space-y-3 transition-all">
      {withCustomLabel}

      <div className="relative">
        <div
          className={`
            ${
              className ||
              "border border-gray-1 text-black w-full  placeholder:text-[#98A2B3] transition p-2 rounded-md "
            }
            flex flex-wrap items-center gap-2 
            ${errors?.[name] ? "border-red-500" : ""}
          `}
          onClick={() => inputRef.current?.focus()}
        >
          {tags.map((tag, index) => (
            <div
              key={index}
              className="
                bg-[#EFEFEF] text-gray-500 px-4 py-2 rounded 
                flex items-center text-sm
              "
            >
              <span>{tag}</span>
              <button
                type="button"
                className="ml-1 text-blue-800 hover:text-blue-900 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
              >
                ×
              </button>
            </div>
          ))}

          <input
            ref={inputRef}
            type="text"
            className="
              flex-grow outline-none bg-transparent 
              text-gray-500 placeholder:text-gray-60
              text-base
            "
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
          />
        </div>

        {/* Hidden input for react-hook-form registration */}
        <input
          type="hidden"
          {...register(
            name,
            registerOptions as RegisterOptions<
              TFieldValues,
              Path<TFieldValues>
            >,
          )}
          value={tags.join(",")} // Still keeping this for visual purposes
        />
      </div>
    </div>
  );
};

export default TagInput;
