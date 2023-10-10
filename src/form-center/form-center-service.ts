import {
  FormDependants,
  FormErrors,
  FormRules,
  FormState,
  FormValues,
  Path,
  TouchedFields,
  ValidFields,
} from "../types";
import get from "../utils/get";
import set from "../utils/set";
import cloneObject from "../utils/cloneObject";
import { FieldWatcher, FormCenterConstructOptions, InternalFormCenter, ValueWatcher } from "./types";
import { isFieldRequired, validateField } from "./validate-field";
import isNullOrUndefined from "../utils/isNullOrUndefined";
import isUndefined from "../utils/isUndefined";

export class FormCenterService<TFormValues extends FormValues = FormValues> {
  config = {
    multiErrors: false,
  };
  state: FormState = {
    isTouched: false,
    isValid: false,
  };

  validTimeoutId: number | undefined;
  timeoutUpdateStateValid = 200;

  fieldPaths: Set<Path<TFormValues>> = new Set();

  values = {} as TFormValues;
  dependants: FormDependants<TFormValues>;
  rules: FormRules<TFormValues>;
  errors: FormErrors<TFormValues> = {};
  touchedFields: TouchedFields<TFormValues> = {};
  validFields: ValidFields<TFormValues> = {};
  disabledFields = {};

  valueWatchers: Map<Path<TFormValues>, Set<ValueWatcher<TFormValues>>> = new Map();
  fieldWatchers: Map<Path<TFormValues>, Set<FieldWatcher<TFormValues>>> = new Map();
  formStateWatchers: Set<(formState: FormState) => void> = new Set();

  constructor(args: FormCenterConstructOptions<TFormValues> = {}) {
    const { defaultValues = {}, dependants = {}, rules = {}, initialState = {} } = cloneObject(args);

    this.state = Object.assign(this.state, initialState);
    this.values = defaultValues as TFormValues;
    this.dependants = dependants;
    this.rules = rules;
  }

  // ========== FORM ==========

  _getFormState = <TKey extends keyof FormState>(key?: TKey): FormState | FormState[TKey] => {
    return key ? this.state[key] : this.state;
  };

  _watchFormState = (watcher: (formState: FormState) => void) => {
    this.formStateWatchers.add(watcher);
    return () => {
      this.formStateWatchers.delete(watcher);
    };
  };

  updateFormRules = (newRules: typeof this.rules) => {
    this.rules = newRules;
  };

  updateFormDependants = (newDependencies: typeof this.dependants) => {
    this.dependants = newDependencies;
  };

  _updateFormState = (newState: Partial<FormState>) => {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.formStateWatchers.forEach((watcher) => watcher(this.state));
  };

  _checkFormValid = () => {
    const isValid = Object.values(this.validFields).every(Boolean);

    this._updateFormState({
      isValid,
    });
  };

  // ========== FIELD ==========

  getFieldState: InternalFormCenter<TFormValues>["getFieldState"] = (path) => {
    const value = get(this.values, path);
    const isRequired = isFieldRequired(this.rules[path]?.required, this.values) !== false;

    return {
      value,
      errors: this.errors[path],
      isRequired,
      isTouched: this.touchedFields[path] ?? false,
      isDisabled: false,
      isValid: false,
    };
  };

  _getInitialFieldState: typeof this.getFieldState = (path) => {
    const initialFieldState = this.getFieldState(path);
    const initialValid = !initialFieldState.isRequired || !isNullOrUndefined(initialFieldState.value);
    this._setFieldValid(path, initialValid);
    return initialFieldState;
  };

  _registerField = <TPath extends Path<TFormValues>>(
    path: TPath,
    watcher: FieldWatcher<TFormValues, TPath>
  ): (() => void) => {
    const fieldWatchers = this.fieldWatchers.get(path);

    if (fieldWatchers) {
      fieldWatchers.add(watcher as any);
      return () => {
        fieldWatchers.delete(watcher as any);
      };
    }

    this.fieldWatchers.set(path, new Set([watcher as any]));
    return () => {
      this.fieldWatchers.get(path)?.delete(watcher as any);
    };
  };

  getValue: InternalFormCenter<TFormValues>["getValue"] = (path?: Path<TFormValues>) => {
    return path ? get(this.values, path) : this.values;
  };

  setValue: InternalFormCenter<TFormValues>["setValue"] = (path, value, options = {}) => {
    set(this.values, path, value);

    /**
     * Find and call watchers of all nested values.
     * E.g. set 'a' = { b: 1 } => noti 'a' and 'a.b'
     */
    for (const [key, watchers] of this.valueWatchers.entries()) {
      // #to-do: this is not correct in case setting 'ab' and there's a path 'abc'
      if (key.includes(path)) {
        const notiValue = get(this.values, key);
        watchers.forEach((watcher) => watcher(notiValue));
      }
    }

    for (const [key, watchers] of this.fieldWatchers.entries()) {
      // #to-do: this is not correct in case setting 'ab' and there's a path 'abc'
      if (key.includes(path)) {
        watchers.forEach((watcher) =>
          watcher({
            value: get(this.values, key),
          })
        );
      }
    }

    // need to update dependants valid even triggerDependants false, but no emit errors
    const { triggerDependants } = options;

    if (triggerDependants) {
      this.dependants[path]?.forEach((dependency) => {
        (triggerDependants === "force" || this.touchedFields[dependency]) && this.validate(dependency);
      });
    }
  };

  validate: InternalFormCenter<TFormValues>["validate"] = (path) => {
    const rules = this.rules[path];
    const validateResult = rules ? validateField(rules, get(this.values, path), this.values) : undefined;

    this.errors[path] = validateResult?.errors.length ? validateResult.errors : undefined;
    const errors = this.errors[path];

    this.fieldWatchers.get(path)?.forEach((watcher) =>
      watcher({
        errors,
        isRequired: validateResult?.isRequired === true,
      })
    );
    this._setFieldValid(path, isUndefined(errors));

    return this.errors[path] ?? true;
  };

  _setFieldValid = (path: Path<TFormValues>, isValid: boolean) => {
    this.validFields[path] = isValid;
    clearTimeout(this.validTimeoutId);
    this.validTimeoutId = setTimeout(this._checkFormValid, this.timeoutUpdateStateValid);
  };

  setFieldTouched = (path: Path<TFormValues>, touched: boolean) => {
    this.touchedFields[path] = touched;
  };

  _watchValue = (path: Path<TFormValues>, watcher: ValueWatcher<TFormValues>): (() => void) => {
    const valueWatchers = this.valueWatchers.get(path);

    if (valueWatchers) {
      valueWatchers.add(watcher);
      return () => {
        valueWatchers.delete(watcher);
      };
    }

    this.valueWatchers.set(path, new Set([watcher]));
    return () => {
      this.valueWatchers.get(path)?.delete(watcher);
    };
  };
}
