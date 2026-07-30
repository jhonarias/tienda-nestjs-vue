// ============================================================
// Vercel Serverless Handler para NestJS
// @vercel/node compila este archivo directamente con ncc/webpack
// que sí soporta emitDecoratorMetadata de NestJS
// ============================================================

import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import type { IncomingMessage, ServerResponse } from 'http'

let cachedApp: ReturnType<typeof import('express')> | undefined

async function getApp() {
  if (cachedApp) return cachedApp

  const app = await NestFactory.create(AppModule, { logger: false })

  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  )
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  await app.init()
  cachedApp = app.getHttpAdapter().getInstance() as ReturnType<typeof import('express')>
  return cachedApp
}

module.exports = async (req: IncomingMessage, res: ServerResponse) => {
  const app = await getApp()
  app!(req as any, res as any)
}
