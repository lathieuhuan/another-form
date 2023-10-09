import { FormValues, ValidateRules } from "../types";
import isNullOrUndefined from "../utils/isNullOrUndefined";

export const validateField = <TFormValues extends FormValues>(
  rules: ValidateRules<TFormValues>,
  fieldValue: any,
  formValues: TFormValues
) => {
  const errors: string[] = [];
  const { required } = rules;

  if (required !== undefined) {
    let isRequired = false;
    let errorMsg = "Default required message";

    switch (typeof required) {
      case "boolean":
        isRequired = required;
        break;
      case "object":
        isRequired = required.value;
        errorMsg = required.message;
        break;
      default:
        const result = required(formValues);

        if (typeof result === "boolean") {
          isRequired = result;
        } else {
          isRequired = result.value;
          errorMsg = result.message;
        }
    }
    if (isRequired && isNullOrUndefined(fieldValue)) {
      errors.push(errorMsg);
    }
  }
  return errors;
};
