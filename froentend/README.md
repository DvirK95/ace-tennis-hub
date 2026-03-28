# 🎾 AceClub Manager - Advanced Tennis Club OS

A robust, enterprise-grade SaaS application designed to manage tennis clubs, schedules, and members. Built with a strict focus on Type Safety, modular architecture, and modern React best practices.

## ✨ Key Features

- **Calendar-Centric Command Center:** A fully interactive scheduling system supporting 5-minute granular intervals, recurring events, court blockouts, and smart conflict resolution.
- **Fine-Grained Permission Matrix:** Moving beyond rigid RBAC, the system employs a flexible permission matrix, allowing admins to assign specific capabilities (e.g., `MANAGE_COURTS`, `APPROVE_BOOKINGS`) per user.
- **360° User Profiles & CRM:** A unified user model combining Coaches and Trainees. Features detailed activity tracking, absence history, automated makeup credits calculation, and integrated task management.
- **Approval Workflows:** Smart booking requests that enter a `PENDING_APPROVAL` state, requiring admin validation before appearing on the global schedule.

## 🛠️ Tech Stack & Engineering Standards

This project adheres to strict architectural guidelines to ensure maintainability, scalability, and zero runtime type errors.

- **Core:** React 18 + Vite
- **Language:** Strict TypeScript. **0% usage of the `any` type.** Every entity, API response, and component prop is explicitly typed.
- **Data Validation:** `zod` for single-source-of-truth schema validation. TypeScript interfaces are directly inferred from Zod schemas.
- **Forms:** `react-hook-form` integrated with `@hookform/resolvers/zod` for performant, type-safe form state management.
- **Data Grids:** `@tanstack/react-table` for highly performant, headless data tables featuring global filtering, sorting, and pagination.
- **State Management:**
  - _Server State:_ `@tanstack/react-query` for data fetching, mutations, and caching.
  - _Client State:_ `zustand` for lightweight, boilerplate-free global state.

## 📐 Architectural Decisions

- **UI / Logic Separation:** Strict adherence to the Container/Presenter pattern. All business logic, local state, and API side-effects are extracted into dedicated custom hooks (e.g., `useUserTasks`). React components are purely functional and responsible only for rendering UI.
- **Function Components:** Exclusive use of standard function declarations (`export default function...`).
- **Modular Rendering:** Array iterations (`.map()`) are strictly extracted into isolated, dedicated React components to prevent unnecessary re-renders and keep files small.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/ace-club-manager.git](https://github.com/YOUR_USERNAME/ace-club-manager.git)
   ```
