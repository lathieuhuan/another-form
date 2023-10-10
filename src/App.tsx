import { Form, FormItem } from "./components";
import { useForm, useFormState } from "./hooks";
import { MyFormData, InputNumber, Input } from "./features";

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
        {props.isRequired ? (
          <span
            style={{
              marginLeft: 2,
              color: "red",
            }}
          >
            *
          </span>
        ) : null}
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
      quantity: 10,
      // primitive: "",
      // nested: {
      //   value: "",
      // },
      // object: {
      //   key: "",
      // },
    },
    dependants: {
      quantity: ["required3", "required4"],
    },
    rules: {
      // quantity: {
      //   required: true,
      // },
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
        required: ({ quantity }) => quantity < 50,
      },
      required4: {
        required: ({ quantity }) => ({
          value: quantity > 50,
          message: `This is dynamic required when quantity (${quantity}) > 50`,
        }),
      },
    },
  });

  const state = useFormState("isValid", form);

  console.log("app render");

  const handleClick = () => {
    form.setValue("quantity", 160, { triggerDependants: "force" });
    // form.setValue("object", { key: "DEV" });
  };

  return (
    <Form
      form={form}
      className="col"
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <FormItem form={form} name="quantity">
        {(control, state) => {
          return (
            <Field label="Quantity" {...state}>
              <InputNumber {...control} />
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
      <FormItem form={form} name="required2">
        {(control, state) => {
          return (
            <Field label="Required 2" {...state}>
              <Input {...control} />
            </Field>
          );
        }}
      </FormItem>
      <FormItem form={form} name="required3">
        {(control, state) => {
          return (
            <Field label="Required 3" description="This is required when quantity < 50" {...state}>
              <Input {...control} />
            </Field>
          );
        }}
      </FormItem>
      <FormItem form={form} name="required4">
        {(control, state) => {
          return (
            <Field label="Required 4" {...state}>
              <Input {...control} />
            </Field>
          );
        }}
      </FormItem>

      <div className="row">
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
