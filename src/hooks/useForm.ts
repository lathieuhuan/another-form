import { useEffect, useRef } from "react";
import { FormCenter, FormCenterService } from "../form-center";
import { FormValues } from "../types";
import { FormCenterConstructOptions } from "../form-center/types";

type UseFormArgs<TFormValues extends FormValues> = FormCenterConstructOptions<TFormValues> & {
  form?: FormCenter<TFormValues>;
};

export function useForm<TFormValues extends FormValues = FormValues>(args: UseFormArgs<TFormValues> = {}) {
  const formCenter = useRef<FormCenter<TFormValues> | undefined>(args.form);

  if (!formCenter.current) {
    formCenter.current = new FormCenterService<TFormValues>(args);
  }

  useEffect(() => {
    const form = formCenter.current as FormCenterService<TFormValues>;

    args.rules && form.updateFormRules(args.rules);
    args.dependants && form.updateFormDependants(args.dependants);
  }, []);

  return formCenter.current;
}
