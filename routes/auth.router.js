const express = require('express');

const router = express.Router();

const {
  validateFirstName, validateLastName, validateEmail,
  validatePassword,
} = require('../utils/validators');

const {
  login,
  signup,
  emailConfirm,
  resetPasswordRequest,
  resetPassword,
} = require('../controllers/auth.controller');

router.post('/signup', [validateFirstName, validateLastName, validatePassword,
  validateEmail], signup);
router.post('/login', login);
router.get('/emailConfirm/:secretCode/:userId', emailConfirm);
router.post('/resetPasswordRequest', [validateEmail],
  resetPasswordRequest);
router.post('/resetPassword', [validatePassword], resetPassword);

module.exports = router;