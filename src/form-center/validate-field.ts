import { FormValues, ValidateRule, ValidateRules } from '../types';
import isNullOrUndefined from '../utils/isNullOrUndefined';

/**
 * @returns string (error) or true if required, false otherwise
 */
export const isFieldRequired = <TFormValues extends FormValues>(
  requiredRule: ValidateRule<TFormValues, boolean> | undefined,
  formValues: TFormValues,
): boolean | string => {
  if (requiredRule === undefined) return false;

  let isRequired = false;
  let errorMsg;

  switch (typeof requiredRule) {
    case 'boolean':
      isRequired = requiredRule;
      break;
    case 'object':
      isRequired = requiredRule.value;
      errorMsg = requiredRule.message;
      break;
    default:
      const result = requiredRule(formValues);

      if (typeof result === 'boolean') {
        isRequired = result;
      } else {
        isRequired = result.value;
        errorMsg = result.message;
      }
  }
  return isRequired ? errorMsg ?? true : false;
};

export const validateField = <TFormValues extends FormValues>(
  rules: ValidateRules<TFormValues>,
  fieldValue: any,
  formValues: TFormValues,
) => {
  const errors: string[] = [];
  const { required } = rules;
  const isRequired = isFieldRequired(required, formValues);

  if (isRequired && ['', null, undefined].includes(fieldValue)) {
    errors.push(isRequired === true ? 'Default required message' : isRequired);
  }

  return {
    isRequired: isRequired !== false,
    errors,
  };
};
