import { Form, FormItem } from "./components";
import { useForm } from "./hooks";
import { CustomController, MyFormData, UseWatchTest } from "./features";

type FieldProps = {
  label: string;
  children: React.ReactNode;
};
const Field = (props: FieldProps) => {
  return (
    <div className="flex flex-col">
      <label>{props.label}</label>
      {props.children}
    </div>
  );
};

function App() {
  const form = useForm<MyFormData>({
    defaultValues: {
      primitive: "",
      nested: {
        value: "",
      },
      object: {
        key: "",
      },
    },
    rules: {
      required1: {
        required: true,
      },
      required2: {
        required: {
          value: true,
          message: "This is required",
        },
      },
      required3: {
        required: {
          value: () => true,
          message: "This is dynamic required",
        },
      },
    },
  });

  const handleClick = () => {
    form.setValue("object", { key: "DEV" });
  };

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <FormItem form={form} name="primitive">
        {({ control }) => {
          return (
            <Field label="Code">
              <input {...control} />
            </Field>
          );
        }}
      </FormItem>
      <UseWatchTest path="primitive" />

      <FormItem form={form} name="nested.value">
        {({ control }) => {
          return (
            <Field label="Nested Value">
              <input {...control} />
            </Field>
          );
        }}
      </FormItem>
      <UseWatchTest path="nested.value" />

      <FormItem form={form} name="object">
        {({ control }) => {
          return (
            <Field label="Custom controler">
              <CustomController {...control} />
            </Field>
          );
        }}
      </FormItem>
      <UseWatchTest path="object" />

      <div>
        <button type="button" onClick={handleClick}>
          Click
        </button>
        <button type="submit">Submit</button>
      </div>
    </Form>
  );
}

export default App;
