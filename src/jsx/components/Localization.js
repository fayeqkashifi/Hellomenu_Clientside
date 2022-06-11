export const localization = (inputkey) => {
  // const data = JSON.parse(localStorage.getItem("locale"));
  const data =
    localStorage.getItem("locale") === null
      ? []
      : JSON.parse(localStorage.getItem("locale"));
  return data[inputkey];
};
