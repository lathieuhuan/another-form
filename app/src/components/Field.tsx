type FieldProps = {
  label: string;
  description?: string;
  errors?: string[];
  isRequired?: boolean;
  children: React.ReactNode;
};
export const Field = (props: FieldProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium text-light-1">
        {props.isRequired ? <span className="text-red-600">* </span> : null}
        {props.label}
      </label>
      {props.description ? <span>{props.description}</span> : null}
      {props.children}
      {props.errors?.length ? (
        <div className="text-red-600">
          {props.errors?.map((error, i) => <p key={i}>{error}</p>)}
        </div>
      ) : null}
    </div>
  );
};
