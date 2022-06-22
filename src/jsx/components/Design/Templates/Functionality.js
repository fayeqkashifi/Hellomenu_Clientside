import axios from "axios";

export const getThemplate = async (branchId, config) => {
  try {
    // const result = await axios.get(, {
    //   cancelToken: config.token,
    // });
    const result = await axios({
      method: "GET",
      url: `/api/getTempBasedOnBranch/${branchId}`,
      cancelToken: config.token,
    });
    if (result !== undefined) {
      if (result?.data?.status === 200) {
        return result?.data?.fetchData;
      }
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("cancelled");
    } else {
      throw error;
    }
  }
};
export const getThemes = async (branchId, config) => {
  try {
    // const result = await axios.get(`/api/activeTheme/${branchId}`, {
    //   cancelToken: config.token,
    // });
    const result = await axios({
      method: "GET",
      url: `/api/activeTheme/${branchId}`,
      cancelToken: config.token,
    });
    if (result !== undefined) {
      if (result?.data?.status === 200) {
        return result?.data?.fetchData;
      }
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("cancelled");
    } else {
      throw error;
    }
  }
};
export const getBranch = async (branchId, config) => {
  try {
    const result = await axios({
      method: "GET",
      url: `/api/getBranchForShow/${branchId}`,
      cancelToken: config.token,
    });
    if (result !== undefined) {
      // const result = await axios.get(`/api/getBranchForShow/${branchId}`);
      if (result.data.status === 200) {
        return result.data.data;
      }
    }
  } catch (err) {
    console.error(err);
  }
};
export const getProductsBasedOnBranchId = async (
  branchId,
  page,
  langId,
  config
) => {
  try {
    const result = await axios.get(
      `/api/getProductsBasedOnBranchId/${branchId}?page=${page}`,
      {
        params: {
          langId: langId,
        },
        cancelToken: config.token,
      }
    );
    if (result?.data?.status === 200) {
      return result?.data?.fetchData;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("cancelled");
    } else {
      throw err;
    }
  }
};
export const getCategoriesBasedProduct = async (branchId, langId, config) => {
  try {
    // const result = await axios.get(`/api/getCategoriesBasedProducts`, {
    //   params: {
    //     branchId: branchId,
    //     langId: langId,
    //   },
    // });
    const result = await axios({
      method: "GET",
      url: `/api/getCategoriesBasedProducts`,
      params: {
        branchId: branchId,
        langId: langId,
      },
      cancelToken: config.token,
    });
    if (result !== undefined) {
      if (result.data.status === 200) {
        return result.data.fetchData;
      }
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("cancelled");
    } else {
      throw err;
    }
  }
};
export const getProductBasedOnCategory = async (
  catId,
  page,
  langId,
  config
) => {
  try {
    const result = await axios.get(
      `/api/getProductsBasedCategory/${catId}?page=${page}`,
      {
        params: {
          langId: langId,
        },
        cancelToken: config.token,
      }
    );
    if (result?.data?.status === 200) {
      return result?.data?.data;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("cancelled");
    } else {
      throw err;
    }
  }
};
export const getProductBasedOnSubCategory = async (
  subCatId,
  page,
  langId,
  config
) => {
  try {
    const result = await axios.get(
      `/api/getProductsBasedOnSubCategory/${subCatId}?page=${page}`,
      {
        params: {
          langId: langId,
        },
        cancelToken: config.token,
      }
    );
    if (result?.data?.status === 200) {
      return result?.data?.data;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("cancelled");
    } else {
      throw err;
    }
  }
};
export const getProduct = async (proId, langId, config) => {
  try {
    const result = await axios({
      method: "GET",
      url: `/api/getProduct/${proId}`,
      params: {
        langId: langId,
      },
      cancelToken: config.token,
    });
    return result;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("cancelled");
    } else {
      throw err;
    }
  }
};
export const getVariations = async (proId, config) => {
  try {
    const result = await axios({
      method: "GET",
      url: `/api/getVariations/${proId}`,
      cancelToken: config.token,
    });
    return result?.data?.fetchData;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("cancelled");
    } else {
      throw err;
    }
  }
};
export const getTables = async (branchId) => {
  try {
    const result = await axios.get(`/api/getTablesAll/${branchId}`);
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
    const result = await axios.post("/api/insertOrder", data);
    if (result.data.status === 200) {
      return result.data;
    }
  } catch (err) {
    console.error(err);
  }
};

export const addItemWithdoutDetails = async (id, cart, products, name) => {
  try {
    const check = cart.every((item) => {
      return item.id !== id;
    });
    if (check) {
      const array = [];
      const result = await axios({
        method: "GET",
        url: `/api/getVariations/${id}`,
      });
      if (result?.data?.fetchData !== "") {
        return "";
      } else {
        const data = products.filter((product) => {
          return product.id === id;
        });
        array.push({
          id: data[0].id,
          qty: data[0].qty,
          // stock: data[0].stock,
          // price: data[0].price,
          // currency_code: data[0].currency_code,
          ingredients: [],
          extras: [],
          recommendations: [],
        });
        localStorage.setItem(name, JSON.stringify(cart.concat(array)));
      }
      return cart.concat(array);
    }
  } catch (err) {
    console.error(err);
  }
};
export const remCartItem = async (id, cart, branch) => {
  try {
    const data = cart.filter((cart) => {
      return cart.id !== id;
    });
    localStorage.setItem(btoa("cart" + branch.id), JSON.stringify(data));
    return data;
  } catch (err) {
    console.error(err);
  }
};
export const emptyCart = async (branch) => {
  try {
    localStorage.removeItem(btoa("cart" + branch.id));
  } catch (err) {
    console.error(err);
  }
};
export const handleDecrementQuantity = async (qty, id, cart, branch) => {
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
      localStorage.setItem(btoa("cart" + branch.id), JSON.stringify(vars));
      return vars;
    }
    // else {
    //   return null;
    // }
  } catch (err) {
    console.error(err);
  }
};
export const handelIncrementQuantity = async (qty, id, stock, cart, branch) => {
  try {
    if (stock > qty) {
      let vars = cart.map((item) =>
        id === item.id ? { ...item, qty: item.qty + 1 } : item
      );
      localStorage.setItem(btoa("cart" + branch.id), JSON.stringify(vars));
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
