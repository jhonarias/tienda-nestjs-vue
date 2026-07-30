import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@tienda.com',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log(`✅ Admin creado: ${admin.username} (${admin.email})`)
  console.log('   Contraseña por defecto: admin123')
  console.log('   ⚠️  Cambia la contraseña en producción!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
