import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Grievances endpoint — see mock data in frontend /data/grievances.ts' });
});

router.post('/', (req, res) => {
  const { citizenName, wardId, category, description, language } = req.body;
  if (!citizenName || !category || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = `GRV-2026-${String(Math.floor(10000 + Math.random() * 90000)).slice(0, 5)}`;
  res.status(201).json({ id, status: 'submitted', wardId, category, createdAt: new Date().toISOString() });
});

router.patch('/:id', (req, res) => {
  const { status } = req.body;
  res.json({ id: req.params.id, status, updatedAt: new Date().toISOString() });
});

export default router;
