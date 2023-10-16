import { ChangeEvent, InputHTMLAttributes } from 'react';
import { Input } from './Input';

type InputNumberProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange?: (value?: number) => void;
};
export function InputNumber({ onChange, ...rest }: InputNumberProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value === '') {
      onChange?.(undefined);
    } else if (!isNaN(+value)) {
      onChange?.(+value);
    }
  };
  return <Input {...rest} onChange={handleChange} />;
}
