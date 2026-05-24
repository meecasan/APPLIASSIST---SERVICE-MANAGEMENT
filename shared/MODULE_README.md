# Shared Core Module

## Overview
This module contains shared resources used by all modules including:
- **Database Configuration**: MySQL connection and management
- **Authentication Middleware**: JWT verification and token handling
- **API Routes**: Admin and notification endpoints
- **Database Schema**: Tables and seed data
- **Server Infrastructure**: Express server setup and WebSocket configuration

## Module Structure

```
shared/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminNavbar.tsx
│   │   │   ├── MarketplaceLayout.tsx
│   │   │   └── ... (shared UI components)
│   │   ├── hooks/
│   │   └── services/
│   ├── styles/
│   └── vite-env.d.ts
├── server/
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── roleMiddleware.js  # Role-based access
│   │   ├── upload.js       # File upload handling
│   │   └── validate.js     # Request validation
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── contactController.js
│   │   └── notificationsController.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── contactRoutes.js
│   │   └── notificationsRoutes.js
│   ├── validation/
│   │   └── notificationSchemas.js
│   ├── sql/
│   │   ├── schema.sql      # Database schema
│   │   └── seed.sql        # Sample data
│   ├── scripts/
│   │   ├── seedData.js
│   │   ├── seedDemoUsers.js
│   │   ├── seedAdmin.js
│   │   └── inspectSchema.js
│   ├── server.js           # Main Express server
│   ├── realtime.js         # WebSocket setup
│   ├── seed.js             # Database seeding
│   ├── uploads/            # User uploads directory
│   └── postman_collection.json
├── package.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Frontend Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

### Backend Development
```bash
# Install dependencies
pnpm install

# Start development server with nodemon
pnpm run server:dev

# Start production server
pnpm run server:start

# Seed database with sample data
pnpm run seed

# Seed demo users
pnpm run seed:demo

# Seed admin user
pnpm run seed:admin
```

## Key Components

### Database Configuration
- MySQL connection pool
- Environment-based configuration
- Connection pooling for performance

### Authentication Middleware
- JWT token verification
- User role validation
- Protected route handling
- Token refresh logic

### API Endpoints
- Admin management endpoints
- Contact/support endpoints
- Notification management
- Cross-module utilities

## Database Setup

```sql
# Import schema
mysql -u root -p databasename < server/sql/schema.sql

# Run seeds
node server/seed.js
```

## Environment Variables
Create a `.env` file in the shared folder:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=appliassist
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Security Considerations
- All database queries use parameterized statements
- JWT tokens expire after configurable duration
- Password hashing with bcrypt
- CORS configuration
- File upload restrictions

## Git Workflow
1. Create a feature branch from `shared`
2. Make changes only to shared resources
3. **Coordinate with all teams** before making changes to:
   - Database schema
   - Authentication middleware
   - Shared API endpoints
4. Commit and push to your branch
5. Create pull request requiring review from all teams

## Importing Shared Resources

### In Other Modules
```javascript
// Controllers - reference shared middleware
import { authMiddleware } from '../shared/server/middleware/authMiddleware.js'

// Database - use shared config
import db from '../shared/server/config/db.js'
```

## Dependencies
- Express (web framework)
- MySQL2 (database driver)
- JWT (authentication)
- Bcrypt (password hashing)
- Socket.io (real-time communication)
- Joi (validation)
- Multer (file uploads)
- CORS (cross-origin)

## Team
Shared Infrastructure Team - All teams contribute

## Important Notes
⚠️ **READ BEFORE MAKING CHANGES TO THIS MODULE**
- Changes here affect ALL modules
- Coordinate with all teams before schema changes
- Test thoroughly before committing
- Document any new shared APIs
- Maintain backward compatibility when possible

## Common Issues & Solutions

### Database Connection Failed
- Verify MySQL is running
- Check `.env` file credentials
- Ensure database exists

### JWT Token Expired
- Refresh token is available in response headers
- Client should auto-renew expired tokens

### CORS Errors
- Verify client URL is in CORS whitelist
- Check credentials setting in requests

## Support
For questions or issues:
1. Check existing middleware documentation
2. Review database schema in `sql/schema.sql`
3. Contact infrastructure team
