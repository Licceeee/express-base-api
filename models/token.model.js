const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const tokenSchema = new Schema({
  userId: { type: ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;