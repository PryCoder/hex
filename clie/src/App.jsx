import { useEffect, useState, useCallback } from 'react';

const App = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // ================= STATE =================
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null); // selected product for detail
  const [form, setForm] = useState({
    productname: '',
    quantity: '',
    quality: 'High',
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= LOAD ALL PRODUCTS =================
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error(err);
      setError('Unable to load products');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    loadProducts(); // safe to call async function inside useEffect
  }, [loadProducts]);

  // ================= CREATE PRODUCT =================
  const saveProduct = async () => {
    try {
      await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      // reset form
      setForm({
        productname: '',
        quantity: '',
        quality: 'High',
        price: '',
        description: '',
      });
      loadProducts(); // reload products
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE PRODUCT =================
  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/product/${id}`, { method: 'DELETE' });
      if (selected && selected._id === id) setSelected(null);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH PRODUCT DETAIL =================
  const fetchProductDetail = async (id) => {
    setDetailLoading(true);
    setSelected(null);
    try {
      const res = await fetch(`${API_URL}/product/${id}`);
      const data = await res.json();
      setSelected(data.productDetail);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <h1>🛒 Product Store</h1>
      <p style={{ fontSize: 12, color: '#555' }}>API: {API_URL}</p>

      {/* ================= CREATE PRODUCT ================= */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Name"
          value={form.productname}
          onChange={(e) => setForm({ ...form, productname: e.target.value })}
        />
        <input
          placeholder="Qty"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          value={form.quality}
          onChange={(e) => setForm({ ...form, quality: e.target.value })}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={saveProduct}>Add</button>
      </div>

      <hr />

      {/* ================= PRODUCTS LIST ================= */}
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {products.map((p) => (
        <div
          key={p._id}
          style={{
            marginBottom: 10,
            padding: 10,
            border: '1px solid #ddd',
            borderRadius: 6,
            cursor: 'pointer',
          }}
          onClick={() => fetchProductDetail(p._id)}
        >
          <b>{p.productname}</b> — Qty: {p.quantity} — Quality: {p.quality} — $
          {p.price}
          <button
            style={{ marginLeft: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              deleteProduct(p._id);
            }}
          >
            ❌
          </button>
        </div>
      ))}

      {/* ================= PRODUCT DETAIL ================= */}
      {detailLoading && <p>Loading product details...</p>}

      {selected && !detailLoading && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: '2px solid #ccc',
            borderRadius: 8,
            background: '#f9f9f9',
          }}
        >
          <h3>Product Detail</h3>
          <p>
            <strong>ID:</strong> {selected._id}
          </p>
          <p>
            <strong>Name:</strong> {selected.productname}
          </p>
          <p>
            <strong>Quantity:</strong> {selected.quantity}
          </p>
          <p>
            <strong>Quality:</strong> {selected.quality}
          </p>
          <p>
            <strong>Price:</strong> ${selected.price}
          </p>
          <p>
            <strong>Description:</strong> {selected.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
