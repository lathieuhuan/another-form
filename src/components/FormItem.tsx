import { ChangeEvent, useEffect, useState } from "react";
import { FieldState, FormCenter, FormCenterService } from "../form-center";
import { useFormCenter } from "../hooks";
import { FieldError, FormValues, Path, PathValue } from "../types";

interface IFormItemProps<TFormValues extends FormValues, TPath extends Path<TFormValues>> {
  form?: FormCenter<TFormValues>;
  name: TPath;
  children: (
    control: {
      value: PathValue<TFormValues, TPath>;
      onChange: (...e: any[]) => void;
      onBlur: () => void;
    },
    state: {
      errors?: FieldError[];
    }
  ) => React.ReactElement | null;
}

type LocalFieldState<TFormValues extends FormValues, TPath extends Path<TFormValues>> = Pick<
  FieldState<TFormValues, TPath>,
  "value" | "errors"
>;

export function FormItem<
  TFormValues extends FormValues = FormValues,
  TPath extends Path<TFormValues> = Path<TFormValues>
>({ form, name, children }: IFormItemProps<TFormValues, TPath>) {
  const formCenter = useFormCenter(form) as FormCenterService<TFormValues>;
  const [fieldState, setFieldState] = useState<LocalFieldState<TFormValues, TPath>>({
    value: formCenter.getFieldState(name).value,
  });

  useEffect(() => {
    return formCenter._watchField(name, (newState) =>
      setFieldState((oldState) => {
        const { value, errors } = { ...oldState, ...newState };
        return { value, errors };
      })
    );
  }, [name]);

  const handleChange = (...e: any[]) => {
    const value = e[0];
    let newValue;

    if (typeof value === "object" && "target" in value) {
      newValue = (value as ChangeEvent<HTMLInputElement>)?.target?.value;
    } else {
      newValue = value;
    }

    formCenter.setValue(name, newValue === "" ? undefined : newValue, { triggerDependants: true });
    formCenter.validate(name);
  };

  const handleBlur = () => {
    formCenter.updateTouched(name, true);
  };

  return children(
    {
      value: fieldState.value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
    {
      errors: fieldState.errors,
    }
  );
}
