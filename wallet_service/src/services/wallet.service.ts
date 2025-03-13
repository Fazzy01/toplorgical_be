import Wallet from '../models/Wallet.model';

export const walletTransfer = async (senderId: string, recipientId: string, amount: number) => {
    const session = await Wallet.db.startSession();

    try {
      await session.startTransaction();

      // Check if sender has sufficient balance
      const senderWallet = await Wallet.findOne({ userId: senderId }).session(session);
      if (!senderWallet || senderWallet.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Deduct amount from sender's wallet
      const updatedSenderWallet = await Wallet.findOneAndUpdate(
        { userId: senderId },
        { $inc: { balance: -amount } },
        { session, new: true }
      );

      const checkRecipientWallet = await Wallet.findOne({ userId: recipientId });
      if (!checkRecipientWallet) {
            throw new Error('Recipient wallet not found');
      }
      // Credit recipient's wallet
      const recipientWallet = await Wallet.findOneAndUpdate(
        { userId: recipientId },
        { $inc: { balance: amount } },
        { session, new: true }
      );


      // Commit the transaction
      await session.commitTransaction();

      // Log the transaction
    //   await Transaction.create({
    //     userId: senderId,
    //     type: 'transfer',
    //     amount,
    //     recipientId,
    //   });

      return { updatedSenderWallet, recipientWallet };
    } catch (error) {
      // Abort the transaction if an error occurs
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

export const walletWithdraw = async (userId: string, amount: number) => {
    const session = await Wallet.db.startSession();
    try {
    await session.startTransaction();
    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet || wallet.balance < amount) {
        throw new Error('Insufficient balance');
    }

    // Deduct amount from sender's wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
        { userId: userId },
        { $inc: { balance: -amount } },
        { session, new: true }
    );
        // Perform logic of where to transfer to

        // Log the transaction
        // await Transaction.create([{ userId, type: 'withdraw', amount }], { session });

        await session.commitTransaction()
        return updatedWallet;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };
