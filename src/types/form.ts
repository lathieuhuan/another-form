import { FieldError } from "./validate";
import { Path } from "./path";

export type FormValues = Record<string, any>;

export type FormErrors<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, FieldError[]>>;

export type FormDependants<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, Path<TFormValues>[]>>;

export type TouchedFields<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, boolean>>;
