import { FieldError } from "./validate";
import { Path } from "./path";

export type FormState = {
  isTouched: boolean;
  isValid: boolean;
};

export type FormValues = Record<string, any>;

export type FormErrors<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, FieldError[]>>;

export type FormDependants<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, Path<TFormValues>[]>>;

export type TouchedFields<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, boolean>>;

export type ValidFields<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, boolean>>;
