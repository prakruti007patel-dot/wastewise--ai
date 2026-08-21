import { Router } from 'express';
const router = Router();

// Mock ward data inline to keep server self-contained
const wards = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Ward ${i + 1}`,
  segregationCompliance: 58 + Math.floor(Math.random() * 35),
  collectionCompletion: 78 + Math.floor(Math.random() * 20),
  openGrievances: Math.floor(Math.random() * 20),
}));

router.get('/', (req, res) => res.json(wards));
router.get('/:id', (req, res) => {
  const ward = wards.find(w => w.id === Number(req.params.id));
  if (!ward) return res.status(404).json({ error: 'Ward not found' });
  res.json(ward);
});

export default router;
