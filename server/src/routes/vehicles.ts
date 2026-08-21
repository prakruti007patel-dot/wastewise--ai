import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Vehicles endpoint — see mock data in frontend /data/vehicles.ts' });
});

export default router;
