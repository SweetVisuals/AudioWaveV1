import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://audiowave.netlify.app'] 
    : ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Input validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  walletAddress: z.string()
});

const loginSchema = z.object({
  walletAddress: z.string()
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, walletAddress } = registerSchema.parse(req.body);

    // Check if username is taken
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Check if wallet is registered
    const existingWallet = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (existingWallet) {
      return res.status(400).json({ message: 'Wallet already registered' });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        walletAddress,
        profilePicture: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`,
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { walletAddress } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      return res.status(404).json({ message: 'USER_NOT_FOUND' });
    }

    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get user profile
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get user profile' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});