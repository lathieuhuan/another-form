import { useEffect, useState } from 'react';
import { FormCenterService, FormCenter } from '../form-center';
import { FormValues, Path } from '../types';

export function useWatch<
  TFormValues extends FormValues = FormValues,
  TPath extends Path<TFormValues> = Path<TFormValues>,
>(path: TPath, formCenter: FormCenter<TFormValues>) {
  const [value, setValue] = useState(() => formCenter.getValue(path));

  useEffect(() => {
    return (formCenter as FormCenterService<TFormValues>)._watchValue(path, (value) =>
      setValue(value),
    );
  }, []);

  return value;
}
