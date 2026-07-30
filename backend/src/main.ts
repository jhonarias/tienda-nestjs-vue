// ============================================================
// MAIN — Bootstrap de la aplicación NestJS
// Configura CORS, validación global y prefix de rutas API
// ============================================================

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Prefix global → todas las rutas quedan bajo /api/
  app.setGlobalPrefix('api')

  // Validación automática de DTOs con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // Error si llegan props no declaradas
      transform: true,       // Convierte tipos automáticamente (string → number, etc.)
    }),
  )

  // CORS: permite peticiones del frontend Vue
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`🚀 Backend NestJS corriendo en: http://localhost:${port}/api`)
}

bootstrap()
