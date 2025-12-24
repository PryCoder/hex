// App.jsx
import { useEffect, useState } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✅ initialize loading as true
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch all products
  useEffect(() => {
    let isMounted = true;

    fetch('http://localhost:1000/products')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setProducts(data.products);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch product detail
  const fetchProductDetail = (id) => {
    setDetailLoading(true);

    fetch(`http://localhost:1000/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedProduct(data.productDetail[0]);
        setDetailLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product detail:', err);
        setDetailLoading(false);
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Products</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li
              key={product.id}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
              onClick={() => fetchProductDetail(product.id)}
            >
              <strong>{product.productname}</strong> — Quantity:{' '}
              {product.quantity} — Quality: {product.quality} — Price: $
              {product.price}
            </li>
          ))}
        </ul>
      )}

      {selectedProduct && (
        <div
          style={{
            marginTop: '30px',
            borderTop: '1px solid #ccc',
            paddingTop: '20px',
          }}
        >
          <h2>Product Detail</h2>

          {detailLoading ? (
            <p>Loading details...</p>
          ) : (
            <div>
              <p>
                <strong>ID:</strong> {selectedProduct.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedProduct.productname}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedProduct.quantity}
              </p>
              <p>
                <strong>Quality:</strong> {selectedProduct.quality}
              </p>
              <p>
                <strong>Price:</strong> ${selectedProduct.price}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {selectedProduct.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
