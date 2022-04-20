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
  get_all,
  get_by_id,
  update,
  update_password,
} = require('../controllers/user.controller');

router.get('/', get_all);
router.get('/:id', get_by_id);

router.put('/changePassword', [validatePassword], update_password);
router.put(
  '/:id',
  [validateFirstName, validateLastName, validateEmail],
  update,
);
module.exports = router;