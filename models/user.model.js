/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: {
    type: String, min: 2, max: 50, trim: true, required: true,
  },
  last_name: {
    type: String, min: 2, max: 50, trim: true, required: true,
  },
  email: {
    type: String, min: 5, max: 100, trim: true, required: true, unique: true,
  },
  password: {
    type: String, min: 8, max: 100, required: true,
  },
  active: { type: Boolean, default: false },
}, { timestamps: true });

// eslint-disable-next-line func-names
userSchema.methods.createToken = function () {
  const payload = { _id: this._id, email: this.email };
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;