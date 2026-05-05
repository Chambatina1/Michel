import { PrismaClient } from '@prisma/client'

// Set DATABASE_URL before PrismaClient reads it from schema
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://micel_admin:yJmfj4wjjHF2YHehcvM907wWWb1A8SWM@dpg-d7t6gvl7vvec73ft84qg-a.oregon-postgres.render.com:5432/michel_db?sslmode=require';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
