const { verifyToken } = require('../helpers/tokens');

exports.authMiddleware = async (req, res, next) => {
  try {
    const header = req.header('Authorization');

    if (!header || !header.includes('Bearer ')) {
      return res.status(400).json({ message: 'Invalid Token' });
    }

    const token = header.split('Bearer ')[1];
    req.user = verifyToken(token);

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
