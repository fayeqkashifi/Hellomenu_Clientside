export const checkPermission = (crud) => {
  const result = JSON.parse(atob(localStorage.getItem("role")));
  if (result === null) {
    return true;
  } else {
    return result.includes(crud);
  }
};

