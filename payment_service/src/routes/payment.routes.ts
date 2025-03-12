import express from 'express';
import { createPayment, confirmPayment } from '../controllers/payment.controller';

const router = express.Router();


router.post('/create', createPayment);
router.post('/verify', async (req, res) => {
    await confirmPayment(req, res);
  });

export default router;