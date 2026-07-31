# Kemer Market

Mobile-first e-commerce catalog site for Kemer Market (Addis Ababa). Customers
browse the catalog and place orders through Telegram or WhatsApp — there is
deliberately no online checkout.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + React Router + Framer Motion
- **Backend:** Node.js + Express + MongoDB Atlas (Mongoose) + Cloudinary + JWT
- **Deploy:** Frontend → Vercel, Backend → Render

## Project layout

```
kemer-market/
  frontend/   React storefront + admin dashboard
  backend/    Express API (products, admin auth, image uploads)
```

## Local development

**Backend**
```bash
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, Cloudinary keys
npm run seed:admin -- youradmin you@example.com yourpassword
npm run dev                # http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env       # defaults point at localhost:5000
npm run dev                 # http://localhost:5173
```

Sign in at `/admin/login` with the account you seeded, then add your first
product — the storefront (`/`, `/shop`) reads live from the API, so it's
empty until you do.

## Environment variables

**backend/.env**
| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Signs admin session tokens — any long random string |
| `JWT_EXPIRES_IN` | Session length, e.g. `7d` |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Product image uploads |

**frontend/.env**
| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, e.g. `https://kemer-market-api.onrender.com/api` |
| `VITE_TELEGRAM_USERNAME` | Telegram username the order/contact buttons deep-link to |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number (international format, no `+`) |

## Deployment

**Backend → Render**
1. Push this repo to GitHub.
2. In Render: New → Blueprint, point it at the repo. `backend/render.yaml` defines the service.
3. Fill in the secret env vars in the Render dashboard (`MONGO_URI`, `JWT_SECRET`, `CORS_ORIGINS`, Cloudinary keys).
4. Once deployed, run the admin seed script locally against the production `MONGO_URI` (or temporarily via Render's shell) to create your first admin.

**Frontend → Vercel**
1. Import the repo in Vercel, set the project root to `frontend/`.
2. Set `VITE_API_BASE_URL` to your deployed Render URL + `/api`.
3. `frontend/vercel.json` handles SPA rewrites so routes like `/shop/some-product` survive a direct refresh.
4. Once you have the Vercel URL, add it to the backend's `CORS_ORIGINS`.

## Notable design decisions

- **No online payment/checkout, by design.** Order and contact actions all deep-link into Telegram/WhatsApp with a prefilled message — see `frontend/src/lib/utils.ts`.
- **Categories are a fixed list, not a database collection.** `frontend/src/lib/mockData.ts` and `backend/src/lib/categories.js` mirror the same four categories (name + slug). Growing beyond a fixed taxonomy is a natural next milestone (a proper `Category` collection).
- **No public admin registration.** Admin accounts are created via `npm run seed:admin`, not a signup form.
- **Removing an image in the product form** only removes it from that form's local state — it doesn't delete the Cloudinary asset. A scheduled cleanup job for orphaned assets is a reasonable future addition.

## Possible next milestones

Wishlist, cart, reviews, real online payment, delivery tracking, customer
accounts, coupons, analytics — all called out as future scope in the original
brief and intentionally not built here.
