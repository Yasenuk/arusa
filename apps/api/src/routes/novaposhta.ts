import { Router } from 'express';
import { npRequest } from '../services/novaposhta.service';

const router = Router();

router.post('/novaposhta', async (req, res) => {
  try {
    const { modelName, calledMethod, methodProperties } = req.body;
    const data = await npRequest(modelName, calledMethod, methodProperties);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;