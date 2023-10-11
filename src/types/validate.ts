import { FormValues } from "./form";
import { Path } from "./path";

export type FieldError = string;

type Rule<ValueType> =
  | ValueType
  | {
      value: ValueType;
      message: string;
    };

export type ValidateRule<TFormValues extends FormValues, ValueType> =
  | Rule<ValueType>
  | ((values: TFormValues) => Rule<ValueType>);

export type ValidateRules<TFormValues extends FormValues> = {
  required?: ValidateRule<TFormValues, boolean>;
  validate?: (value: unknown, values: TFormValues) => boolean;
};

export type FormRules<TFormValues extends FormValues> = Partial<Record<Path<TFormValues>, ValidateRules<TFormValues>>>;
