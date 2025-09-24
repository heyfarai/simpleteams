# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a basketball league website built with Next.js 15, TypeScript, and Tailwind CSS. The project uses shadcn/ui components and integrates with multiple services for a complete league management solution. It deploys to netlify.

## Commands

### Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Package Management

- Uses pnpm as package manager
- `pnpm install` - Install dependencies

## Architecture

### Framework & Core

- Next.js 15 with App Router
- TypeScript with strict mode enabled
- React 18 with client components predominant

### UI & Styling

- shadcn/ui component library (New York style)
- Tailwind CSS v4 with CSS variables
- Radix UI primitives for complex components
- Lucide React for icons

### State Management & Data

- TanStack Query for server state with custom retry logic
- Custom query client configuration with 1-minute stale time
- **Service/Repository Architecture** - Complete domain model with service and repository layers for database-agnostic data access

### Data & Content Management

- **Supabase** - Authentication and user management only
  - Use supabase mcp always to connect
  - Use supabse project_id: "bzmromdmfwfaiuwwfscj"
  - try mcp tools before executing SQL using mcp
- Use repositories always, no direct connections
- **Stripe** - Registration payments via hosted checkout

### Project Structure

### Key Features

- **Dashboard** with roster management, payments, and team overview
- Player and team profiles
- Game scheduling and tracking
- **Multi-step registration system** with package selection and Stripe payment integration
- League divisions and structure display with accurate team assignments
- Team management for registrants with enhanced stats display (PF, PA, Win%, games played)

### Development Notes

- Middleware bypasses auth in development mode
- ESLint and TypeScript errors ignored during builds (configured for rapid iteration)
- Uses path aliases (@/) for clean imports
- Environment variables in .env.local
- Images are unoptimized for deployment flexibility

### Authentication & Payments

- Supabase Auth for user authentication
- Stripe hosted checkout for registration payments
- Each registrant can manage their team details after authentication

### Data Layer Improvements

- **Database-Agnostic Design** - Service layer for Supabase

# Refactoring

When I ask you to refactor make my code:

- Modular: Each handler can be tested/modified independently
- Extensible: Easy to add new event handlers
- Reusable: Services can be used elsewhere (team creation, emails)
- Maintainable: Clear separation of concerns
- Follows conventions: Uses existing project patterns (/lib, /hooks, etc.)
- the big switch to supabase

# Current Development Plans

Check off completed items in this doc as you make progress.

## ✅ Subscription Management (COMPLETED)

- ✅ End-to-end subscription schedules working
- ✅ Stripe Customer Portal integration working
- ✅ Payment progress display working
- ✅ Database query fixed for billing portal

## ✅ Configurable Installments with Enhanced UX (COMPLETED)

### 1. **Product Configuration System**

- ✅ Add installment configuration to package definitions
- ✅ Allow per-product installment settings (number of payments, eligibility)
- ✅ Make installment availability configurable per package

### 2. **User Preference Management**

- ✅ Add installment toggle to package selection page
- ✅ Store preference in localStorage with key like `payment-preference-${userId}`
- ✅ Auto-restore preference on page reload
- ✅ Don't ask again during checkout flow

### 3. **Enhanced Package Selection UI**

- ✅ Add toggle switch component (Monthly/Pay in Full)
- ✅ Show monthly payment breakdown when installments selected
- ✅ Visual indicator for savings/convenience
- ✅ Toggle inspiration: Monthly/Annually switch with "Save up to 10%" badge

### 4. **Payment Summary Enhancement**

- ✅ Collapsible payment schedule section
- ✅ Show all payment dates with amounts
- ✅ Clear breakdown of total cost
- ✅ Payment method preview (integrate into checkout)

### 5. **Technical Implementation**

- ✅ Create `useInstallmentPreference` hook for state management
- ✅ Add package configuration interface
- ✅ Update checkout logic to use configuration instead of hardcoded values
- ✅ Add payment schedule calculation utilities
- ✅ Remove toggle from checkout page (persist state from package selection)
- ✅ Fix toggle visual state update issues

## ✅ Architecture Cleanup (COMPLETED)

### Issues Fixed (Architecture Violations)

- ✅ Add Missing Repository Interfaces (`PaymentRepository`, `RegistrationRepository`)
- ✅ Create Service Layer (`PaymentService`, `RegistrationService`, `StripeService`)
- ✅ Add Domain Models (`Payment`, `Subscription`, `Registration`)
- ✅ Refactor API Routes (move business logic to services)
  - ✅ Moving payment logic from /api/billing/portal/route.ts into PaymentService
  - ✅ Updating routes to use the service layer instead of direct database calls
  - ✅ Following the existing project patterns established in /lib/services/
  - ✅ Created BillingService to orchestrate PaymentService and StripeService
  - ✅ Created SupabasePaymentRepository implementation
  - ✅ Updated Repository Factory with PaymentRepository

### Remaining Tasks (BACKLOG)

- [ ] Wire up and migrate Games to supabase
- [ ] Create Data Hooks (`use-payments.ts`, `use-registration.ts`)
- [ ] Update Components (remove direct Supabase calls)
- [ ] In dashboard expose url for selected team /dashboard/[team]/[roster]
- [ ] On checkout success screen, link to the newly created team /dashboard/[team]/[roster]

## Testing

- [ ] Create a plan for testing and testing infra (start with Registration Flow)
