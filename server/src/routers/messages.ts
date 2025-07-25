import express from 'express';
import { handleSendMessage, handleGetMessages } from '../controllers/messageController';

const router = express.Router();

router.post('/', handleSendMessage);
router.get('/:user1/:user2', handleGetMessages);

export default router;
