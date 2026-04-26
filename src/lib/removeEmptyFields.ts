export const removeEmptyFields = (obj: Record<string, any>) => {
  const newObj: Record<string, any> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      newObj[key] = value;
    }
  });

  return newObj;
};