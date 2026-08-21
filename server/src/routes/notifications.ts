import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Notifications — see frontend /data/alerts.ts' });
});

export default router;
