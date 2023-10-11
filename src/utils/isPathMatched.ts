import { FormValues, Path } from "../types";
import stringToPath from "./stringToPath";

export default <TFormValues extends FormValues>(path: Path<TFormValues>, pathToCompare: Path<TFormValues>) => {
  let shortPath = stringToPath(path);
  let longPath = stringToPath(pathToCompare);
  if (shortPath.length > longPath.length) [shortPath, longPath] = [longPath, shortPath];
  return shortPath.every((section, i) => section === longPath[i]);
};
