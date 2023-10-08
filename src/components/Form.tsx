import { FormEvent } from "react";
import { FormValues } from "../types";
import { useForm } from "../hooks";
import { FormCenter } from "../form-center";
import { FormCenterProvider } from "./FormCenterProvider";

interface FormProps<TFormValues extends FormValues> {
  form?: FormCenter<TFormValues>;
  className?: string;
  children: React.ReactNode;
  onSubmit?: (values: TFormValues) => void;
}

export function Form<TFormValues extends FormValues = FormValues>(props: FormProps<TFormValues>) {
  const formCenter = useForm<TFormValues>({ form: props.form });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit?.(formCenter.getValue());
  };

  return (
    <FormCenterProvider formCenter={formCenter}>
      <form {...props} onSubmit={handleSubmit} />
    </FormCenterProvider>
  );
}
