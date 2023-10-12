import {
  FormConfig,
  FormDependants,
  FormErrors,
  FormRules,
  FormState,
  FormValues,
  Path,
  TouchedFields,
  ValidFields,
} from '../types';
import {
  FieldWatcher,
  FormCenterConstructOptions,
  InternalFormCenter,
  ValueWatcher,
} from './types';
import get from '../utils/get';
import set from '../utils/set';
import cloneObject from '../utils/cloneObject';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import isUndefined from '../utils/isUndefined';
import isPathMatched from '../utils/isPathMatched';
import { isFieldRequired, validateField } from './validate-field';

export class FormCenterService<TFormValues extends FormValues = FormValues> {
  config: FormConfig = {
    validUpdateDelay: 150,
    // #to-do
    multiErrors: false,
  };
  state: FormState = {
    isTouched: false,
    isValid: false,
    fillNo: 0,
  };

  updateFormTimeoutId: number | undefined;

  values = {} as TFormValues;
  defaultValues = {} as TFormValues;
  dependants: FormDependants<TFormValues> = {};
  rules: FormRules<TFormValues> = {};
  errors: FormErrors<TFormValues> = {};
  touchedFields: TouchedFields<TFormValues> = {};
  validFields: ValidFields<TFormValues> = {};
  // #to-do
  disabledFields = {};

  valueWatchers: Map<Path<TFormValues>, Set<ValueWatcher<TFormValues>>> = new Map();
  fieldWatchers: Map<Path<TFormValues>, Set<FieldWatcher<TFormValues>>> = new Map();
  formStateWatchers: Set<(formState: FormState) => void> = new Set();

  constructor(args: FormCenterConstructOptions<TFormValues> = {}) {
    this._construct(args);
  }

  // ========== FORM ==========

  _construct = (args: FormCenterConstructOptions<TFormValues> = {}) => {
    const {
      config = {},
      initialState = {},
      defaultValues = {},
      dependants = {},
      rules = {},
    } = cloneObject(args);

    this.config = Object.assign(this.config, config);
    this.state = Object.assign(this.state, initialState);
    this.values = defaultValues as TFormValues;
    this.defaultValues = cloneObject(defaultValues) as TFormValues;
    this.dependants = dependants;
    this.rules = rules;
  };

  _getFormState = <TKey extends keyof FormState>(key?: TKey): FormState | FormState[TKey] => {
    return key ? this.state[key] : this.state;
  };

  _watchFormState = (watcher: (formState: FormState) => void) => {
    this.formStateWatchers.add(watcher);
    return () => {
      this.formStateWatchers.delete(watcher);
    };
  };

  _updateFormState = (newState: Partial<FormState>) => {
    if (
      Object.entries(newState).some(([key, value]) => value !== this.state[key as keyof FormState])
    ) {
      this.state = {
        ...this.state,
        ...newState,
      };
      this.formStateWatchers.forEach((watcher) => watcher(this.state));
    }
  };

  _checkFormValid = () => {
    this._updateFormState({
      isValid: Object.values(this.validFields).every(Boolean),
    });
  };

  // #to-do: improve
  resetValues = () => {
    this.values = cloneObject(this.defaultValues);

    this._updateFormState({
      fillNo: this.state.fillNo + 1,
    });
  };

  // ========== FIELD ==========

  getFieldState: InternalFormCenter<TFormValues>['getFieldState'] = (path) => {
    const value = get(this.values, path);
    const isRequired = isFieldRequired(this.rules[path]?.required, this.values) !== false;

    return {
      value,
      errors: this.errors[path],
      isRequired,
      isTouched: this.touchedFields[path] ?? false,
      isValid: this.validFields[path] ?? false,
      isDisabled: false,
    };
  };

  _getInitialFieldState: typeof this.getFieldState = (path) => {
    const initialFieldState = this.getFieldState(path);
    const initialValid =
      !initialFieldState.isRequired || !isNullOrUndefined(initialFieldState.value);
    this._setFieldValid(path, initialValid);
    return initialFieldState;
  };

  _registerField = <TPath extends Path<TFormValues>>(
    path: TPath,
    watcher: FieldWatcher<TFormValues, TPath>,
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

  getValue: InternalFormCenter<TFormValues>['getValue'] = (path?: Path<TFormValues>) => {
    return path ? get(this.values, path) : this.values;
  };

  setValue: InternalFormCenter<TFormValues>['setValue'] = (path, value, options = {}) => {
    set(this.values, path, value);

    /**
     * Find and call watchers of all related fields.
     * E.g-1. set 'a' = { b: 1 } ==> notify 'a' and 'a.b'
     * E.g-2. set 'a.b' = 1 ==> also notify 'a' and 'a.b'
     */
    for (const [key, watchers] of this.valueWatchers.entries()) {
      if (isPathMatched(path, key)) {
        watchers.forEach((watcher) => watcher(get(this.values, key)));
      }
    }
    for (const [key, watchers] of this.fieldWatchers.entries()) {
      if (isPathMatched(path, key)) {
        watchers.forEach((watcher) =>
          watcher({
            value: get(this.values, key),
          }),
        );
      }
    }

    const { triggerDependants = true } = options;

    if (triggerDependants) {
      for (const key in this.dependants) {
        if (isPathMatched(path, key)) {
          this.dependants[key as keyof typeof this.dependants]?.forEach((dependency) => {
            const dependantIsTouched = this.touchedFields[dependency];
            const dependantIsNotEmpty = !isNullOrUndefined(get(this.values, dependency));
            let shouldEmitErrors;

            if (triggerDependants === true) {
              shouldEmitErrors = dependantIsTouched || dependantIsNotEmpty;
            } else {
              shouldEmitErrors =
                (dependantIsTouched && triggerDependants.includes('touched')) ||
                (dependantIsNotEmpty && triggerDependants.includes('notEmpty'));
            }
            this.validate(dependency, { hideErrors: !shouldEmitErrors });
          });
        }
      }
    }
  };

  validate: InternalFormCenter<TFormValues>['validate'] = (path, options = {}) => {
    const rules = this.rules[path];
    const validateResult = rules
      ? validateField(rules, get(this.values, path), this.values)
      : undefined;

    this.errors[path] = validateResult?.errors.length ? validateResult.errors : undefined;
    const errors = this.errors[path];

    this.fieldWatchers.get(path)?.forEach((watcher) =>
      watcher({
        errors: options.hideErrors ? [] : errors,
        isRequired: validateResult?.isRequired === true,
      }),
    );
    this._setFieldValid(path, isUndefined(errors));

    return errors ?? true;
  };

  _setFieldValid = (path: Path<TFormValues>, isValid: boolean) => {
    this.validFields[path] = isValid;
    clearTimeout(this.updateFormTimeoutId);
    this.updateFormTimeoutId = setTimeout(this._checkFormValid, this.config.validUpdateDelay);
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
