const prisma = require('./lib/db');

async function purchaseItem(req, res) {
  try {
    const { userId, productId } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.stock < 1) {
      return res.status(400).json({ error: 'Out of stock' });
    }

    const [order, updatedProduct] = await prisma.$transaction([
      prisma.order.create({
        data: { userId, productId, quantity: 1 },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: 1 } },
      }),
    ]);

    res.status(201).json({ order, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOrdersByUser(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const orders = await prisma.order.findMany({ where: { userId } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { purchaseItem, getOrdersByUser };