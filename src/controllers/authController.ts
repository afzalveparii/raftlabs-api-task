// import { Request, Response } from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';
// import { logger } from '../utils/logger';

// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       res.status(400).json({ message: 'User already exists' });
//       return;
//     }

//     // Create new user
//     user = new User({ username, email, password });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Create and return JWT token
//     const payload = { user: { id: user.id } };
//     const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
//     const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });

//     res.status(201).json({ token });
//   } catch (error) {
//     logger.error('Error in register:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     if(!email || !password){
//       res.status(401).json({ message: 'All fields are required'})
//       return
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(400).json({ message: 'User not found. Please register with us.' });
//       return;
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.status(400).json({ message: 'The password you entered is incorrect. Please try again.' });
//       return;
//     }
//     // Create and return JWT token
//     const payload = { user: { id: user.id } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' }); 

//      // Set token in response cookie
//      res.cookie('token', token, { httpOnly: true, secure: true });
//      res.json({ message: 'Login successful' }); 

//     res.json({ token});
//   } catch (error) {
//     logger.error('Error in login:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const logout = (req: Request, res: Response): void => {
//   res.clearCookie('token');
//   res.json({ message: 'Logout successful' }); 
// };


//approach-2

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { logger } from '../utils/logger';

class UserController {
  private static instance: UserController;

  private constructor() {}

  // Singleton pattern to get the single instance of UserController
  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  // Register a new user
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      // Create new user and hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      await user.save();

      // Create JWT token
      const token = UserController.createToken(user.id);
      res.status(201).json({ token });
    } catch (error) {
      logger.error('Error in register:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Login an existing user
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'User not found. Please register with us.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Incorrect password. Please try again.' });
        return;
      }

      // Generate JWT and set it as a cookie
      const token = UserController.createToken(user.id);
      res.cookie('token', token, { httpOnly: true, secure: true });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      logger.error('Error in login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Logout the user
  public logout(req: Request, res: Response): void {
    try {
      res.clearCookie('token');
      res.json({ message: 'Logout successful' });
    } catch (error) {
      logger.error('Error in logout:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get user by id details 
  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error in getUser:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update user details
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Update user details
      user.username = username || user.username;
      user.email = email || user.email;

      await user.save();
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      logger.error('Error in updateUser:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Delete user
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      await user.remove();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteUser:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Helper function to create a JWT token
  private static  createToken(userId: string): string {
    const payload = { user: { id: userId } };
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const secretKey = process.env.JWT_SECRET_KEY as string;

    return jwt.sign(payload, secretKey, { expiresIn });
  }
}

export default UserController.getInstance();
