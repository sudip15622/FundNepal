const { PrismaClient } = require('@prisma/client');

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Create a singleton instance for PrismaClient
let prisma;

if (process.env.NODE_ENV === 'production') {
  // In production, create a new PrismaClient instance
  prisma = prismaClientSingleton();
} else {
  // In development, use a global variable to ensure PrismaClient is not instantiated multiple times
  if (!global.prisma) {
    global.prisma = prismaClientSingleton();
  }
  prisma = global.prisma;
}

export default prisma;
