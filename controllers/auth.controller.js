/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const clientURL = process.env.CLIENT_URL;

const sendEmail = require("../utils/email/send.mail");

const User = require("../models/user.model");
const Token = require("../models/token.model");
const Code = require("../models/code.model");

const {
  sendAccountConfirmationMail,
  createToken,
} = require("../utils/general");

// -------------------- SIGN UP --------------------------------------- >> POST
exports.signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({
        msg: "User already exists",
        param: "error",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      active: false,
      password: encryptedPassword,
    });

    const emailStatus = await sendAccountConfirmationMail(email);

    emailStatus.success
      ? res.json({
          email: user.email,
          name: `${user.first_name} ${user.last_name} `,
          active: user.active,
          emailStatus,
        })
      : res.json(emailStatus.msg);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// -------------------- ACTIVATE / VERIFY USER ------------------------ >> POST
exports.emailConfirm = async (req, res) => {
  const { secretCode, userId } = req.params;

  const user = await User.findOne({ _id: userId });
  const code = await Code.findOne({ email: user.email });
  if (code.secretCode !== secretCode) {
    return res.status(400).send({
      msg: "Cannot verify account",
      param: "error",
    });
  }
  if (user.active) return res.json("already active");

  user.active = true;
  await user.save();
  return res.redirect(clientURL);
};

// -------------------- RESENT ACCOUNT ACTIVATION MAIL ---------------- >> POST
exports.resentEmailConfirm = async (req, res) => {
  const { email } = req.body;

  try {
    const emailStatus = await sendAccountConfirmationMail(email);
    emailStatus.success
      ? res.json({
          email: user.email,
          name: `${user.first_name} ${user.last_name} `,
          active: user.active,
          emailStatus,
        })
      : res.json(emailStatus.msg);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// -------------------- LOGIN ----------------------------------------- >> POST
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({
      msg: "Invalid Credentials",
      param: "error",
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).send({
      msg: "Invalid Credentials",
      param: "error",
    });
  }

  // if (!user.active) {
  //   return res.status(400).send({
  //     msg: {
  //       msg: "Please confirm your email in order to be able to login",
  //       link: `${clientURL}/resent/email/confirm`,
  //     },
  //     param: "error",
  //   });
  // }

  const usertoken = await createToken(user);

  return res
    .set("x-authorization-token", usertoken.token)
    .send("Logged in successfully");
};

// -------------------- PASSWORD REQUEST ------------------------ >> POST
exports.resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        msg: "User does not exist",
        param: "error",
      });
    }

    const userToken = await createToken(user);

    const url = `${clientURL}/reset/password/${user._id}/${userToken.token}`;
    sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: `${user.first_name} ${user.last_name} `,
        link: url,
        email: user.email,
      },
      "./template/requestResetPassword.handlebars"
    );

    return res.json({
      userId: user._id,
      email: user.email,
      name: `${user.first_name} ${user.last_name} `,
      link: url,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// -------------------- RESET PASSWORD -------------------------------- >> POST
exports.resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors });
  }

  const passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    return res.status(400).send({
      msg: "Invalid or expired password reset token",
      param: "error",
    });
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    return res.status(400).send({
      msg: "Invalid or expired password reset token",
      param: "error",
    });
  }

  const hash = await bcrypt.hash(password, 10);
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });
  if (!user) {
    return res.status(400).send({
      msg: "User does not exist",
      param: "error",
    });
  }

  sendEmail(
    user.email,
    "Password succesfully updated",
    {
      name: `${user.first_name} ${user.last_name} `,
    },
    "./template/resetPassword.handlebars"
  );
  await passwordResetToken.deleteOne();
  return res.json("Password succesfully updated");
};
