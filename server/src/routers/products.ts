import express from 'express';
import {
  handleCreateProduct,
  handleUpdateProductDetails,
  handleUpdateProductStock,
  handleDeleteProduct,
  handleDeactivateProduct,
  handleGetProductsByShop,
  handleGetProductsByCategory,
  handleCreateProductByShopId
} from '../controllers/productController';

const router = express.Router();
router.post('/', handleCreateProductByShopId);
router.post('/:id/products', handleCreateProductByShopId);
router.post('/:shopSlug/products', handleCreateProduct);
router.get('/:shopSlug/products', handleGetProductsByShop);
router.get('/category/:categoryId', handleGetProductsByCategory);
router.patch('/product/:id', handleUpdateProductDetails);
router.patch('/product/:id/stock', handleUpdateProductStock);
router.patch('/product/:id/deactivate', handleDeactivateProduct);
router.delete('/product/:id', handleDeleteProduct);

export default router;
