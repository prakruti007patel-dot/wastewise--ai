import { Router } from 'express';
const router = Router();

router.get('/wards/:id', (req, res) => {
  const wardId = Number(req.params.id);
  res.json({ wardId, message: 'Analytics data — see frontend /data/analytics.ts for full mock data' });
});

export default router;
