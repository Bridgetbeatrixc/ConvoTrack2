const express = require('express');
const router = express.Router();

// In-memory user storage (replace with database in production)
let users = [
  {
    id: 1,
    email: 'admin@convotrack.com',
    password: 'admin123', // In production, this should be hashed
    fullName: 'Admin ConvoTrack',
    businessName: 'ConvoTrack Indonesia',
    businessField: 'Technology',
    businessAddress: 'Jakarta, Indonesia',
    idNumber: '1234567890123456',
    phoneNumber: '+628123456789',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

let nextUserId = 2;

// POST /api/auth/signup - User registration
router.post('/signup', (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      businessName,
      businessField,
      businessAddress,
      idNumber,
      phoneNumber
    } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password', 'fullName']
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Create new user
    const newUser = {
      id: nextUserId++,
      email: email.toLowerCase(),
      password, // In production, hash this password
      fullName,
      businessName: businessName || '',
      businessField: businessField || '',
      businessAddress: businessAddress || '',
      idNumber: idNumber || '',
      phoneNumber: phoneNumber || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token: generateMockToken(newUser.id) // In production, use JWT
    });

  } catch (error) {
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

// POST /api/auth/login - User login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password']
      });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.updatedAt = new Date();

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: generateMockToken(user.id) // In production, use JWT
    });

  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', (req, res) => {
  try {
    // In production, handle token invalidation
    res.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed', message: error.message });
  }
});

// GET /api/auth/profile - Get user profile
router.get('/profile', (req, res) => {
  try {
    // In production, extract user ID from JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const userId = extractUserIdFromToken(token);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile', message: error.message });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const userId = extractUserIdFromToken(token);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      fullName,
      businessName,
      businessField,
      businessAddress,
      phoneNumber
    } = req.body;

    // Update user data
    const updatedUser = {
      ...users[userIndex],
      ...(fullName && { fullName }),
      ...(businessName !== undefined && { businessName }),
      ...(businessField !== undefined && { businessField }),
      ...(businessAddress !== undefined && { businessAddress }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      updatedAt: new Date()
    };

    users[userIndex] = updatedUser;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', message: error.message });
  }
});

// POST /api/auth/change-password - Change user password
router.post('/change-password', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const userId = extractUserIdFromToken(token);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['currentPassword', 'newPassword']
      });
    }

    // Check current password
    if (users[userIndex].password !== currentPassword) {
      return res.status(401).json({
        error: 'Invalid current password'
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'New password must be at least 6 characters long'
      });
    }

    // Update password
    users[userIndex].password = newPassword; // In production, hash this
    users[userIndex].updatedAt = new Date();

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to change password', message: error.message });
  }
});

// Helper function to generate mock token (replace with JWT in production)
function generateMockToken(userId) {
  return `mock-token-${userId}-${Date.now()}`;
}

// Helper function to extract user ID from mock token (replace with JWT verification in production)
function extractUserIdFromToken(token) {
  const parts = token.split('-');
  return parseInt(parts[2]);
}

module.exports = router; 