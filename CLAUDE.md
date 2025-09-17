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
- Registration system with Stripe payment integration
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