import { useEffect, useState } from "react";
import { FormState, FormValues } from "../types";
import { FormCenter, FormCenterService } from "../form-center";
import { useFormCenter } from "./useFormCenter";

export function useFormState<TFormValues extends FormValues, TKey extends keyof FormState>(
  key: TKey,
  form?: FormCenter<TFormValues>
): FormState[TKey];
export function useFormState<TFormValues extends FormValues>(
  key?: undefined,
  form?: FormCenter<TFormValues>
): FormState;
export function useFormState<TFormValues extends FormValues, TKey extends keyof FormState>(
  key?: TKey,
  form?: FormCenter<TFormValues>
): FormState[TKey] | FormState {
  const formCenter = useFormCenter(form) as FormCenterService;
  const [formState, setFormState] = useState(formCenter._getFormState(key));

  useEffect(() => {
    return formCenter._watchFormState((newFormState) => {
      setFormState(key ? newFormState[key] : newFormState);
    });
  }, [key]);

  return formState;
}
