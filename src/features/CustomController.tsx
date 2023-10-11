import { InputNumber } from ".";
import { MyFormData } from "./types";

type ValueType = MyFormData["grand"]["parent"];

type CustomControllerProps = {
  value?: ValueType;
  onChange?: (object: ValueType) => void;
};
export function CustomController({ value, onChange }: CustomControllerProps) {
  return (
    <InputNumber
      value={value?.child}
      onChange={(e) => {
        onChange?.({
          child: e,
        });
      }}
    />
  );
}
