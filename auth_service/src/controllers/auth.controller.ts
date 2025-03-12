import { NextFunction, Request, Response } from 'express';
import User from '../models/User.model';
import encrypt from '../utils/encrypt';
import dotenv from 'dotenv';
import { DecodedToken, UserType } from '../interface/user.interface';
import axios from 'axios';
dotenv.config();

export const signup = async (req: Request, res: Response): Promise<any>  => {
    try {

      const { fullname, email, password, role } = req.body;

      // Check if all required fields are present
      if (!fullname || !email || !password ) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if email is valid
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }

      // Check if password is strong enough
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await encrypt.hashPassword(password);
      const user = new User({ username: fullname, email, password: hashedPassword, role });
      const result = await user.save();

        // Login the user after creation
        const userData: UserType = {
            email: user.email,
            username: user.username,
            roles: user.role,
            id: user._id,
        };

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not specified');
        }
      const token = await encrypt.createToken(userData, process.env.JWT_SECRET);

      const wallet_resp = await axios.post(
            `${process.env.WALLET_SERVICE_URL}/wallet/create`,
            { },
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
        );

       res.status(201).json({ message: 'User created', result });
    } catch (error) {
      console.error(error);
        //  res.status(500).json({ message: 'Internal Server Error' });
    }
  };


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).lean();
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await encrypt.comparePassword(user.password, password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const userData: UserType = {
        email: user.email,
        username: user.username,
        roles: user.role,
        id: user._id,
      };

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not specified');
        }

      const token = await encrypt.createToken(userData, process.env.JWT_SECRET);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { split } = req.body;
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Invalid Token Supplied' });
      }

      const token = authorizationHeader?.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not specified');
      }

      const decodedToken = encrypt.decodeToken(token!, process.env.JWT_SECRET) as DecodedToken;

      if (!decodedToken) {
        res.status(401).json({ message: 'Invalid token' });
      }

      const excludeFields = split === '_id' ? { _id: 0 } : {};
      const user = await User.findById(decodedToken.id, excludeFields).lean();

    //   console.log(" our decoded user ", user)

      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ result: user });
    } catch (error) {
      next(error);
    }
  };
