import express from 'express';
import { signup, login } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signup);
// router.post('/login', login);
router.post('/login', async (req, res, next) => {
    // await login(req, res, next);
    res.json({ message: 'Logged in successfully' });
  });

export default router;