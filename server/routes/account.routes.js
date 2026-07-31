import { Router } from 'express';
import {
  getAccounts,
  connectAccount,
  disconnectAccount,
} from '../controllers/account.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getAccounts);
router.post('/:platform/connect', auth, connectAccount);
router.post('/:platform/disconnect', auth, disconnectAccount);

export default router;
