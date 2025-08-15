import { Router } from 'express';
import {
  createUserHandler,
  getUserByIdHandler,
  updateUserHandler,
  getAllUsersHandler
} from '@/controllers/user.controller';

const router = Router();

router.get('/', getAllUsersHandler);
router.post('/', createUserHandler);
router.get('/:id', getUserByIdHandler);
router.patch('/:id', updateUserHandler);

export default router;