import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../interface/user.interface';



const encrypt = {
  decodeToken: (token: string, JWT_SECRET: string) => {
    return jwt.verify(token, JWT_SECRET);
  },

  hashPassword: (password: string) => {
    return bcrypt.hashSync(password, 10);
  },

  comparePassword: async (entityPassword: string, inputPassword: string) => {
    return bcrypt.compareSync(inputPassword, entityPassword);
  },

  createToken: (user: User, JWT_SECRET: string) => {
    const authToken = jwt.sign(user, JWT_SECRET, {
      expiresIn: '24h',
    });
    return authToken;
  },
};

export default encrypt;