export const stringSorting = (a, b, name) => {
  return a[name]?.localeCompare(b[name]);
};

export const numberSorting = (a, b, name) => {
  return a[name] - b[name];
};
