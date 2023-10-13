import { Form, FormItem } from './components';
import { useForm, useFormCenter, useFormState, useWatch } from './hooks';
import { MyFormData, InputNumber, Input, CustomController } from './features';

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
        {props.isRequired ? <span style={{ color: 'red' }}>* </span> : null}
        {props.label}
      </label>
      {props.description ? <span>{props.description}</span> : null}
      {props.children}
      <div>{props.errors?.map((error, i) => <p key={i}>{error}</p>)}</div>
    </div>
  );
};

const Watch = () => {
  const form = useFormCenter<MyFormData>();
  const a = useWatch('grand.parent', form);
  console.log('Watch', a);

  return <div />;
};

function App() {
  const form = useForm<{ test: string }>({
    defaultValues: {
      test: '',
    },
    rules: {
      test: {
        required: true,
      },
    },
    // initialState: {
    //   isValid: true,
    // },
    // defaultValues: {
    // grand: {
    //   parent: {
    //     child: 60,
    //   },
    // },
    //   required1: '',
    // },
    // dependants: {
    //   "grand.parent": ["required1"],
    // },
    // rules: {
    // 'grand.parent': {
    //   required: true,
    // },
    // required1: {
    //   required: true,
    // required: ({ grand }) => {
    //   return {
    //     value: value !== undefined && value > 50,
    //     message: `This is dynamic required when quantity (${value}) > 50`,
    //   };
    // },
    // },
    // required1: {
    //   required: true,
    // },
    // required2: {
    //   required: {
    //     value: true,
    //     message: "This is required",
    //   },
    // },
    // },
  });

  // const state = useFormState('isValid', form);
  const state = true;

  console.log('app render');

  const handleClick = () => {
    form.validate('test');
    // form.setValue("grand.parent.child", 40);
    // form.setValue("grand.parent", { child: 40 });
    // form.setValue("grand", { parent: { child: 40 } });
  };

  return (
    <Form
      form={form}
      className="col"
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <label htmlFor="test">Test</label>
      <FormItem name="test">
        {(control, state) => {
          return (
            <>
              <input id="test" {...control} />
              {state.errors ? <span role="alert">Error</span> : null}
            </>
          );
        }}
      </FormItem>
      {/* <FormItem form={form} name="grand.parent.child2">
        {(control, state) => {
          return (
            <Field label="Deep nested" {...state}>
              <InputNumber {...control} />
            </Field>
          );
        }}
      </FormItem> */}

      {/* <FormItem form={form} name="grand.parent">
        {(control, state) => {
          return (
            <Field label="Deep nested" {...state}>
              <CustomController {...control} />
            </Field>
          );
        }}
      </FormItem> */}

      {/* <FormItem form={form} name="required1">
        {(control, state) => {
          return (
            <Field label="Required 1" {...state}>
              <Input {...control} />
            </Field>
          );
        }}
      </FormItem> */}

      <div className="row">
        {/* <button type="button" onClick={form.resetValues}>
          Reset
        </button> */}
        <button type="button" onClick={handleClick}>
          Click
        </button>
        {/* <button type="submit" disabled={!state}>
          Submit
        </button> */}
      </div>
    </Form>
  );
}

export default App;
