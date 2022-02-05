import axios from "axios";

export const getThemplate = async (branchId) => {
  try {
    const result = await axios.get(`/api/GetTempBasedOnBranch/${branchId}`);
    if (result.data.status === 200) {
      return result.data.fetchData[0];
    }
  } catch (err) {
    console.error(err);
  }
};
export const getBranch = async (branchId) => {
  try {
    const result = await axios.get(`/api/GetBranchForShow/${branchId}`);
    if (result.data.status === 200) {
      return result.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};
export const getCategoriesBasedProduct = async (branchId) => {
  try {
    const result = await axios.get(
      `/api/getCategoriesBasedProducts/${branchId}`
    );
    if (result.data.status === 200) {
      return result.data.fetchData;
    }
  } catch (err) {
    console.error(err);
  }
};
export const getProductBasedOnCategory = async (catId) => {
  try {
    const result = await axios.get(`/api/GetProductsBasedCategory/${catId}`);
    if (result.data.status === 200) {
      return result.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};
export const getProductBasedOnSubCategory = async (subCatId) => {
  try {
    const result = await axios.get(
      `/api/GetProductsBasedOnSubCategory/${subCatId}`
    );
    if (result.data.status === 200) {
      return result.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};
export const getProduct = async (proId) => {
  try {
    const result = await axios({
      method: "GET",
      url: `/api/GetProduct/${proId}`,
    });
    return result;
  } catch (err) {
    console.error(err);
  }
};
export const getvariations = async (proId) => {
  try {
    const result = await axios({
      method: "GET",
      url: `/api/Getvariations/${proId}`,
    });
    return result.data.fetchData;
  } catch (err) {
    console.error(err);
  }
};
export const getTables = async (branchId) => {
  try {
    const result = await axios.get(`/api/GetTables/${branchId}`);
    if (result.data.status === 200) {
      return result.data.fetchData;
    }
  } catch (err) {
    console.error(err);
  }
};
export const checkTheTbl = async (data) => {
  try {
    const result = await axios.get(`/api/checkTheTbl/${data}`);
    if (result.data.status === 200) {
      return result.data.fetchData;
    }
  } catch (err) {
    console.error(err);
  }
};
export const insertOrder = async (data) => {
  try {
    const result = await axios.post("/api/InsertOrder", data);
    if (result.data.status === 200) {
      return result.data.message;
    }
  } catch (err) {
    console.error(err);
  }
};
// export const addExistingItem = async (data) => {
//   try {
//     const result = await axios.post("/api/InsertOrder", data);
//     if (result.data.status === 200) {
//       return result.data.message;
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };
export const addItemWithdoutDetails = async (id, cart, products) => {
  try {
    const check = cart.every((item) => {
      return item.id !== id;
    });
    if (check) {
      const data = products.filter((product) => {
        return product.id === id;
      });
      localStorage.setItem("cart", JSON.stringify(cart.concat(data)));
      return cart.concat(data);
    }
  } catch (err) {
    console.error(err);
  }
};
export const remCartItem = async (id, cart) => {
  try {
    const data = cart.filter((cart) => {
      return cart.id !== id;
    });
    localStorage.setItem("cart", JSON.stringify(data));
    return data;
  } catch (err) {
    console.error(err);
  }
};
export const emptyCart = async () => {
  try {
    localStorage.removeItem("cart");
  } catch (err) {
    console.error(err);
  }
};
export const handleDecrementQuantity = async (qty, id, cart) => {
  try {
    if (qty > 1) {
      let vars = cart.map((item) =>
        id === item.id
          ? {
              ...item,
              qty: item.qty - (item.qty > 0 ? 1 : 0),
            }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(vars));
      return vars;
    }
    // else {
    //   return null;
    // }
  } catch (err) {
    console.error(err);
  }
};
export const handelIncrementQuantity = async (qty, id, stock, cart) => {
  try {
    if (stock > qty) {
      let vars = cart.map((item) =>
        id === item.id ? { ...item, qty: item.qty + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(vars));
      return vars;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};
export const recIncrementQuantity = async (qty, id, stock, recs) => {
  try {
    if (stock > qty) {
      let vars = recs.map((item) =>
        id === item.value ? { ...item, qty: item.qty + 1 } : item
      );
      return vars;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};
export const recDecrementQuantity = async (qty, id, recs) => {
  try {
    if (qty > 1) {
      let vars = recs.map((item) =>
        id == item.value
          ? { ...item, qty: item.qty - (item.qty > 0 ? 1 : 0) }
          : item
      );
      return vars;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};