import express from 'express';
import {
  handleCreateUser,
  handleUpdateUser,
  handleToggleSellerStatus,
  handleUpdateLastLogin,
  handleDeactivateUser,
  handleGetShopByUserId,
  handleUpdateUserPassword,
  handleGetUserById
} from '../controllers/userController';
import { handleRegister } from '../controllers/authController';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', handleRegister);
router.put('/:id', handleUpdateUser);
router.patch('/:id/seller', handleToggleSellerStatus);
router.patch('/:id/login', handleUpdateLastLogin);
router.patch('/:id/deactivate', handleDeactivateUser);
router.get('/:id/shop', handleGetShopByUserId);
router.patch('/:id/password', handleUpdateUserPassword);

router.get('/me', authenticateToken, handleGetUserById);

export default router;
