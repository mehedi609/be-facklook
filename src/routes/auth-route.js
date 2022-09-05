require('express-router-group');
const { Router } = require('express');
const {
  register,
  activateAccount,
  login,
  reSendVerification,
} = require('../controllers/auth-controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

const router = Router();

router.group('/auth', (router) => {
  router.post('/register', register);
  router.post('/login', login);
  router.post('/activate', authMiddleware, activateAccount);
  router.post('/reSendVerification', authMiddleware, reSendVerification);
});

module.exports = router;
