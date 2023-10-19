import { FormEvent } from 'react';
import { FormCenter } from '../form-center';
import { useForm, useFormState } from '../hooks';
import { FormValues } from '../types';
import cloneObject from '../utils/cloneObject';
import { FormCenterProvider } from './FormCenterProvider';

interface FormProps<TFormValues extends FormValues> {
  form?: FormCenter<TFormValues>;
  className?: string;
  children: React.ReactNode;
  onSubmit?: (values: TFormValues) => void;
}

export function Form<TFormValues extends FormValues = FormValues>({
  form,
  onSubmit,
  ...formProps
}: FormProps<TFormValues>) {
  const formCenter = useForm<TFormValues>({ form });
  const fillNo = useFormState('fillNo', formCenter);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(cloneObject(formCenter.getValue()));
  };

  return (
    <FormCenterProvider key={fillNo} formCenter={formCenter}>
      <form {...formProps} onSubmit={handleSubmit} />
    </FormCenterProvider>
  );
}
