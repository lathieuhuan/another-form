import { useFormCenter } from 'another-form';
import { Button, ButtonProps } from './Button';

type FooterProps = {
  renderTimes?: number;
  withReset?: boolean;
  buttons?: ButtonProps[];
};
export const Footer = (props: FooterProps) => {
  const form = useFormCenter();

  return (
    <div className="flex justify-between items-end">
      {props.renderTimes === undefined ? null : (
        <span className="text-white">
          Render times: <span className="font-bold">{props.renderTimes}</span>
        </span>
      )}

      <div className="space-x-4">
        {props.buttons?.map((button, i) => {
          return <Button key={i} {...button} />;
        })}
        {props.withReset ?? true ? (
          <Button variant="default" onClick={form.resetValues}>
            Reset
          </Button>
        ) : null}
        <Button type="submit">Submit</Button>
      </div>
    </div>
  );
};
