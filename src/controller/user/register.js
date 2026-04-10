const generateToken = require('../../utils/token');
const bcrypt = require('bcrypt');
const User = require('../../models/userModel/user');

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    generateToken(newUser, res);

    res.status(201).json({
      message: 'User registered successfully',
      user: formatUser(newUser),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user, res);

    res.status(200).json({
      message: 'Login successful',
      user: formatUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function getCurrentUser(req, res) {
  return res.status(200).json({
    user: req.user,
  });
}

function logoutUser(_req, res) {
  res.clearCookie('token', {
    httpOnly: true,
  });

  return res.status(200).json({
    message: 'Logout successful',
  });
}

module.exports = {registerUser, loginUser, getCurrentUser, logoutUser};
