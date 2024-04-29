import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const KEY = process.env.JWT_SECRET;



export const generateToken = (user) => {
  try {
    return jwt.sign({user}, KEY, {expiresIn: '30m'});
  } catch (error) {
      console.log(error);
  }
};

export const validateTokenClient = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado' });
  }

  jwt.verify(token, KEY, (err, response) => {
    if (err) {
      return res.status(401).json({ message: 'Acceso denegado' });
    } else {
      next(); 
    }
  });
};

