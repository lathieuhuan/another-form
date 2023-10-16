import { Form, FormItem } from 'another-form';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Another Form Testing App</h1>

      <Form onSubmit={console.log}>
        <FormItem name="test">
          {(control) => {
            return <input className="border border-black" {...control} />;
          }}
        </FormItem>
        <button>Submit</button>
      </Form>
    </div>
  );
};

export default Home;
