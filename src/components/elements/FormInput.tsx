import { useState } from "react";

import {
  UseFormRegister,
  FieldError,
  RegisterOptions,
  FieldErrors,
} from "react-hook-form";

import { eyeIcon } from "../../assets/icons";

interface FormValues {
  [key: string]: string | undefined;
}

interface FormItemProps {
  label?: string;
  name: string; // Add this to properly type the register prop
  containerClassName?: string;
  labelClassName?: string;
  register: UseFormRegister<FormValues>;
  error?: FieldError | FieldErrors | null; // Updated error type
  errorMessage?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  disabled?: boolean;
  showEye?: boolean;
  required?: boolean;
  registerOptions?: RegisterOptions; // Add this for register options
  [propName: string]: unknown;
}

const FormInput = ({
  label,
  name, // Add this
  labelClassName,
  containerClassName,
  register,
  error,
  errorMessage,
  placeholder,
  textarea,
  type = "text",
  disabled,
  showEye,

  registerOptions,
  ...props
}: FormItemProps) => {
  const [show, setShow] = useState(false);
  const inputType = type === "password" && show ? "text" : type;

  return (
    <div className={containerClassName || ""}>
      <label
        className={`block text-base text-primary-100 font-medium mb-2  ${labelClassName}`}
      >
        {label}
      </label>

      {textarea ? (
        <div className="relative">
          <textarea
            rows={5}
            className={`text-sm p-3 rounded-md ${
              disabled
                ? "border-transparent bg-gray-2 text-gray-6 placeholder:text-gray-6"
                : ""
            } border border-gray-1 text-black w-full  placeholder:text-[#98A2B3] transition ${
              error ? "border border-red-400 focus:outline-0 bg-white" : ""
            } `}
            placeholder={placeholder}
            {...register(name, registerOptions)}
            disabled={disabled}
            {...props}
          ></textarea>
        </div>
      ) : (
        <div className="relative">
          <input
            className={`text-sm p-3 rounded-md ${
              disabled
                ? " bg-off-white-2 text-[#98A2B3] placeholder:text-primary-200"
                : ""
            } border border-gray-1 text-black w-full  placeholder:text-[#98A2B3] transition ${
              error ? "border border-red-400 focus:outline-0 bg-white" : ""
            } `}
            placeholder={placeholder}
            {...register(name, registerOptions)}
            disabled={disabled}
            type={inputType}
            {...props}
          />

          {showEye && type === "password" && (
            <span
              onClick={() => setShow(!show)}
              className="absolute top-[14px] right-2.5 cursor-pointer flex items-center justify-center"
            >
              <img src={eyeIcon} alt="toggle password visibility" />
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="text-red-400 text-xs md:text-sm pt-1 md:pt-0.5 flex items-center">
          <span>{errorMessage || (error as FieldError)?.message}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;
