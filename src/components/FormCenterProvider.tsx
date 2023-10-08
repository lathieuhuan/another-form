import { FormValues } from "../types";
import { FormCenter } from "../form-center";
import { FormCenterContext } from "../hooks";

type FormCenterProviderProps<TFormValues extends FormValues> = {
  formCenter: FormCenter<TFormValues>;
  children: React.ReactNode;
};
export function FormCenterProvider<TFormValues extends FormValues = FormValues>(
  props: FormCenterProviderProps<TFormValues>
) {
  return (
    <FormCenterContext.Provider value={props.formCenter as FormCenter}>{props.children}</FormCenterContext.Provider>
  );
}
