import React from 'react';

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
};

export default function Button({ type = "button", children, disabled }: ButtonProps) {
  return (
    <button type={type} disabled={disabled}>
      {children}
    </button>
  );
}
