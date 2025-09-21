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
- Custom fonts: Geist Sans/Mono, Schibsted Grotesk
- Lucide React for icons

### State Management & Data

- TanStack Query for server state with custom retry logic
- Custom query client configuration with 1-minute stale time

### Data & Content Management

- **Sanity CMS** - Teams, Players, and Basketball info content management
  - Schema located in ~/Dev/nchc (part of workspace)
  - Use Sanity MCP to develop and manage content
- **Supabase** - Authentication and user management only
- **Stripe** - Registration payments via hosted checkout

### Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Organized by feature (home, games, teams, player-profile, etc.)
- `lib/` - Utilities, types, and configuration
- `supabase/` - Authentication schemas and SQL files
- `hooks/` - Custom React hooks
- `middleware.ts` - Auth middleware (bypassed in development)

### Key Features

- Dashboard with roster management and payments
- Player and team profiles (data from Sanity)
- Game scheduling and tracking
- **Multi-step registration system** with package selection and Stripe payment integration
- League divisions and structure display
- Team management for registrants

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

### Content Schema

- Basketball data, teams, and players managed in Sanity
- Schema definitions in ~/Dev/nchc workspace
- Use Sanity MCP tools for content development and management

## Registration System Status

### Current Implementation (December 2024)

The registration system has been refactored into a **5-step multi-step flow**:

#### Step 1: Package Selection

- **3 package options**: Full Season ($3,495), Two Session Pack ($1,795), Pay Per Session ($895)
- **Auto-advance on selection** - clicking a package automatically proceeds to Step 2
- **Comprehensive comparison table** with all benefits and limitations
- **Early bird pricing** displayed with strikethrough for full season
- **No Next button** - selection triggers automatic progression

#### Step 2: Team Information

- **Selected package display** at top with "Change Package" option
- Team name, location, contact email, division preference
- Logo upload and team colors selection
- **Standard Next/Previous navigation**

#### Step 3: Contact Information

- **Package + team summary** displayed at top for context
- Primary contact and head coach details
- **Standard Next/Previous navigation**

#### Step 4: Review & Payment

- **Comprehensive summary** in organized card layout:
  - Team Information, Primary Contact, Head Coach, Additional Notes
- **Dynamic pricing** based on selected package
- **Single payment option** (full amount only)
- **Package-specific payment labels** and early bird discounts shown
- **End-to-end ready** for Stripe integration

#### Step 5: Success Confirmation

- Registration completion and next steps

### Technical Implementation

- **Package selection component** with benefits comparison
- **Selected package display component** reused across steps
- **Form state management** with selectedPackage field
- **Auto-save cart functionality** (debounced, email listener disabled)
- **Progress indicator** updated for 5 steps

### Outstanding Issues & Jankiness

#### High Priority

1. **Email cart loading disabled** - Abandoned cart recovery currently non-functional
   - `loadCart` useEffect commented out to prevent navigation issues
   - Need alternative approach for cart recovery
2. **Badge clipping issue** - Fixed but may need testing on different screen sizes

#### Medium Priority

3. **Payment integration incomplete** - Currently shows UI but needs:

   - Dynamic Stripe pricing based on selected package
   - Package metadata passed to payment processing
   - Success page integration with package details

4. **Form validation edge cases**:
   - Package selection validation may be bypassed
   - Cross-step data consistency not fully validated

#### Low Priority

5. **TypeScript warnings** - Some unused imports and variables from refactoring
6. **Mobile responsiveness** - Comparison table may need scrolling improvements
7. **Loading states** - Package selection could use loading feedback

### Next Steps

1. **Complete Stripe integration** with dynamic package pricing
2. **Implement proper abandoned cart recovery** without navigation conflicts
3. **Add comprehensive form validation** across all steps
4. **Mobile optimization** for comparison table
5. **Error handling** for payment failures and edge cases

- Registration end to end and janky
- Multiple teams per user MVP
- reminder to improve UX for webhook errors
- team, player, season, divisions, game, and roster data is only in sanity. NOT supabase
- no dummy data on this project. Ask permission before using and dummy data

# Refactoring

When I ask you to refactor make my code:

- Modular: Each handler can be tested/modified independently
- Extensible: Easy to add new event handlers
- Reusable: Services can be used elsewhere (team creation, emails)
- Maintainable: Clear separation of concerns
- Follows conventions: Uses existing project patterns (/lib, /hooks, etc.)
