import { FieldError } from './validate';
import { Path } from './path';

export type FormConfig = {
  /** Delay time for form to update its isValid state. Default to 150ms */
  validUpdateDelay: number;
  /**
   * If true, run all validation and show all errors.
   * If false, stop at and show only first error.
   * Default to false
   */
  multiErrors: boolean;
};

export type FormState = {
  /** Is any field touched */
  isTouched: boolean;
  /** Is all fields valid */
  isValid: boolean;
  /**  */
  fillNo: number;
};

export type FormValues = Record<string, any>;

export type FormErrors<TFormValues extends FormValues> = Partial<
  Record<Path<TFormValues>, FieldError[]>
>;

export type FormDependants<TFormValues extends FormValues> = Partial<
  Record<Path<TFormValues>, Path<TFormValues>[]>
>;

export type TouchedFields<TFormValues extends FormValues> = Partial<
  Record<Path<TFormValues>, boolean>
>;

export type ValidFields<TFormValues extends FormValues> = Partial<
  Record<Path<TFormValues>, boolean>
>;
