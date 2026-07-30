// ============================================================
// MAIN — Bootstrap NestJS
// Soporta dos modos:
//   1. Vercel serverless → exporta module.exports = handler
//   2. Local dev         → usa app.listen()
// ============================================================

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

// Instancia cacheada para reutilizar entre invocaciones serverless (warm starts)
let cachedApp: ReturnType<typeof import('express')> | undefined

async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] })

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  await app.init()
  return app.getHttpAdapter().getInstance()
}

// ── Vercel: exporta el handler serverless ──────────────────
// eslint-disable-next-line @typescript-eslint/no-require-imports
module.exports = async (req: any, res: any) => {
  if (!cachedApp) {
    cachedApp = await createApp()
  }
  cachedApp!(req, res)
}

// ── Desarrollo local: levanta el servidor normalmente ──────
if (process.env.NODE_ENV !== 'production') {
  NestFactory.create(AppModule).then(async (app) => {
    app.setGlobalPrefix('api')
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    )
    app.enableCors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
    const port = process.env.PORT ?? 3000
    await app.listen(port)
    console.log(`🚀 Backend NestJS corriendo en: http://localhost:${port}/api`)
  })
}
