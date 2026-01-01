import { useEffect, useState } from 'react';

const App = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    productname: '',
    quantity: '',
    quality: 'High',
    price: '',
    description: '',
  });

  const loadProducts = () =>
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data.products));

  useEffect(() => {
    loadProducts();
  }, []);

  const saveProduct = () => {
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then(() => {
      setForm({});
      loadProducts();
    });
  };

  const deleteProduct = (id) => {
    fetch(`${API_URL}/product/${id}`, { method: 'DELETE' })
      .then(loadProducts);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>🛒 Product Store</h1>

      {/* CREATE */}
      <div>
        <input placeholder="Name" onChange={e => setForm({...form, productname:e.target.value})}/>
        <input placeholder="Qty" onChange={e => setForm({...form, quantity:e.target.value})}/>
        <input placeholder="Price" onChange={e => setForm({...form, price:e.target.value})}/>
        <button onClick={saveProduct}>Add</button>
      </div>

      <hr/>

      {/* LIST */}
      {products.map(p => (
        <div key={p._id} style={{ marginBottom: 10 }}>
          <b>{p.productname}</b> - ${p.price}
          <button onClick={() => deleteProduct(p._id)}>❌</button>
        </div>
      ))}
    </div>
  );
};

export default App;
