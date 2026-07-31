# Tienda Productos

Sistema de gestión de tienda con módulo de usuarios, productos y facturación.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 + TypeScript + Vite + TailwindCSS |
| Backend | NestJS 11 + TypeScript |
| ORM | Prisma |
| Base de datos | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Despliegue | Vercel + Supabase |

## Arquitectura Hexagonal

```
src/
├── core/
│   ├── domain/          ← Entidades y Puertos (interfaces puras)
│   ├── application/     ← Casos de uso (@Injectable, sin framework)
│   └── infrastructure/  ← Adaptadores (Prisma, Supabase Storage)
├── modules/             ← Módulos NestJS (ensamblan DI + controllers)
│   ├── auth/            ← JWT Strategy, Guards, Decoradores
│   ├── users/           ← Controller + DTOs
│   ├── products/        ← Controller + Multer (imágenes)
│   ├── invoices/        ← Controller
│   └── database/        ← Provee repositorios como tokens DI
└── main.ts              ← Bootstrap + handler serverless para Vercel
```

## Estructura del Monorepo

```
tienda-productos/
├── frontend/   → Vue 3 + TypeScript + Vite + TailwindCSS + Pinia
└── backend/    → NestJS 11 + Prisma + PostgreSQL
```

## Setup Local

### Backend

```bash
cd backend
cp .env.example .env
# Completar las variables en .env con los valores de Supabase
npm install
npm run db:migrate   # Crea las tablas en Supabase
npm run db:seed      # Crea el usuario admin (admin / admin123)
npm run start:dev    # http://localhost:3000/api
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Completar VITE_API_URL con la URL del backend
npm install
npm run dev          # http://localhost:5173
```

## Variables de entorno (backend)

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Transaction pooler |
| `DIRECT_URL` | Supabase → Settings → Database → Session pooler |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `SUPABASE_STORAGE_BUCKET` | Nombre del bucket para imágenes (`products`) |
| `JWT_SECRET` | Secreto largo aleatorio para firmar tokens |
| `JWT_EXPIRES_IN` | Duración del token (`8h`) |
| `CORS_ORIGIN` | URL del frontend en producción |

## Roles

| Rol | Permisos |
|-----|----------|
| ADMIN | Gestión de productos, gestión de usuarios cajeros, ver todas las facturas |
| CASHIER | Crear facturas, buscar productos, ver su historial de facturas |
