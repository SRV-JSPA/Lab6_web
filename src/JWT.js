import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const KEY = process.env.JWT_SECRET;

console.log(KEY);

export const generateToken = (user) => {
  try {
    return jwt.sign({user}, KEY, {expiresIn: '30m'});
  } catch (error) {
      console.log(error);
  }
};

export const validateToken = ()  => {
  
}