export const productPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        products: [{ id: "21",productname:"hi" }, { id: "23" ,productname:"ji"}]
      });
    }, 2000);
  });
  

  export const productDetail = (id) => new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        products: [{ id: id , name: `Product ${id}`}]
      });
    }, 2000);
  });
  