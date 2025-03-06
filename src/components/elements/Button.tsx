import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonTypes {
  loading?: boolean;
  disabled?: boolean;
  padding?: string;
  href?: string;
  buttonText: string;
  textTransform?: string;
  noBg?: boolean;
  border?: boolean;
  bg?: string;
  width?: string;
  className?: string;
  onClick?: () => void;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
  fontAttr?: string;
  type?: "submit" | "reset" | "button" | undefined;
}

const Button = ({
  type,
  loading,
  disabled,
  href,
  padding,
  onClick,
  iconRight,
  iconLeft,
  buttonText,
  textTransform,
  noBg,
  border,
  bg,
  width,
  fontAttr,
  ...props
}: ButtonTypes) => {
  return (
    <>
      {href ? (
        <button
          type={type}
          className={`  ${
            noBg
              ? "bg-transparent text-primary-700 hover:text-white transition-colors"
              : border
              ? "border border-primary-700 bg-white text-primary-700"
              : ` ${
                  bg ? bg : "bg-primary-200 text-white hover:bg-primary-200"
                }   `
          }    ${padding}  ${width ? width : "w-full"}  ${
            fontAttr ? fontAttr : "font-semibold text-base"
          } flex  items-center justify-center gap-2 capitalize rounded-lg`}
          onClick={onClick}
          disabled={disabled || loading}
          {...props}
        >
          <Link
            to={href}
            className="!flex w-full items-center justify-center gap-2 rounded-lg"
          >
            {iconLeft && <>{iconLeft}</>}
            <span className={textTransform}>{buttonText}</span>
            {iconRight && <>{iconRight}</>}
          </Link>
        </button>
      ) : (
        <button
          type={type}
          className={`  ${
            noBg
              ? "bg-transparent text-primary-700  transition-colors"
              : border
              ? "border border-primary-700 bg-white text-primary-700"
              : ` ${
                  bg ? bg : "bg-primary-200 text-white hover:bg-primary-200"
                }   `
          }    ${padding}  ${width ? width : "w-full"} ${
            fontAttr ? fontAttr : "font-semibold text-base"
          } flex  items-center justify-center gap-2 capitalize rounded-lg`}
          onClick={onClick}
          disabled={disabled || loading}
          {...props}
        >
          {iconLeft && <>{iconLeft}</>}
          <span className={textTransform}>{buttonText}</span>
          {iconRight && <>{iconRight}</>}
        </button>
      )}
    </>
  );
};

export default Button;
