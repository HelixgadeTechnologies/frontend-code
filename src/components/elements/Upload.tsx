import React, { useState, useRef } from "react";

import {
  useController,
  UseControllerProps,
  FieldValues,
} from "react-hook-form";

// Custom File Upload Component
type FileUploadProps<T extends FieldValues> = {
  label?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  buttonText?: string;
  disabled?: boolean;
  onFileSelected?: (file: File | null) => void;
} & UseControllerProps<T>;

const FileUpload = <T extends FieldValues>({
  name,
  control,
  rules,
  label,
  helperText,
  // accept,
  maxSize,
  className = "",
  buttonText = "Upload",
  disabled = false,
  onFileSelected,
}: FileUploadProps<T>) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { field } = useController({
    name,
    control,
    rules,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);

    if (file) {
      // Check file size
      if (maxSize && file.size > maxSize) {
        setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        setFileName(null);
        field.onChange(null);
        if (onFileSelected) onFileSelected(null);
        return;
      }

      setFileName(file.name);
      field.onChange(file);
      if (onFileSelected) onFileSelected(file);
    } else {
      setFileName(null);
      field.onChange(null);
      if (onFileSelected) onFileSelected(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="flex items-center gap-x-3  text-sm font-medium text-gray-700">
            <span className="bg-off-white-2 h-12 w-12 rounded-full flex items-center justify-center">
              <svg
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5C5 4.46243 7.46243 2 10.5 2C13.1907 2 15.432 3.93318 15.907 6.48668C15.9736 6.84475 16.2297 7.1383 16.5754 7.25295C18.5661 7.9132 20 9.79045 20 12C20 14.7614 17.7614 17 15 17C14.4477 17 14 17.4477 14 18C14 18.5523 14.4477 19 15 19C18.866 19 22 15.866 22 12C22 9.10754 20.2462 6.62697 17.7463 5.55958C16.8909 2.358 13.9717 0 10.5 0C6.35786 0 3 3.35786 3 7.5C3 7.60028 3.00197 7.70014 3.00589 7.79955C1.21048 8.8354 0 10.7754 0 13C0 16.3137 2.68629 19 6 19C6.55228 19 7 18.5523 7 18C7 17.4477 6.55228 17 6 17C3.79086 17 2 15.2091 2 13C2 11.3427 3.00818 9.91848 4.44865 9.31168C4.86549 9.13609 5.11256 8.70256 5.05119 8.25443C5.01748 8.00826 5 7.75644 5 7.5Z"
                  fill="#475367"
                />
                <path
                  d="M10.3356 12.2526C10.7145 11.9158 11.2855 11.9158 11.6644 12.2526L13.1644 13.5859C13.5771 13.9528 13.6143 14.5849 13.2474 14.9977C12.9264 15.3588 12.4025 15.4325 12 15.1996V20C12 20.5523 11.5523 21 11 21C10.4477 21 10 20.5523 10 20V15.1996C9.5975 15.4325 9.07358 15.3588 8.75259 14.9977C8.38567 14.5849 8.42285 13.9528 8.83564 13.5859L10.3356 12.2526Z"
                  fill="#475367"
                />
              </svg>
            </span>

            <div>
              <span> {label}</span>
              {helperText && !error && (
                <p className="text-xs mt-2 text-gray-500">{helperText}</p>
              )}
            </div>
          </label>
        )}

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleButtonClick}
              className={`
              px-4 py-2 text-sm font-medium rounded-md
              ${disabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-primary-200 text-white hover:bg-primary-100"
                }
            `}
              disabled={disabled}
            >
              {buttonText}
            </button>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>

      {fileName && (
        <div className="text-xs rounded-full w-fit p-2 mt-2 bg-gray-100 text-gray-400 flex items-center">
          <span className="truncate max-w-xs">{fileName}</span>
          {!disabled && (
            <button
              type="button"
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setFileName(null);
                field.onChange(null);
                if (onFileSelected) onFileSelected(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      <input
        type="file"
        ref={(e) => {
          fileInputRef.current = e;
          field.ref(e);
        }}
        className="hidden"
        onChange={handleFileChange}
        // accept={accept}
        disabled={disabled}
        onBlur={field.onBlur}
      />
    </div>
  );
};

export default FileUpload;
