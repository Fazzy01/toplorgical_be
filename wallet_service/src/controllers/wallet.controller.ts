import { Request, Response } from 'express';
import Wallet from '../models/Wallet.model';
import dotenv from 'dotenv';
import { walletTransfer, walletWithdraw } from '../services/wallet.service';
dotenv.config();

interface CustomRequest extends Request {
    user?: any;
}

export const createWallet = async (req: CustomRequest, res: Response) => {
    const { result: { _id, email } } = req.user;

    const existingWallet = await Wallet.findOne({ userId: _id });

    if (existingWallet) {
      res.status(200).json({ message: 'Wallet already exists', balance: existingWallet.balance });
    } else {
      const newWallet = new Wallet({ userId: _id, balance: 0 });
      const savedWallet = await newWallet.save();
      res.status(200).json({ message: 'Wallet created successfully', balance: savedWallet.balance });
    }
  };


export const fundWallet = async (req: CustomRequest, res: Response) => {

    const { result: { _id, email } } = req.user;
    const { userId, amount } = req.body;

    // Fetch the user's current balance
    const wallet = await Wallet.findOne({ userId });
    const currentBalance = wallet ? wallet.balance : 0;

    // Update the balance by adding the funding amount
    const newBalance = currentBalance + amount;
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId },
      { balance: newBalance },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Wallet funded successfully',
      balance: updatedWallet.balance
    });
  };


export const getBalance = async (req: CustomRequest, res: Response) => {
//   const { userId } = req.body;
  const { result: { _id, email } } = req.user;
  const userId  = _id;
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
  res.status(200).json({ balance: wallet.balance });
};

export const transfer = async (req: Request, res: Response) => {
    const { recipientId, amount } = req.body;
    // const senderId = req.user.userId; // Get sender's user ID from the authenticated request
    // const {userId} = req.user; // Get sender's user ID from the authenticated request

    try {
      const result = await walletTransfer("userId", recipientId, amount);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  };

  export const withdraw = async (req: Request, res: Response) => {
    const { amount } = req.body;
    // const userId = req.user.userId; // Get user ID from the authenticated request

    try {
      const wallet = await walletWithdraw("userId", amount);
      res.status(200).json({ success: true, wallet });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  };