import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import walletRoutes from './routes/wallet.routes.';
import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { AuthTokenResponse } from './interface/wallet.interface';
dotenv.config();

const app = express();
const PORT = process.env.WALLET_SERVICE_PORT;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
}

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

    const config = {
        AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
      };

    interface CustomRequest extends Request {
        user?: any;
      }

    export const authenticateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
          return res.status(401).json({ success: false, message: 'No token provided' });
        }

        try {

            const response: AxiosResponse<AuthTokenResponse> = await axios.post(`${config.AUTH_SERVICE_URL}/auth/verify`,
                { }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                });


        if (response.data) {
            req.user = response.data
          next();
        } else {
          return res.status(401).json({ success: false, message: 'Invalid token' });
        }
      } catch (error) {
        // console.error('Error verifying token: ');
        return res.status(500).json({ success: false, message: 'Failed to verify token' });
      }
};

app.use('/wallet', authenticateUser as any, walletRoutes);

app.listen(PORT, () => {
  console.log(`Wallet Service running on port ${PORT}`);
});