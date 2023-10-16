import { act, render, renderHook, screen } from '@testing-library/react';
import { useForm } from '../hooks';
import { Form, FormItem } from '../components';
import { FormCenter } from '../form-center';

describe('useForm: formCenter APIs', () => {
  type MyForm = {
    test?: string;
  };

  const TestScene = (props: { form: FormCenter<MyForm> }) => {
    return (
      <Form form={props.form}>
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
      </Form>
    );
  };

  const setupTestScene = (useFormArgs?: Parameters<typeof useForm<MyForm>>[0]) => {
    const { result } = renderHook(() => useForm(useFormArgs));
    const renderResult = render(<TestScene form={result.current} />);
    const textbox = screen.getByRole('textbox');

    return {
      form: result.current,
      renderResult,
      textbox,
    };
  };

  it('should be able to get a field value', () => {
    const { form } = setupTestScene({
      defaultValues: {
        test: 'abc',
      },
    });

    expect(form.getValue('test')).toBe('abc');
  });

  it('should be able to set a field value', () => {
    const { form, textbox } = setupTestScene();
    expect(form.getValue('test')).toBeUndefined();

    act(() => form.setValue('test', 'abc'));
    expect(textbox).toHaveValue('abc');
  });

  it('should be able to trigger a field validation', async () => {
    const { form } = setupTestScene({
      rules: {
        test: {
          required: true,
        },
      },
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    act(() => form.validate('test'));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
