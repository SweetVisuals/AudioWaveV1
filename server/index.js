import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mock user storage (replace with real database in production)
const users = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, walletAddress } = req.body;
    console.log('Register attempt:', { username, walletAddress });

    if (username.length > 20) {
      return res.status(400).json({ message: 'Username cannot exceed 20 characters.' });
    }

    // Check if wallet or username already exists
    const existingUser = Array.from(users.values()).find(
      user => user.walletAddress === walletAddress || user.username === username
    );

    if (existingUser) {
      if (existingUser.walletAddress === walletAddress) {
        return res.status(400).json({ message: 'Wallet address already registered' });
      }
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create new user
    const user = {
      id: Date.now().toString(),
      username,
      walletAddress,
      profilePicture: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`,
      followers: 0,
      createdAt: new Date().toISOString()
    };

    users.set(user.id, user);
    console.log('User registered successfully:', user);

    res.status(201).json({ 
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    console.log('Login attempt:', { walletAddress });

    const user = Array.from(users.values()).find(
      user => user.walletAddress === walletAddress
    );

    if (!user) {
      console.log('User not found:', { walletAddress });
      return res.status(404).json({ message: 'USER_NOT_FOUND' });
    }

    console.log('User logged in successfully:', user);
    res.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get user profile
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = Array.from(users.values()).find(
      user => user.username.toLowerCase() === req.params.username.toLowerCase()
    );

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
  console.log(`API available at http://localhost:${PORT}/api`);
});