import { NextFunction, Request, Response } from 'express';
import { initializePayment, verifyPayment } from '../services/payment.service';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

interface CustomRequest extends Request {
    user?: any;
}

export const createPayment = async (req: Request, res: Response) => {
  const { user_id, amount } = req.body;

  try {
    const result = await initializePayment(user_id, amount);
    res.status(201).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to initialize payment' });
  }
};


export const confirmPayment = async (req: CustomRequest, res: Response) => {
    const {old_transaction_id, transactionRef } = req.body;

    try {
      const result = await verifyPayment(old_transaction_id, transactionRef);
      const { result: userResult, token } = req.user;
      const { _id, email } = userResult;


        if(result !== null){

            const {amount} = result;
            // call fund wallet
        const wallet_resp = await axios.post(
            `${process.env.WALLET_SERVICE_URL}/wallet/fund`,
            {
                userId: _id,
                amount: amount,
                email,
            },
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
        );

        // console.log('OUR WALLET funded data ', wallet_resp.data)
        }

      res.status(200).json({ success: true, result });
    } catch (error) {
        // console.log("Error: ", error)
      res.status(500).json({ success: false, message: 'Failing to verify payment' });
    }
  };
