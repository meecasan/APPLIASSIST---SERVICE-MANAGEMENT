# Registration & Authentication Module

## Overview
This module handles user registration, authentication, and account management including:
- **User Registration**: Customer and technician sign-up
- **Account Creation**: Create business and personal accounts
- **Authentication**: Login and session management
- **Business Setup**: Guided business profile setup
- **Account Management**: User profiles and settings

## Module Structure

```
registration/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── CreateAccount.tsx
│   │   │   ├── CustomerLogin.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── BusinessProfileSetup.tsx
│   │   │   ├── BusinessSetupWizard.tsx
│   │   │   ├── CustomerDashboard.tsx
│   │   │   └── ... (other auth-related components)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── services/
│   ├── styles/
│   └── vite-env.d.ts
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── usersController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── usersRoutes.js
│   └── validation/
│       └── authSchemas.js
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
- User registration (customers, technicians, shop owners)
- Login and authentication
- JWT token management
- Business profile setup wizard
- User profile management
- Account verification and validation

## Dependencies
- React 18.3.1
- React Hook Form (for form handling)
- Axios (for API calls)
- Material-UI components
- Tailwind CSS

## Security
- Passwords are hashed using bcrypt
- JWT tokens for session management
- Protected routes and endpoints
- Input validation using Joi schemas

## Git Workflow
1. Create a feature branch from `registration`
2. Make changes only within this module
3. Commit and push to your branch
4. Create pull request targeting `registration`

## Integration Points
- Uses shared authentication middleware from `shared/` module
- Shares database schema with other modules
- Users created here are referenced in store and service modules

## Team
Assigned to: Registration & Authentication Team

## Notes
- Authentication logic should stay in this module
- User creation should follow consistent validation
- Coordinate with other modules on user role definitions
- Keep registration flow user-friendly and clear
