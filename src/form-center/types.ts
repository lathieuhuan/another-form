import {
  FormValues,
  Path,
  PathValue,
  DeepPartial,
  FieldError,
  FormRules,
  FormDependants,
  FormState,
  FormConfig,
} from "../types";

export type FormCenterConstructOptions<TFormValues extends FormValues> = {
  config?: FormConfig;
  initialState?: Partial<FormState>;
  defaultValues?: DeepPartial<TFormValues>;
  rules?: FormRules<TFormValues>;
  /** When a field change, validate its dependants */
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
  /**
   * [false] Do nothing.
   * [true] Validate dependants, if they're invalid and (touched or not empty), emit errors.
   * [touched] Like true, but only emit error when touched.
   * [notEmpty] Like true, but only emit error when not empty.
   * Default to true
   */
  triggerDependants?: boolean | Array<"touched" | "notEmpty">;
};

type SetValue<TFormValues extends FormValues> = <TPath extends Path<TFormValues> = Path<TFormValues>>(
  name: TPath,
  value: PathValue<TFormValues, TPath>,
  options?: SetValueOptions
) => void;

type ValidateOptions = {
  /** Validate but not emit errors. Default to false */
  hideErrors?: boolean;
};

type Validate<TFormValues extends FormValues, TPath extends Path<TFormValues> = Path<TFormValues>> = (
  path: TPath,
  options?: ValidateOptions
) => string[] | boolean;

export type InternalFormCenter<TFormValues extends FormValues = FormValues> = {
  getValue: GetValue<TFormValues>;
  getFieldState: GetFieldState<TFormValues>;
  setValue: SetValue<TFormValues>;
  validate: Validate<TFormValues>;
  resetValues: () => void;
};

export type FormCenter<TFormValues extends FormValues = FormValues> = Pick<
  InternalFormCenter<TFormValues>,
  "getValue" | "setValue" | "validate" | "getFieldState" | "resetValues"
>;
