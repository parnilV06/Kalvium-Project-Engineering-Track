import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query'], // Leaves query logging on to expose the N+1 crime
});

export async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return orders;
}

export async function getOrderById(id) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return null;

  const user = await prisma.user.findUnique({ where: { id: order.userId } });
  return { ...order, user };
}