import express from 'express';
import {
  handleCreateCategory,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory
} from '../controllers/categoryController';

const router = express.Router();
router.post('/', handleCreateCategory);
router.get('/shops/:shopSlug/:categorySlug', handleGetCategory);
router.put('/:id', handleUpdateCategory);
router.delete('/:id', handleDeleteCategory);

export default router;