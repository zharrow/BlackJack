import { PrismaClient } from '@prisma/client';

// PrismaClient est attaché au global lorsqu'on est en développement pour éviter
// trop de connexions en développement hot-reload
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;