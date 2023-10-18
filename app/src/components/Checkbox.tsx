import clsx from 'clsx';
import {
  ChangeEventHandler,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type CheckboxValue = string | number | boolean | undefined;

type CheckboxContext = {
  name?: string;
  values: CheckboxValue[];
  disabled: boolean;
  onChange: (value: CheckboxValue) => void;
};

const Context = createContext<CheckboxContext | null>(null);

type CheckboxProps = {
  name?: string;
  /** This props is useless without Checkbox.Group, and required when used with Checkbox.Group */
  value?: CheckboxValue;
  /** This props is useless when used with Checkbox.Group */
  checked?: boolean;
  indeterminate?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};
const Checkbox = (props: CheckboxProps) => {
  const context = useContext(Context);
  const ref = useRef<HTMLInputElement>(null);
  const [localChecked, setLocalChecked] = useState(props.defaultChecked ?? false);

  const checked = context ? context.values.includes(props.value) : props.checked ?? localChecked;
  const disabled = context?.disabled ?? props.disabled;

  useEffect(() => {
    if (props.checked !== undefined && props.checked !== localChecked) {
      setLocalChecked(props.checked);
    }
  }, [props.checked]);

  useEffect(() => {
    if (props.indeterminate && ref.current) {
      ref.current.indeterminate = true;
    }
  }, [props.indeterminate]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    props.onChange?.(e);
    setLocalChecked(e.target.checked);
    context?.onChange(props.value);
  };

  return (
    <label
      className={clsx(
        'w-fit flex items-center space-x-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        name={context?.name ?? props.name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span>{props.children}</span>
    </label>
  );
};

type CheckboxGroupProps = {
  className?: string;
  name?: string;
  children?: ReactNode;
  disabled?: boolean;
  value?: CheckboxValue[];
  defaultValue?: CheckboxValue[];
  onChange?: (value: CheckboxValue[]) => void;
};
export const CheckboxGroup = ({
  className,
  name,
  children,
  value,
  defaultValue = [],
  disabled = false,
  onChange,
}: CheckboxGroupProps) => {
  const [localValue, setLocalValue] = useState<CheckboxValue[]>(defaultValue);

  useEffect(() => {
    if (value?.some((item, i) => item !== localValue[i])) {
      setLocalValue(value);
    }
  }, [value]);

  const finalValue = value ?? localValue;

  const handleChange = (value: CheckboxValue) => {
    const newValue = [...finalValue];
    const foundIndex = finalValue.findIndex((item) => item === value);

    if (foundIndex === -1) {
      newValue.push(value);
    } else {
      newValue.splice(foundIndex, 1);
    }

    setLocalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Context.Provider value={{ name, values: finalValue, disabled, onChange: handleChange }}>
      <div className={className}>{children}</div>
    </Context.Provider>
  );
};

Checkbox.Group = CheckboxGroup;

export { Checkbox };
