// products.js

// Simulate fetching all products
export const productPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      products: [
        {
          id: '21',
          productname: 'hi',
          quantity: 50,
          quality: 'High',
          price: 100,
          description: 'This is product hi',
        },
        {
          id: '23',
          productname: 'ji',
          quantity: 30,
          quality: 'Medium',
          price: 60,
          description: 'This is product ji',
        },
        {
          id: '24',
          productname: 'hello',
          quantity: 100,
          quality: 'Low',
          price: 20,
          description: 'This is product hello',
        },
      ],
    });
  }, 2000);
});

// Simulate fetching a single product by ID
export const productDetail = (id) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        products: [
          {
            id: id,
            productname: `Product ${id}`,
            quantity: Math.floor(Math.random() * 100),
            quality: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
            price: Math.floor(Math.random() * 500),
            description: `This is the detailed description for product ${id}`,
          },
        ],
      });
    }, 2000);
  });
