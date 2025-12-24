import { redis } from '../index.js';

export const getCachedData = (key) => async (req, res, next) => {
  try {
    const cached = await redis.get(key);

    if (cached) {
      console.log('cached');
      // STOP execution if cached
      return res.json({ products: JSON.parse(cached) });
    }

    // No cache, continue to route handler
    next();
  } catch (err) {
    console.error(err);
    next(); // still continue if Redis fails
  }
};
