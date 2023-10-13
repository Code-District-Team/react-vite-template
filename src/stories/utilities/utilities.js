export const stringSorting = (a, b, name) => {
  return a[name]?.localeCompare(b[name]);
};

export const numberSorting = (a, b, name) => {
  return a[name] - b[name];
};

export const fetchUsers = async () => {
  const response = await fetch("http://localhost:8082/user/get-all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  return responseData.data;
};
