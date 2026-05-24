# APPLIASSIST - Server

Backend for Appliance Repair & Store Management

Setup

1. Create database and run schema:
   - Import `server/sql/schema.sql` into MySQL (creates `appliassist_db`).
2. (Optional) run `server/sql/seed.sql` to add example admin.
   Or run the seeder script to create/update the admin with a hashed password:

```bash
cd server
npm run seed-admin          # uses admin@example.com / admin by default
# or provide: npm run seed-admin -- user@example.com username password
```
3. Install dependencies and run server:

```bash
cd server
npm install
node server.js
```

API
- `POST /api/auth/register-customer`
- `POST /api/auth/register-technician`
- `POST /api/auth/register-store-owner`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `GET /api/stores`, `POST /api/stores`, etc.

Postman collection: `server/postman_collection.json`

Notes:
- Ensure `.env` contains `JWT_SECRET` and DB credentials (see `server/config/db.js`).
- For production, set secure JWT secret and enable HTTPS.
