import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors'; 

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Cores
app.use(
    cors({
      exposedHeaders: ['X-Total-Count'],
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    })
  );

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));