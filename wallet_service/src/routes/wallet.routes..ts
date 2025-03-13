import express from 'express';
import {createWallet, fundWallet, getBalance, transfer, withdraw } from '../controllers/wallet.controller';

const router = express.Router();

router.post('/create', createWallet);
router.post('/fund', fundWallet);
router.get('/balance', async (req, res) => {
    await getBalance(req, res);
});
router.post('/transfer', transfer);
router.post('/withdraw', withdraw);

export default router;