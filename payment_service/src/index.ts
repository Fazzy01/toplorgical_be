// import express, { NextFunction } from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import paymentRoutes from './routes/payment.routes';
// import dotenv from 'dotenv';
// import axios, { AxiosError, AxiosResponse } from 'axios';
// dotenv.config();


// const app = express();
// const PORT = process.env.PAYMENT_SERVICE_PORT;
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//     throw new Error('MONGO_URI is not defined');
// }

// app.use(cors({ credentials: true }))
// app.use(bodyParser.json());

// mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   } as mongoose.ConnectOptions)
//   .then(() => console.log("MongoDB connected"))
//     .catch((err) => console.error("MongoDB connection error:", err));

//     interface AuthTokenResponse {
//         // Define the shape of the response from the auth service
//         token: string;
//         // Add other properties as needed
//       }

//       export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
//         const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

//         if (!token) {
//           return res.status(401).json({ success: false, message: 'No token provided' });
//         }

//         try {
//           // Verify the token with the Auth Service
//           const response = await axios.get(`${config.AUTH_SERVICE_URL}/auth/verify`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           if (response.data.success) {
//             // Attach the user ID to the request object for use in controllers
//             req.user = response.data.user;
//             next(); // Proceed to the next middleware or route handler
//           } else {
//             return res.status(401).json({ success: false, message: 'Invalid token' });
//           }
//         } catch (error) {
//           console.error('Error verifying token:', error);
//           return res.status(500).json({ success: false, message: 'Failed to verify token' });
//         }
//       };

// app.use('/payment', paymentRoutes);


// app.listen(PORT, () => {
//   console.log(`Payment Service running on port ${PORT}`);
// });
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import paymentRoutes from './routes/payment.routes';
import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { AuthTokenResponse } from './interface/payment.interface';

dotenv.config();

const app = express();

const PORT = process.env.PAYMENT_SERVICE_PORT;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

app.use(cors({ credentials: true }));
app.use(bodyParser.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
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
        // req.user = response.data
        req.user = {
            ...response.data,
            token,
          };
      next();
    } else {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error verifying token:',);
    return res.status(500).json({ success: false, message: 'Failed to verify token' });
  }
};

app.use('/payment', authenticateUser as any, paymentRoutes);

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});

