"use client";

import React, { ChangeEvent, ReactNode } from "react";
import { Input } from "@/components/ui/input";

interface CustomInputProps {
  id?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  type?: string;
}

const CustomInput = ({
  id,
  leftIcon,
  rightIcon,
  value,
  onChange,
  className,
  placeholder,
  onFocus,
  onBlur,
  type,
}: CustomInputProps) => {
  return (
    <div className="bg-white shadow-sm w-full flex relative rounded-lg">
      {leftIcon && (
        <span className="absolute top-1/2 -translate-y-1/2 left-1">
          {leftIcon}
        </span>
      )}
      <Input
        type={type}
        id={id}
        value={value}
        className={`${className} ${leftIcon && `ps-6`} ${rightIcon && `pr-6`}`}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {rightIcon && (
        <span className="absolute top-1/2 -translate-y-1/2 right-2">
          {rightIcon}
        </span>
      )}
    </div>
  );
};

export default CustomInput;
