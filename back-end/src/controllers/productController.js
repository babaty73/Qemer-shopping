import { Product } from "../models/Product.js";
import { categoryNameForSlug } from "../lib/categories.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

const SORT_MAP = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

/** GET /api/products — public, supports search/category/sort/pagination. */
export async function listProducts(req, res, next) {
  try {
    const { search, category, sort = "newest", featured, exclude } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || DEFAULT_LIMIT));

    const query = {};

    if (search) query.$text = { $search: String(search) };

    if (category) {
      const categoryName = categoryNameForSlug(String(category));
      // An unrecognized category slug deliberately returns an empty result
      // set rather than silently ignoring the filter.
      query.category = categoryName ?? "__no_match__";
    }

    if (featured === "true") query.featured = true;
    if (exclude) query.slug = { $ne: String(exclude) };

    const [products, totalResults] = await Promise.all([
      Product.find(query)
        .sort(SORT_MAP[sort] ?? SORT_MAP.newest)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      page,
      totalPages: Math.max(1, Math.ceil(totalResults / limit)),
      totalResults,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/products/:slug — public. */
export async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

/** POST /api/products — admin only. Expects image URLs already uploaded via /api/uploads. */
export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/products/:id — admin only. Uses .save() (not findByIdAndUpdate) so the slug-regeneration hook runs when the name changes. */
export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/products/:id — admin only. */
export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/products/:id/toggle-featured — admin only. */
export async function toggleFeatured(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.featured = !product.featured;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/products/:id/toggle-stock — admin only. */
export async function toggleStock(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.inStock = !product.inStock;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
}
