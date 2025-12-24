import express from "express";
import { productPromise ,productDetail} from "./products.js";
import Redis from "ioredis";
import { getCachedData } from "./middleware/redis.js";
const app = express();
;

//const redis = createClient({ url: "redis://localhost:6379" });

export const redis = new Redis({
    host:"localhost",
    port:6379,
    password:"",
});
redis.on("connect",()=>{
    console.log("connected to redis");
})
app.get("/", (req, res) => {
  res.send("hello");
});



app.get("/products",getCachedData("products"), async (req, res) => {
   
      // Fetch fresh data
      const data = await productPromise;
  
      // Cache ONLY the array
      await redis.setex("products", 10, JSON.stringify(data.products));
  
      // Send fresh response
      return res.json({
        products: data.products
      });
  
   
  });
  app.get("/product/:id",  async (req, res) => {
    try {
      const { id } = req.params;
      const key = `products:${id}`;
  
      // Check cache
      const cached = await redis.get(key);
      if (cached) {
        console.log("cached");
        return res.json({
          productDetail: JSON.parse(cached)
        });
      }
  
      // Fetch fresh data
      const product = await productDetail(id);
  
      // Cache the result for 60 seconds
      await redis.setex(key, 60, JSON.stringify(product));
  
      // Return response
      return res.json({
        productDetail: product
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


app.listen(3000, () => {
  console.log("server is running on port 3000");
});
