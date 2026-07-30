# Tienda Productos

Sistema de gestión de tienda con módulo de usuarios, productos y facturación.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 + TypeScript + Vite + TailwindCSS |
| Backend | Next.js 14 (API Routes) + TypeScript |
| ORM | Prisma |
| Base de datos | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Despliegue | Vercel + Supabase |

## Arquitectura Hexagonal

```
src/
├── core/
│   ├── domain/          ← Entidades y Puertos (interfaces)
│   ├── application/     ← Casos de uso
│   └── infrastructure/  ← Adaptadores (Prisma, Supabase, HTTP)
└── interfaces/          ← Controladores HTTP (rutas Next.js / Vue)
```

## Estructura del Monorepo

```
tienda-productos/
├── frontend/   → Vue 3 + TypeScript + Vite + TailwindCSS
└── backend/    → Next.js 14 (API only) + Prisma
```

## Setup Local

### Backend

```bash
cd backend
cp .env.example .env.local
# Completar las variables en .env.local
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Completar las variables en .env.local
npm install
npm run dev
```

## Roles

| Rol | Permisos |
|-----|----------|
| ADMIN | Gestión de productos, gestión de usuarios cajeros, ver todas las facturas |
| CASHIER | Crear facturas, buscar productos, ver su historial de facturas |
