import { createContext, useContext } from 'react';
import { FormValues } from '../types';
import { FormCenter } from '../form-center';

export const FormCenterContext = createContext<FormCenter | null>(null);

export function useFormCenter<TFormValues extends FormValues = FormValues>(
  form?: FormCenter<TFormValues>,
) {
  const formCenter = useContext(FormCenterContext);

  if (!form && !formCenter) {
    throw new Error('useFormCenter must be used inside FormCenterProvider');
  }
  return form || (formCenter as FormCenter<TFormValues>);
}
