import PropTypes from "prop-types";
import { Input as MTInput } from "@material-tailwind/react";
import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { className = "", size = "md", label = null, error = null, ...props },
  ref
) {
  return (
    <MTInput
      {...props}
      ref={ref}
      size={size}
      label={label}
      className={
        !label &&
        "placeholder:opacity-100 " +
          (error
            ? `${className} !border-t-red-500 focus:!border-t-red-500`
            : `${className} !border-t-blue-gray-200 focus:!border-t-gray-900`)
      }
      labelProps={
        !label && {
          className: "hidden before:content-none after:content-none",
        }
      }
      area-invalid={error ? "true" : "false"}
      error={error ? true : false}
    />
  );
});

Input.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "lg"]),
  label: PropTypes.string,
  error: PropTypes.string,
};
