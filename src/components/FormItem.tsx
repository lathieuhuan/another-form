import { ChangeEvent, useEffect, useState } from 'react';
import { FieldState, FormCenter, FormCenterService } from '../form-center';
import { useFormCenter } from '../hooks';
import { FormValues, Path, PathValue } from '../types';

type LocalFieldState<TFormValues extends FormValues, TPath extends Path<TFormValues>> = Pick<
  FieldState<TFormValues, TPath>,
  'value' | 'errors' | 'isRequired' | 'isDisabled'
>;

export type FormItemProps<
  TFormValues extends FormValues,
  TPath extends Path<TFormValues> = Path<TFormValues>,
> = {
  form?: FormCenter<TFormValues>;
  name: TPath;
  valueProps?: string | ((value: any) => any);
  children: (
    control: {
      name: string;
      value: PathValue<TFormValues, TPath>;
      onChange: (...e: any[]) => void;
      onBlur: () => void;
    },
    state: Omit<LocalFieldState<TFormValues, TPath>, 'value'>,
  ) => React.ReactElement | null;
};

const sanitizeState = <TFormValues extends FormValues, TPath extends Path<TFormValues>>(
  state: LocalFieldState<TFormValues, TPath>,
): LocalFieldState<TFormValues, TPath> => {
  return {
    value: state.value,
    errors: state.errors,
    isRequired: state.isRequired,
    isDisabled: state.isDisabled,
  };
};

export function FormItem<
  TFormValues extends FormValues = FormValues,
  TPath extends Path<TFormValues> = Path<TFormValues>,
>({ form, name, valueProps, children }: FormItemProps<TFormValues, TPath>) {
  const formCenter = useFormCenter(form) as FormCenterService<TFormValues>;
  const [{ value, ...state }, setFieldState] = useState(() =>
    sanitizeState(formCenter._getInitialFieldState(name)),
  );

  useEffect(() => {
    return formCenter._registerField(name, (newState) => {
      setFieldState((oldState) => sanitizeState(Object.assign(oldState, newState)));
    });
  }, [name]);

  const handleChange = (...e: any[]) => {
    const value = e[0];
    let newValue: any;

    if (typeof valueProps === 'function') {
      newValue = valueProps(value);
    } else {
      let getValue: string | undefined;

      if (typeof value === 'object' && 'target' in value) {
        newValue = (value as ChangeEvent<HTMLInputElement>)?.target;
        getValue = 'value';
      } else {
        newValue = value;
      }
      getValue = valueProps ?? getValue;

      if (getValue && typeof newValue === 'object') {
        newValue = newValue[getValue];
      }
    }

    formCenter.setFieldTouched(name, true);
    formCenter.setValue(name, newValue === '' ? undefined : newValue);
    formCenter.validate(name);
  };

  const handleBlur = () => {
    // formCenter.setTouchedField(name, true);
  };

  return children(
    {
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
    state,
  );
}
