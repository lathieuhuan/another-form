import { Form, FormItem } from "./components";
import { useForm, useFormState } from "./hooks";
import { MyFormData, InputNumber, Input, CustomController } from "./features";

type FieldProps = {
  label: string;
  description?: string;
  errors?: string[];
  isRequired?: boolean;
  children: React.ReactNode;
};
const Field = (props: FieldProps) => {
  return (
    <div className="col">
      <label>
        {props.isRequired ? <span style={{ color: "red" }}>* </span> : null}
        {props.label}
      </label>
      {props.description ? <span>{props.description}</span> : null}
      {props.children}
      <div>
        {props.errors?.map((error, i) => (
          <p key={i}>{error}</p>
        ))}
      </div>
    </div>
  );
};

function App() {
  const form = useForm<MyFormData>({
    defaultValues: {
      grand: {
        parent: {
          child: 60,
        },
      },
    },
    dependants: {
      "grand.parent": ["required1"],
    },
    rules: {
      required1: {
        required: true,
        // required: ({ grand }) => {
        //   console.log("run required");
        //   const value = grand?.parent?.child;
        //   return {
        //     value: value !== undefined && value > 50,
        //     message: `This is dynamic required when quantity (${value}) > 50`,
        //   };
        // },
      },
      // required1: {
      //   required: true,
      // },
      // required2: {
      //   required: {
      //     value: true,
      //     message: "This is required",
      //   },
      // },
    },
  });

  const state = useFormState("isValid", form);

  console.log("app render");

  const handleClick = () => {
    // form.setValue("grand.parent.child", 40);
    // form.setValue("grand.parent", { child: 40 });
    // form.setValue("grand", { parent: { child: 40 } });
    form.validate("required1");
  };

  return (
    <Form
      form={form}
      className="col"
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <FormItem form={form} name="grand.parent.child2">
        {(control, state) => {
          return (
            <Field label="Deep nested" {...state}>
              <InputNumber {...control} />
            </Field>
          );
        }}
      </FormItem>

      <FormItem form={form} name="grand.parent">
        {(control, state) => {
          return (
            <Field label="Deep nested" {...state}>
              <CustomController {...control} />
            </Field>
          );
        }}
      </FormItem>

      <FormItem form={form} name="required1">
        {(control, state) => {
          return (
            <Field label="Required 1" {...state}>
              <Input {...control} />
            </Field>
          );
        }}
      </FormItem>

      <div className="row">
        <button type="button" onClick={form.resetValues}>
          Reset
        </button>
        <button type="button" onClick={handleClick}>
          Click
        </button>
        <button type="submit" disabled={!state}>
          Submit
        </button>
      </div>
    </Form>
  );
}

export default App;
