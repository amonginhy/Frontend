# Eden's Crunchbox Bakery Marketplace

A multi-vendor bakery marketplace web application built with React and TypeScript.

## Overview

 Eden's Crunchbox allows customers to browse and order baked goods from multiple vendors on a single platform. The app supports three user roles: customers, vendors, and admins — each with their own dedicated dashboard and workflows.

## Features

- **Shop** — Browse products across vendors, add to cart, and customize orders
- **Checkout** — Complete purchases with order tracking
- **Vendor dashboard** — Manage products, view orders, and access sales analytics
- **Admin panel** — Approve vendors, manage users, resolve disputes, and oversee all orders

## Tech Stack

- **React 18** with TypeScript
- **Vite** for bundling
- **Zustand** for state management
- **TanStack Query** for server state and data fetching
- **React Router v6** for routing
- **Tailwind CSS** + Framer Motion for styling and animations
- **Recharts** for analytics charts
- **React Hook Form** + Zod for form validation

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Run TypeScript type checking |
