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
