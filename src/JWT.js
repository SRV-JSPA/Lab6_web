import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const KEY = process.env.JWT_SECRET;

export const generateToken = (payload) => {
  return jwt.sign(payload, KEY);
};