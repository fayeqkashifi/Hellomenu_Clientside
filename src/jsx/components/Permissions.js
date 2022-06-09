export const checkPermission = (crud) => {
  const result =
    localStorage.getItem("role") === null
      ? []
      : JSON.parse(atob(localStorage.getItem("role")));
  // console.log(result);

  if (result === null) {
    return true;
  } else {
    return result.includes(crud);
  }
};
