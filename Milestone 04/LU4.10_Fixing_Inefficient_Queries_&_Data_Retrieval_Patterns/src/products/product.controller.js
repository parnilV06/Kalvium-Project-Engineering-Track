import { getProducts, getProductById } from './product.service.js';

export async function listProducts(req, res) {
  try {
    let { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc', fields } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    if (limit > 100) limit = 100;

    const validSortBy = ['name', 'price', 'createdAt'];
    if (!validSortBy.includes(sortBy)) {
      return res.status(400).json({ error: 'Invalid sortBy field' });
    }

    if (order !== 'asc' && order !== 'desc') order = 'desc';

    let selectFields = undefined;
    if (fields) {
      const validFields = ['id', 'name', 'price', 'category', 'stock'];
      const fieldArray = fields.split(',');
      const invalidFields = fieldArray.filter(f => !validFields.includes(f));

      if (invalidFields.length > 0) {
        return res.status(400).json({ error: 'Invalid fields requested' });
      }

      selectFields = fieldArray.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
    }

    const result = await getProducts({ page, limit, sortBy, order, selectFields });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getProduct(req, res) {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}