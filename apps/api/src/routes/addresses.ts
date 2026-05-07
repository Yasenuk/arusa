import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth';
import { getAddresses, createAddress, setDefaultAddress, deleteAddress } from '../services/address.service';

const router = Router();

router.get('/addresses', authMiddleware, async (req, res) => {
  const user_id = Number(req.user!.id);
  const data = await getAddresses(user_id);
  res.json(data);
});

router.post('/addresses', authMiddleware, async (req, res) => {
  try {
    const user_id = Number(req.user!.id);
    const address = await createAddress(user_id, req.body);
    res.json(address);
  } catch (err: any) {
    console.error('createAddress error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/addresses/:id/default', authMiddleware, async (req, res) => {
  const user_id = Number(req.user!.id);
  const address_id = Number(req.params.id);
  const address = await setDefaultAddress(user_id, address_id);
  res.json(address);
});

router.delete('/addresses/:id', authMiddleware, async (req, res) => {
  const user_id = Number(req.user!.id);
  const address_id = Number(req.params.id);
  const result = await deleteAddress(user_id, address_id);
  res.json(result);
});

export default router;