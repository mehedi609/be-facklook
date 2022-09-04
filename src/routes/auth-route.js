require('express-router-group');
const { Router } = require('express');
const {
  register,
  activateAccount,
  login,
} = require('../controllers/auth-controller');
const { authMiddleware } = require('../middlewares/auth-middleware');

const router = Router();

router.group('/auth', (router) => {
  router.post('/register', register);
  router.post('/activate', authMiddleware, activateAccount);
  router.post('/login', login);
});

module.exports = router;
