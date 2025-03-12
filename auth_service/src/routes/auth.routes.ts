import express from 'express';
import { signup, login, verifyToken } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', async (req, res, next) => {
    await login(req, res, next);

  });

router.post('/verify', verifyToken);

export default router;