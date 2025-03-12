import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.AUTH_SERVICE_PORT;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
}

// app.use(cors());
app.use(cors({ credentials: true }))
app.use(bodyParser.json());

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


app.use('/auth', authRoutes);

// app.get('/login', (req: Request, res: Response) => {
//     res.json({ message: 'Logged in successfully' });
//   });


app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});