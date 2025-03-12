import axios from 'axios';
import Payment from '../models/Payment.model';
import dotenv from 'dotenv';
dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const initializePayment = async (user_id: string, amount: number) => {
    // Generate a unique transaction reference ID
    const transactionRef = `PAY-${new Date().getTime()}-${user_id}`;

    // Create a new payment record
    const payment = await Payment.create({
      user_id,
      payment_method: 'Card',
      payment_status: 'Pending',
      transaction_id: transactionRef,
      amount,
    });

    return payment;
  };


export const verifyPayment = async (old_transaction_id: string, transactionRef: string) => {
  try {

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${transactionRef}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const paymentData = response.data.data;
    // console.log("our dtata ", paymentData)

    // Convert amount from kobo to Naira
    const amount = paymentData.amount / 100;

    // Update the payment status in the database
    const updatedPayment = await Payment.findOneAndUpdate(
      { transaction_id: old_transaction_id },
      {
        transaction_id: transactionRef,
        payment_status: paymentData.status === 'success' ? 'Success' : 'Failed',
        amount,
        payment_method: paymentData.channel,
      },
      { new: true }
    );

    // console.log('updated data ref', updatedPayment)
    return updatedPayment;
  } catch (error) {
    console.error('Error verifying payment:',);
    throw new Error('Payment verification failed');
  }
};