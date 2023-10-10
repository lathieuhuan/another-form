import { FormValues, Path, PathValue, DeepPartial, FieldError, FormRules, FormDependants, FormState } from "../types";

export type FormCenterConstructOptions<TFormValues extends FormValues> = {
  initialState?: Partial<FormState>;
  defaultValues?: DeepPartial<TFormValues>;
  rules?: FormRules<TFormValues>;
  dependants?: FormDependants<TFormValues>;
};

export type ValueWatcher<TFormValues extends FormValues> = <TPath extends Path<TFormValues> = Path<TFormValues>>(
  value: PathValue<TFormValues, TPath>
) => void;

export type FieldState<TFormValues extends FormValues, TPath extends Path<TFormValues>> = {
  value: PathValue<TFormValues, TPath>;
  errors?: FieldError[];
  isTouched: boolean;
  isValid: boolean;
  isDisabled: boolean;
  isRequired: boolean;
};

export type FieldWatcher<TFormValues extends FormValues, TPath extends Path<TFormValues> = Path<TFormValues>> = (
  state: Partial<FieldState<TFormValues, TPath>>
) => void;

type GetValue<TFormValues extends FormValues = FormValues> = {
  <TPath extends Path<TFormValues>>(path: TPath): PathValue<TFormValues, TPath>;
  (): TFormValues;
};

type GetFieldState<TFormValues extends FormValues = FormValues> = <TPath extends Path<TFormValues>>(
  path: TPath
) => FieldState<TFormValues, TPath>;

type SetValueOptions = {
  /** Validate dependants if they're touched, use 'force' to bypass touched check */
  triggerDependants?: boolean | "force";
};

type SetValue<TFormValues extends FormValues> = <TPath extends Path<TFormValues> = Path<TFormValues>>(
  name: TPath,
  value: PathValue<TFormValues, TPath>,
  options?: SetValueOptions
) => void;

type Validate<TFormValues extends FormValues, TPath extends Path<TFormValues> = Path<TFormValues>> = (
  path: TPath
) => string[] | boolean;

export type InternalFormCenter<TFormValues extends FormValues = FormValues> = {
  getValue: GetValue<TFormValues>;
  getFieldState: GetFieldState<TFormValues>;
  setValue: SetValue<TFormValues>;
  validate: Validate<TFormValues>;
};

export type FormCenter<TFormValues extends FormValues = FormValues> = Pick<
  InternalFormCenter<TFormValues>,
  "getValue" | "setValue" | "validate" | "getFieldState"
>;
