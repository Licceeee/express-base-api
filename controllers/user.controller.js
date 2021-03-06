/* eslint-disable camelcase */
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const Token = require("../models/token.model");

// ------------------------------------------------------------------ >> GET:ME
exports.me = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.redirect(clientURL);

  const [bearer, token] = authHeader.split(" ");
  if (!token) return res.status(401).send("Access denied");

  try {
    const meToken = await Token.findOne({ token });
    if (!meToken) {
      return res.status(404).send({
        msg: "Entry not found",
        param: "error",
      });
    }
    const user = await User.findById({ _id: meToken.userId });

    return res.json({ user });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// ------------------------------------------------------------------ >> GET:ID
exports.get_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({
        msg: "Entry not found",
        param: "error",
      });
    }

    return res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.createdAt
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// ------------------------------------------------------------------ >> PUT:ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  const toUpdate = {};
  if (first_name) toUpdate.first_name = first_name;
  if (last_name) toUpdate.last_name = last_name;
  if (email) toUpdate.email = email;

  try {
    const updatedObj = await User.findByIdAndUpdate(id, toUpdate, {
      new: true,
    });
    return res.json({
      obj: updatedObj,
      msg: "User update successful",
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// ------------------------------------------------------------------ >> PUT:ID
exports.update_password = async (req, res) => {
  const { userId, old_password, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  const user = await User.findById(userId);
  const match = await bcrypt.compare(old_password, user.password);

  if (!match) {
    return res.status(400).send({
      msg: "Invalid Credentials",
      param: "error",
    });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    user.password = encryptedPassword;
    await user.save();
    return res.json("Password updates successfully");
  } catch (e) {
    return res.status(500).send({
      msg: e.message,
      param: "error",
    });
  }
};
