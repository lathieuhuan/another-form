import { Form, FormItem } from "./components";
import { useForm } from "./hooks";
import { Input, MyFormData, InputNumber } from "./features";

type FieldProps = {
  label: string;
  description?: string;
  errors?: string[];
  children: React.ReactNode;
};
const Field = (props: FieldProps) => {
  return (
    <div className="col">
      <label>{props.label}</label>
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
    // defaultValues: {
    //   primitive: "",
    //   nested: {
    //     value: "",
    //   },
    //   object: {
    //     key: "",
    //   },
    // },
    dependants: {
      quantity: ["required4"],
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
        required: ({ quantity }) => quantity < 50,
      },
      required4: {
        required: ({ quantity }) => ({
          value: quantity > 100,
          message: `This is dynamic required when quantity (${quantity}) > 100`,
        }),
      },
    },
  });

  console.log("app render");

  const handleClick = () => {
    console.log(form.setValue("quantity", 160, { triggerDependants: "force" }));
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
        {(control) => {
          return (
            <Field label="Quantity">
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
        <button type="submit">Submit</button>
      </div>
    </Form>
  );
}

export default App;
