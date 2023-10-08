import { MyFormData } from "./types";

type CustomControllerProps = {
  value?: MyFormData["object"];
  onChange?: (object: MyFormData["object"]) => void;
};
export function CustomController({ value, onChange }: CustomControllerProps) {
  return (
    <input
      value={value?.key}
      onChange={(e) => {
        onChange?.({
          key: e.target.value,
        });
      }}
    />
  );
}
