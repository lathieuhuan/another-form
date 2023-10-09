import { FormDependants, FormErrors, FormRules, FormValues, Path, TouchedFields } from "../types";
import get from "../utils/get";
import set from "../utils/set";
import cloneObject from "../utils/cloneObject";
import { FieldWatcher, FormCenterConstructOptions, InternalFormCenter, ValueWatcher } from "./types";
import { validateField } from "./validate-field";

export class FormCenterService<TFormValues extends FormValues = FormValues> {
  config = {
    singleError: true,
  };

  values = {} as TFormValues;
  dependants: FormDependants<TFormValues> = {};
  errors: FormErrors<TFormValues> = {};
  rules: FormRules<TFormValues> = {};
  touchedFields: TouchedFields<TFormValues> = {};

  valueWatchers: Map<Path<TFormValues>, Set<ValueWatcher<TFormValues>>> = new Map();
  fieldWatchers: Map<Path<TFormValues>, Set<FieldWatcher<TFormValues>>> = new Map();

  constructor({ defaultValues }: FormCenterConstructOptions<TFormValues>) {
    if (defaultValues) {
      this.values = cloneObject(defaultValues) as TFormValues;
    }
  }

  updateFormRules = (newRules: typeof this.rules) => {
    this.rules = newRules;
  };

  updateFormDependencies = (newDependencies: typeof this.dependants) => {
    this.dependants = newDependencies;
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

  _watchField = <TPath extends Path<TFormValues>>(
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

  getFieldState: InternalFormCenter<TFormValues>["getFieldState"] = (path) => {
    const value = get(this.values);
    return {
      value,
      errors: this.errors[path],
      isTouched: this.touchedFields[path] ?? false,
    };
  };

  // #to-do: implement third argument options
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

    const { triggerDependants } = options;

    if (triggerDependants) {
      this.dependants[path]?.forEach((dependency) => {
        (triggerDependants === "force" || this.touchedFields[dependency]) && this.validate(dependency);
      });
    }
  };

  updateTouched = (path: Path<TFormValues>, touched: boolean) => {
    this.touchedFields[path] = touched;
  };

  validate: InternalFormCenter<TFormValues>["validate"] = (path) => {
    const rules = this.rules[path];
    const errors = rules ? validateField(rules, get(this.values, path), this.values) : [];

    this.errors[path] = errors.length ? errors : undefined;

    this.fieldWatchers.get(path)?.forEach((watcher) =>
      watcher({
        errors: this.errors[path],
      })
    );
    return this.errors[path] ? this.errors[path]! : true;
  };
}
