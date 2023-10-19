import { render } from '@testing-library/react';
import { useForm } from '../hooks';
import { Form, FormItem, FormItemProps } from '../components';
import { FormValues, Path } from '../types';

describe('<FormItem />', () => {
  const Component = <T extends FormValues>(props: {
    useFormArgs: Parameters<typeof useForm<T>>[0];
    formItems: Array<{
      name: Path<T>;
      render: FormItemProps<T>['children'];
    }>;
  }) => {
    const form = useForm(props.useFormArgs);
    return (
      <Form>
        {props.formItems.map((item) => (
          <FormItem key={item.name} form={form} name={item.name}>
            {item.render}
          </FormItem>
        ))}
      </Form>
    );
  };

  it('should render child with default value and not required as useForm config', () => {
    const renderChild = jest.fn();
    render(
      <Component
        useFormArgs={{
          defaultValues: {
            test: 'abc',
          },
        }}
        formItems={[{ name: 'test', render: renderChild }]}
      />,
    );

    expect(renderChild).toHaveBeenCalledTimes(1);
    expect(renderChild).toBeCalledWith(
      expect.objectContaining({ value: 'abc' }),
      expect.objectContaining({ isRequired: false }),
    );
  });

  it('should render child required as useForm config', () => {
    const renderChild1 = jest.fn();
    const renderChild2 = jest.fn();
    render(
      <Component
        useFormArgs={{
          rules: {
            test1: {
              required: true,
            },
            test2: {
              required: {
                value: true,
                message: 'Required',
              },
            },
          },
        }}
        formItems={[
          { name: 'test1', render: renderChild1 },
          { name: 'test2', render: renderChild2 },
        ]}
      />,
    );

    expect(renderChild1).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({ isRequired: true }),
    );
    expect(renderChild2).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({ isRequired: true }),
    );
  });
});
