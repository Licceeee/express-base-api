/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const authorize = require('../middlewares/authotizeUser')

const {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
} = require('../utils/validators');

const {
  me,
  get_by_id,
  update,
  update_password,
} = require('../controllers/user.controller');

router.get('/me', authorize, me)
router.get('/:id', authorize, get_by_id);
router.put('/changePassword', [validatePassword], update_password);
router.put(
  '/:id',
  [validateFirstName, validateLastName, validateEmail],
  update,
);
module.exports = router;