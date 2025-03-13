import { Request, Response } from 'express';
import Wallet from '../models/Wallet.model';
import User from '../models/User.model';
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

export const transfer = async (req: CustomRequest, res: Response) => {
    const {  recipientEmail, amount } = req.body;
    const { result: { _id, email } }= req.user// Get sender's user ID from the authenticated request

    if(recipientEmail == email){
        res.status(200).json({ success: true, message: "Cannot transfer fund to yourself " });
        return;
    }

    const user = await User.findOne({ email: recipientEmail }).lean();
    if (!user){
        res.status(404).json({ message: 'User not found' });
    }
    let recipientId = user?._id.toString();
    if (!recipientId) {
        throw new Error('Recipient Email is Required');
      }

    try {
      const result = await walletTransfer(_id, recipientId, amount);
      res.status(200).json({ success: true, result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };



  export const withdraw = async (req: CustomRequest, res: Response) => {
    const { amount } = req.body;
    const { result: { _id } }= req.user

    try {
      const wallet = await walletWithdraw(_id, amount);
      res.status(200).json({ success: true, wallet });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
  };