import { Router } from 'express';
import { npRequest } from '../services/novaposhta.service';

const router = Router();

const ALLOWED_NP_METHODS: Record<string, string[]> = {
  Address: ['getCities', 'getWarehouses', 'getStreet', 'getAreas'],
  AddressGeneral: ['getCities', 'getWarehouses', 'getStreet', 'getAreas'],
  Common: ['getCargoTypes', 'getServiceTypes'],
};

router.post('/novaposhta', async (req, res) => {
  try {
    const { modelName, calledMethod, methodProperties } = req.body;

    if (!ALLOWED_NP_METHODS[modelName]?.includes(calledMethod)) {
      return res.status(403).json({ error: 'Метод не дозволений' });
    }

    const data = await npRequest(modelName, calledMethod, methodProperties);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;