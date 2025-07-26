import React from "react";

type InputBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  type: "text" | "password";
  placeholder: string;
};

export const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ type, placeholder, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        {...rest}
      />
    );
  }
);
