import express from 'express';
import {
  handleCreateShop,
  handleUpdateShop,
  handleDeleteShop,
  handleToggleShopStatus,
  handleUpdateShopHours
} from '../controllers/shopController';
import { findShopBySlug } from '../models/shopModel';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

//router.post('/', handleCreateShop);
router.post('/', authenticateToken, handleCreateShop);
router.put('/:slug', handleUpdateShop);
router.delete('/:slug', handleDeleteShop);
router.patch('/:slug/status', handleToggleShopStatus);
router.patch('/:slug/hours', handleUpdateShopHours);

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const shop = await findShopBySlug(slug);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.json(shop);
  } catch (err) {
    console.error('Error fetching shop:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;