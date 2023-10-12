import { useFormCenter, useWatch } from '../hooks';
import { Path } from '../types';
import { MyFormData } from './types';

export function UseWatchTest({ path }: { path: Path<MyFormData> }) {
  const form = useFormCenter<MyFormData>();
  const value = useWatch(path, form);

  return (
    <div>
      <p>Watched {path}</p>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}
