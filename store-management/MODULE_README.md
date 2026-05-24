# Store Management Module

## Overview
This module handles all store-related operations including:
- **Product Management**: Add, edit, delete products
- **Stock Management**: Track inventory, update stock levels
- **Order Management**: Process and manage customer orders
- **Shop Operations**: Manage shop profiles and settings

## Module Structure

```
store-management/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ProductsManagement.tsx
│   │   │   ├── StocksManagement.tsx
│   │   │   ├── OrderManagement.tsx
│   │   │   ├── ShopOwnerDashboard.tsx
│   │   │   └── ... (other store-related components)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── services/
│   ├── styles/
│   └── vite-env.d.ts
├── server/
│   ├── controllers/
│   │   ├── productsController.js
│   │   ├── storesController.js
│   │   ├── ordersController.js
│   │   └── storeController.js
│   ├── routes/
│   │   ├── productsRoutes.js
│   │   ├── storesRoutes.js
│   │   ├── ordersRoutes.js
│   │   └── storeRoutes.js
│   └── validation/
│       ├── productSchemas.js
│       ├── storeSchemas.js
│       └── orderSchemas.js
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
The backend files reference shared config and middleware from the `shared/` module.

## Key Features
- Product catalog management
- Stock tracking and updates
- Order processing and tracking
- Shop profile management
- Inventory history

## Dependencies
- React 18.3.1
- Recharts (for analytics)
- Axios (for API calls)
- Material-UI components
- Tailwind CSS

## Git Workflow
1. Create a feature branch from `store-management`
2. Make changes only within this module
3. Commit and push to your branch
4. Create pull request targeting `store-management`

## Integration Points
- Uses shared authentication from `shared/` module
- Shares database schema with other modules
- Uses common UI components from `shared/`

## Team
Assigned to: Store Management Team

## Notes
- All store-related features should remain in this module
- Avoid cross-module imports except from `shared/`
- Keep API endpoints focused on store operations
