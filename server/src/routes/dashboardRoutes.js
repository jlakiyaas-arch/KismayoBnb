import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { getHostStats } from '../controllers/dashboardController.js';

const router = Router();

router.get('/host/stats', protect, authorize('host'), getHostStats);

export default router;
