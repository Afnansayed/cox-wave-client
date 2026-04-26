
# Cox Wave 
Cox Wave Client is a polished Next.js application for the CoxWave travel and event booking platform. It delivers a tailored experience for guests, event owners, and administrators with public discovery pages, role-based dashboards, booking flows, and profile management.

## Live URLs

- Live site: [https://cox-wave-client.vercel.app/]
- Backend API: [https://cox-wave-server.vercel.app/]

## Project Description

This frontend powers a role-based booking platform centered on Cox's Bazar experiences. Visitors can browse featured events, view event details, and proceed to booking. Signed-in users can manage bookings and accounts, while owners can create and update events from a dedicated dashboard. Administrators have access to operational views for events, bookings, owners, and reviews.

## Features

- Public home page with featured events, hero section, location highlights, partner section, live feed, and reviews
- Public event catalog with server-side pagination, sorting, filtering, and search
- Event details pages with gallery images, host information, pricing, and booking access
- Booking flow with prefilled event selection and guest count support
- Customer dashboard for bookings, account updates, and password changes
- Owner dashboard for event management, event details, create, edit, and account settings
- Admin dashboard for managing events, bookings, owners, reviews, and profile settings
- Authentication pages for login, registration, forgot password, and reset password
- Form handling with TanStack Form and validation with Zod
- Data fetching and automatic cache invalidation with TanStack Query
- Responsive UI built with Tailwind CSS, Radix UI primitives, and Lucide icons

## Key Routes

- Public pages: home, events, event details, contact, FAQ, login, register, forgot password, reset password, payment success, payment failed
- Customer dashboard: overview, account, booking list, booking details, change password, account update
- Owner dashboard: overview, event list, event details, create event, edit event, booking list, booking details, account, change password
- Admin dashboard: overview, event list, event details, booking list, booking details, review list, owner management, create owner, account, change password

## Technologies Used

- Next.js 16.2.3
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- TanStack Form
- Zod
- Redux Toolkit
- Axios
- Sonner
- Lucide React
- Radix UI

## Setup Instructions

### Prerequisites

- Node.js 18 or later
- pnpm 10 or later

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root and add your backend URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api-url.com
```

If you deploy to Vercel, add the same variable in the project settings under Environment Variables.

### 3. Run the development server

```bash
pnpm dev
```

### 4. Build for production

```bash
pnpm build
pnpm start
```

## Available Scripts

- `pnpm dev` - start the development server
- `pnpm build` - create a production build
- `pnpm start` - start the production server
- `pnpm lint` - run Next.js linting

## Deployment Notes

- This project is ready for Vercel deployment.
- Set `NEXT_PUBLIC_API_BASE_URL` in both local and production environments.
- The app uses App Router layouts with route groups for shared, customer, owner, and admin experiences.

