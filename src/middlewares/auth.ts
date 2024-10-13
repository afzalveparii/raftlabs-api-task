// import { Request, Response, NextFunction } from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';

// interface AuthRequest extends Request {
//   user?: any;
// }

// export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
//   const token = req.header('x-auth-token');

//   if (!token) {
//     res.status(401).json({ message: 'No token provided, authorization denied' });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string; 
  };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    console.log('Decoded Token:', decoded);
    // req.user = { id: decoded.user.id, role: decoded.user.role };
    if (decoded && decoded.user) {
      req.user = { id: decoded.user.id, role: decoded.user.role };
      next();
    } else {
      // Handle case where decoded token does not have user info
      // console.error('Decoded token does not contain user information:', decoded);
      res.status(401).json({ message: 'Token does not contain user information' });
      return 
    }
  } catch (error : any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired, please login again' });
    } else {
      res.status(401).json({ message: 'Token is not valid' });
    }
  }
};

  // Helper function to create a JWT token

  export const createToken = (userId: string, role: string): string => {
    const payload = { user: { id: userId, role: role } };
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h'; 
    const secretKey = process.env.JWT_SECRET_KEY as string;
  
    return jwt.sign(payload, secretKey, { expiresIn });
  };