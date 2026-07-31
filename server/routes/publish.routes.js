import { Router } from 'express';
import { publish, getHistory } from '../controllers/publish.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/', auth, upload.single('media'), publish);
router.get('/history', auth, getHistory);

export default router;
