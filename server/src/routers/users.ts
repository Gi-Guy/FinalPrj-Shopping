import express from 'express';
import {
  handleCreateUser,
  handleUpdateUser,
  handleToggleSellerStatus,
  handleUpdateLastLogin,
  handleDeactivateUser,
  handleGetShopByUserId 
} from '../controllers/userController';

const router = express.Router();

router.post('/', handleCreateUser);
router.put('/:id', handleUpdateUser);
router.patch('/:id/seller', handleToggleSellerStatus);
router.patch('/:id/login', handleUpdateLastLogin);
router.patch('/:id/deactivate', handleDeactivateUser);
router.get('/:id/shop', handleGetShopByUserId);

export default router;