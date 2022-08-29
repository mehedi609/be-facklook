require('express-router-group');
const { Router } = require('express');
const { register } = require('../controllers/auth-controller');

const router = Router();

router.group('/auth', (router) => {
  router.post('/register', register);
});

module.exports = router;
