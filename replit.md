# Veterinary EMR Dashboard with 3D Dog Model

## Overview

This is a veterinary Electronic Medical Records (EMR) system designed specifically for dogs, featuring an interactive 3D body model for visual health data exploration. The application provides comprehensive patient management, visit tracking, test results analysis, questionnaire responses, and advanced filtering capabilities. Built with a modern medical dashboard aesthetic, it emphasizes clinical clarity, efficient data scanning, and professional credibility for veterinary healthcare providers.

The system combines traditional EMR functionality with an innovative 3D visualization approach, allowing veterinarians to click on specific body parts of a dog model to view related health metrics, test results, and historical trends.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**UI Component System**: 
- shadcn/ui components with Radix UI primitives for accessible, composable interface elements
- Tailwind CSS for utility-first styling with custom design tokens
- Design philosophy follows medical EMR patterns (Epic/Cerner-inspired) emphasizing information density and professional aesthetics

**State Management**:
- Zustand for global application state (patient selection, UI preferences, filter criteria)
- TanStack Query (React Query) for server state management with built-in caching and optimistic updates
- Local component state via React hooks for UI-specific interactions

**3D Visualization**:
- React Three Fiber for declarative Three.js rendering
- @react-three/drei for helper components (OrbitControls, etc.)
- Custom clickable 3D dog model with body part mapping to medical data categories

**Data Visualization**:
- Recharts for medical charts (line charts for trends, pie charts for distributions, bar charts for statistics)
- Custom visualizations for abnormal test result highlighting with color-coded severity indicators

**Routing**:
- Wouter for lightweight client-side routing
- Route structure: Home dashboard, patients list, patient detail, visits, questionnaires, test results, 3D body model, filters, data management

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Design**:
- RESTful endpoints for CRUD operations on all medical entities
- Validation layer using Zod schemas for type-safe request/response handling
- Multer middleware for Excel file uploads (data import functionality)

**Data Layer**:
- In-memory storage implementation (interface-based design allows easy migration to PostgreSQL)
- Storage abstraction pattern enabling hot-swappable persistence layers
- Mock data generator for development and testing with realistic veterinary data

**Database Schema Design** (via Drizzle ORM):
- Patients table: Core demographic and identification data (animal number, breed, owner, microchip)
- Visits table: Clinical encounter records with chief complaints, diagnoses, treatments
- Test Results table: Laboratory values with normal range comparisons and status flags (H/L/N)
- Exam Master table: Reference data for test definitions, normal ranges, body part mappings
- Question Templates: Configurable questionnaire items with categories
- Questionnaire Responses: Patient-specific answers to health assessment questions
- User Filters: Saved search/filter configurations for cohort analysis
- Cluster Analysis: Statistical groupings for population health insights

**Key Architectural Decisions**:

1. **Separation of Concerns**: Clear boundaries between presentation (React), business logic (Express routes), and data access (storage interface)

2. **Type Safety**: End-to-end TypeScript with shared schema definitions between client and server via `shared/schema.ts`

3. **Validation Strategy**: Zod schemas serve dual purpose - runtime validation and static type inference, reducing code duplication

4. **Mock Data Approach**: Comprehensive generators create realistic test datasets with Korean language support for demonstration purposes

5. **Storage Abstraction**: Interface-based storage allows switching from in-memory to database without changing business logic

### External Dependencies

**Database**:
- Designed for PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)
- Drizzle ORM for type-safe database queries and migrations
- Connection pooling via `connect-pg-simple` for session management
- Note: Currently using in-memory storage, but architecture supports seamless PostgreSQL integration

**UI Framework**:
- Radix UI primitives (30+ components): Dialogs, dropdowns, popovers, tabs, accordions, etc.
- shadcn/ui configuration with "new-york" style variant
- Inter font family for UI text, JetBrains Mono for numerical/monospace data

**3D Graphics**:
- Three.js via React Three Fiber declarative bindings
- @react-three/drei utility library for cameras, controls, and helpers

**Charts & Visualization**:
- Recharts for responsive SVG-based medical charts
- Custom color schemes matching medical EMR standards (red=high, yellow=warning, green=normal)

**Form Management**:
- React Hook Form with @hookform/resolvers for validation integration
- Zod resolver bridge for schema-based form validation

**Development Tools**:
- Vite plugins: Runtime error overlay, Replit cartographer, dev banner
- Hot Module Replacement (HMR) for rapid development iteration

**API & Data Fetching**:
- TanStack Query for declarative data fetching with automatic caching
- Custom fetch wrappers with credential handling and error standardization

**File Processing**:
- Multer for multipart/form-data Excel file uploads
- Excel parsing expected for bulk data import workflows

**Build & Deployment**:
- ESBuild for server bundle compilation
- Vite for optimized client-side production builds
- Separate dist folders for server (`dist/`) and client (`dist/public`)