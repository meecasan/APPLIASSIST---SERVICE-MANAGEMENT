# Service Management Module

## Overview
This module handles all service-related operations including:
- **Service Offerings**: Create and manage available services
- **Service Requests**: Handle customer service requests
- **Technician Management**: Manage technician profiles and availability
- **Booking & Scheduling**: Schedule service appointments
- **Service Tracking**: Track service status and completion

## Module Structure

```
service-management/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ServicesOffered.tsx
│   │   │   ├── ServiceRequestsTable.tsx
│   │   │   ├── TechnicianDashboard.tsx
│   │   │   ├── BookingFlow.tsx
│   │   │   ├── ServiceSchedule.tsx
│   │   │   └── ... (other service-related components)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── services/
│   ├── styles/
│   └── vite-env.d.ts
├── server/
│   ├── controllers/
│   │   ├── servicesController.js
│   │   ├── serviceRequestsController.js
│   │   └── technicianController.js
│   ├── routes/
│   │   ├── servicesRoutes.js
│   │   ├── serviceRequestsRoutes.js
│   │   └── technicianRoutes.js
│   └── validation/
│       └── serviceSchemas.js
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
- Service catalog management
- Service request tracking and management
- Technician profile and availability management
- Booking system with scheduling
- Real-time service status updates
- Service completion tracking

## Dependencies
- React 18.3.1
- React Calendar (for scheduling)
- React Hook Form (for forms)
- Axios (for API calls)
- Material-UI components
- Socket.io (for real-time updates)

## Git Workflow
1. Create a feature branch from `service-management`
2. Make changes only within this module
3. Commit and push to your branch
4. Create pull request targeting `service-management`

## Integration Points
- Uses shared authentication from `shared/` module
- Shares database schema with other modules
- Uses common UI components from `shared/`
- Real-time communication via Socket.io

## Team
Assigned to: Service Management Team

## Notes
- All service-related features should remain in this module
- Avoid cross-module imports except from `shared/`
- Keep API endpoints focused on service operations
- Technician integration should coordinate with registration module
