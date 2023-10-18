import clsx from 'clsx';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

type RadioValue = string | number | boolean;

type RadioContext = {
  name?: string;
  value: RadioValue | undefined;
  disabled: boolean;
  onChange: (value: RadioValue) => void;
};

const Context = createContext<RadioContext | null>(null);

type RadioProps = {
  value: RadioValue;
  disabled?: boolean;
  checked?: boolean;
  children: ReactNode;
};
const Radio = (props: RadioProps) => {
  const context = useContext(Context);
  const checked = context ? context.value === props.value : props.checked;
  const disabled = context?.disabled ?? props.disabled;

  const onChange = () => {
    if (!checked) {
      context?.onChange(props.value);
    }
  };

  return (
    <label
      className={clsx(
        'w-fit flex items-center space-x-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
    >
      <input
        type="radio"
        name={context?.name}
        checked={checked}
        value={`${props.value}`}
        disabled={disabled}
        onChange={onChange}
      />
      <span>{props.children}</span>
    </label>
  );
};

type RadioGroupProps = {
  className?: string;
  name?: string;
  children?: ReactNode;
  disabled?: boolean;
  value?: RadioValue;
  defaultValue?: RadioValue;
  onChange?: (value: RadioValue) => void;
};
const RadioGroup = ({
  className,
  name,
  children,
  value,
  defaultValue,
  disabled = false,
  onChange,
}: RadioGroupProps) => {
  const [localValue, setLocalValue] = useState<RadioValue | undefined>(defaultValue);

  useEffect(() => {
    if (value !== localValue) setLocalValue(value);
  }, [value]);

  const finalValue = value ?? localValue;

  const handleChange = (newValue: RadioValue) => {
    onChange?.(newValue);
    setLocalValue(newValue);
  };

  return (
    <Context.Provider value={{ name, value: finalValue, disabled, onChange: handleChange }}>
      <div className={className}>{children}</div>
    </Context.Provider>
  );
};

Radio.Group = RadioGroup;

export { Radio };
