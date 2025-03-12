import { NextFunction, Request, Response } from 'express';
import User from '../models/User.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    console.log(' OUR BODY ',req.body)
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User created' });
};

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ message: 'User not found' });
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
//   const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
//   res.status(200).json({ token });
// };

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };
