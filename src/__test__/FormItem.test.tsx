import {
  act as actComponent,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { useForm } from '../hooks';
import { Form, FormItem } from '../components';

describe('<FormItem />', () => {
  const Component = () => {
    const form = useForm({
      defaultValues: {
        test: 'abc',
      },
    });

    return (
      <Form>
        <FormItem form={form} name="test">
          {(control, state) => {
            return <input name="test" type="text" {...control} />;
          }}
        </FormItem>
      </Form>
    );
  };

  it('should get default value', () => {
    render(<Component />);

    const input = screen.getByRole('textbox', {
      name: 'test',
    });

    expect(input).toHaveValue('abc');
  });
});
