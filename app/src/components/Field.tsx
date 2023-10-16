type FieldProps = {
  label: string;
  description?: string;
  errors?: string[];
  isRequired?: boolean;
  children: React.ReactNode;
};
export const Field = (props: FieldProps) => {
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
