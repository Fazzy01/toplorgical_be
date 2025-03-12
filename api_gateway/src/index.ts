import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = 3000;

app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/auth-service', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/auth-service': '/auth' }
  }));

app.use('/wallet-service', createProxyMiddleware({
    target: process.env.WALLET_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/wallet-service': '/wallet' }
  }));

app.use('/payment-service', createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/payment-service': '/payment' }
  }));

app.use('/transaction-service', createProxyMiddleware({
    target: process.env.TRANSACTION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/transaction-service': '/transaction' }
  }));


app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Nothing  to see , this is an enpoint!' });
});



app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});