import express from 'express';
import {
  handleCreateUser,
  handleUpdateUser,
  handleToggleSellerStatus,
  handleUpdateLastLogin,
  handleDeactivateUser,
  handleGetShopByUserId,
  handleUpdateUserPassword
} from '../controllers/userController';

const router = express.Router();

router.post('/', handleCreateUser);
router.put('/:id', handleUpdateUser);
router.patch('/:id/seller', handleToggleSellerStatus);
router.patch('/:id/login', handleUpdateLastLogin);
router.patch('/:id/deactivate', handleDeactivateUser);
router.get('/:id/shop', handleGetShopByUserId);
router.patch('/:id/password', handleUpdateUserPassword);

export default router;