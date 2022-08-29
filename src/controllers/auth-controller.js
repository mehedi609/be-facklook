const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require('../helpers/validation');
const { generateToken, verifyToken } = require('../helpers/tokens');
const { getBaseUrl } = require('../helpers/getBaseUrl');
const { sendVerificationEmail } = require('../helpers/mailer');

exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      username,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'invalid email address',
      });
    }

    const check = await User.findOne({ email });

    if (check) {
      return res.status(400).json({
        message:
          'This email address already exists,try with a different email address',
      });
    }

    if (!validateLength(firstName, 3, 30)) {
      return res.status(400).json({
        message: 'first name must between 3 and 30 characters.',
      });
    }

    if (!validateLength(lastName, 3, 30)) {
      return res.status(400).json({
        message: 'last name must between 3 and 30 characters.',
      });
    }

    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: 'password must be atleast 6 characters.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let tempUsername = firstName + lastName;
    let newUsername = await validateUsername(tempUsername);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username: newUsername,
      bYear,
      bMonth,
      bDay,
      gender,
    });

    await user.save();

    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      '30m',
    );

    const url = `${getBaseUrl()}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.firstName, url);

    const token = generateToken({ id: user._id.toString() }, '7d');

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: 'Register Success ! please activate your email to start',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const user = verifyToken(token);

    if (!user) {
      return res.status(403).json({ message: 'Invalid or Expired token' });
    }

    const check = await User.findById(user.id);

    if (check.verified) {
      return res
        .status(400)
        .json({ message: 'this email is already activated' });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: 'Account has been activated successfully.' });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials.Please try again.',
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        message:
          'Your account is not verified yet. Please activate your account and try again.',
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: 'Invalid credentials.Please try again.',
      });
    }

    const token = generateToken({ id: user._id.toString() }, '7d');

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: 'Login Success',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
