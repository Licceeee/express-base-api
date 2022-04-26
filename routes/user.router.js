/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

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

router.get('/me', me)
router.get('/:id', get_by_id);
router.put('/changePassword', [validatePassword], update_password);
router.put(
  '/:id',
  [validateFirstName, validateLastName, validateEmail],
  update,
);
module.exports = router;