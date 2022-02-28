export const localization = (inputkey) => {
  const data = JSON.parse(localStorage.getItem("locale"));
  return data[inputkey];
};
