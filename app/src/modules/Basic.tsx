import { Form, FormItem, useForm } from 'another-form';
import { Field, Input, InputNumber, Select, Radio, Checkbox, Footer } from '../components';

let count = 0;

const Basic = () => {
  const form = useForm();

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  count++;

  return (
    <>
      <h1 className="text-3xl text-center text-white font-semibold">Basic Form</h1>

      <Form form={form} className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <FormItem name="textInput">
          {(control, state) => {
            return (
              <Field label="Text input" {...state}>
                <Input {...control} />
              </Field>
            );
          }}
        </FormItem>

        <FormItem name="numberInput">
          {(control, state) => {
            return (
              <Field label="Number input" {...state}>
                <InputNumber type="number" {...control} />
              </Field>
            );
          }}
        </FormItem>

        <FormItem name="select.nested">
          {(control, state) => {
            return (
              <Field label="Select nested value" {...state}>
                <Select
                  {...control}
                  options={[
                    { label: 'Option A', value: 'optionA' },
                    { label: 'Option B', value: 'optionB' },
                  ]}
                />
              </Field>
            );
          }}
        </FormItem>

        <FormItem name="radio">
          {(control, state) => {
            return (
              <Field label="Radio Group" {...state}>
                <Radio.Group {...control}>
                  <Radio value="radioA">Radio A</Radio>
                  <Radio value="radioB">Radio B</Radio>
                </Radio.Group>
              </Field>
            );
          }}
        </FormItem>

        <FormItem name="checkbox">
          {(control, state) => {
            return (
              <Field label="Checkbox Group" {...state}>
                <Checkbox.Group {...control}>
                  <Checkbox value="checkboxA">Checkbox A</Checkbox>
                  <Checkbox value="checkboxB">Checkbox B</Checkbox>
                  <Checkbox value="checkboxC">Checkbox C</Checkbox>
                </Checkbox.Group>
              </Field>
            );
          }}
        </FormItem>

        <Footer renderTimes={count} />
      </Form>
    </>
  );
};

export default Basic;
