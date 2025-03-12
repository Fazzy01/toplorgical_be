import Wallet from '../models/Wallet.model';

export const walletTransfer = async (senderId: string, recipientId: string, amount: number) => {
    // Check if sender has sufficient balance
    const senderWallet = await Wallet.findOne({ userId: senderId });
    if (!senderWallet || senderWallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Find recipient's wallet
    const recipientWallet = await Wallet.findOneAndUpdate(
      { userId: recipientId },
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    );

    // Deduct amount from sender's wallet
    await Wallet.findOneAndUpdate(
      { userId: senderId },
      { $inc: { balance: -amount } }
    );

    // // Log the transaction
    // await Transaction.create({
    //   userId: senderId,
    //   type: 'transfer',
    //   amount,
    //   recipientId,
    // });

    return { senderWallet, recipientWallet };
  };

  export const walletWithdraw = async (userId: string, amount: number) => {
    // Check if user has sufficient balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct amount from wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: -amount } },
      { new: true }
    );

    // // Log the transaction
    // await Transaction.create({
    //   userId,
    //   type: 'withdraw',
    //   amount,
    // });

    return updatedWallet;
  };