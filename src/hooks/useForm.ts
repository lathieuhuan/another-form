import { useEffect, useRef } from "react";
import { FormCenter, FormCenterService } from "../form-center";
import { FormValues, FormRules, DeepPartial, FormDependants } from "../types";

interface UseFormArgs<TFormValues extends FormValues> {
  form?: FormCenter<TFormValues>;
  defaultValues?: DeepPartial<TFormValues>;
  rules?: FormRules<TFormValues>;
  dependants?: FormDependants<TFormValues>;
}

export function useForm<TFormValues extends FormValues = FormValues>(args?: UseFormArgs<TFormValues>) {
  const formCenter = useRef<FormCenter<TFormValues> | undefined>(args?.form);

  if (!formCenter.current) {
    formCenter.current = new FormCenterService<TFormValues>({ defaultValues: args?.defaultValues });
  }

  useEffect(() => {
    const form = formCenter.current as FormCenterService<TFormValues>;

    args?.rules && form.updateFormRules(args.rules);
    args?.dependants && form.updateFormDependencies(args.dependants);
  }, []);

  return formCenter.current;
}
