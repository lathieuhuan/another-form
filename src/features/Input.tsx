import { InputHTMLAttributes } from "react";

export function Input({ value = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input value={value} {...rest} />;
}
