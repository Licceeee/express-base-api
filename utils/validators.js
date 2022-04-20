const { check } = require('express-validator');

module.exports = {
  validateFirstName: check('first_name')
    .not()
    .isEmpty()
    .withMessage("name can't be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage('Min 2, max 50 chars')
    .isAlpha()
    .withMessage('Only chars allowed'),
  validateLastName: check('last_name')
    .not()
    .isEmpty()
    .withMessage("name can't be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage('Min 2, max 50 chars')
    .isAlpha()
    .withMessage('Only chars allowed'),
  validateEmail: check('email')
    .not()
    .isEmpty()
    .withMessage("email can't be empty")
    .isLength({ min: 5, max: 100 })
    .withMessage('Min 5, max 100 chars')
    .isEmail()
    .withMessage('Only valid mailformat allowed'),
  validatePassword: check('password')
    .not()
    .isEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 8, max: 100 })
    .withMessage('Min 8, max 100 chars'),
  validateIsActive: check('active')
    .isBoolean()
    .withMessage('Only boolean values allowed'),
  validateUserId: check('userId')
    .not()
    .isEmpty()
    .withMessage("Id can't be empty"),
  validateName: check('name')
    .not()
    .isEmpty()
    .withMessage("name can't be empty")
    .isLength({ min: 2, max: 400 })
    .withMessage('Min 2, max 400 chars'),
};