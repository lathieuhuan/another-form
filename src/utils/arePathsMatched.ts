import { FormValues, Path } from '../types';
import stringToPath from './stringToPath';

export default <TFormValues extends FormValues>(
  path1: Path<TFormValues>,
  path2: Path<TFormValues>,
) => {
  let shortPath = stringToPath(path1);
  let longPath = stringToPath(path2);
  if (shortPath.length > longPath.length) [shortPath, longPath] = [longPath, shortPath];
  return shortPath.every((section, i) => section === longPath[i]);
};
