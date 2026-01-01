// ================= LOAD ENV =================
import dotenv from 'dotenv';
dotenv.config();

// ================= IMPORTS =================
import express from 'express';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import cors from 'cors';
import { getCachedData } from './middleware/redis.js';

// ================= APP =================
const app = express();
app.use(express.json());

// ================= CORS =================
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ================= MONGO =================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// ================= SCHEMA =================
const productSchema = new mongoose.Schema(
  {
    productname: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    quality: { type: String, enum: ['High', 'Medium', 'Low'] },
    price: { type: Number, required: true },
    description: String,
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

// ================= REDIS =================
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redis.on('connect', () => console.log('Redis connected'));

// ================= ROUTES =================
app.get('/', (_, res) => res.send('Backend running'));

/* ================= CREATE ================= */
app.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  await redis.del('products');
  res.status(201).json(product);
});

/* ================= READ ALL ================= */
app.get('/products', getCachedData('products'), async (req, res) => {
  const products = await Product.find();
  await redis.setex('products', 10, JSON.stringify(products));
  res.json({ products });
});

/* ================= READ ONE ================= */
app.get('/product/:id', async (req, res) => {
  const key = `product:${req.params.id}`;

  const cached = await redis.get(key);
  if (cached) return res.json({ productDetail: JSON.parse(cached) });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });

  await redis.setex(key, 60, JSON.stringify(product));
  res.json({ productDetail: product });
});

/* ================= UPDATE ================= */
app.put('/product/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  await redis.del('products');
  await redis.del(`product:${req.params.id}`);

  res.json(product);
});

/* ================= DELETE ================= */
app.delete('/product/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  await redis.del('products');
  await redis.del(`product:${req.params.id}`);

  res.json({ message: 'Product deleted' });
});

// ================= START =================
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
