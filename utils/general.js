const bcrypt = require("bcrypt");

const Code = require("../models/code.model");
const User = require("../models/user.model");
const Token = require("../models/token.model");

const serverUrl = process.env.SERVER_PROD_URL;
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("./email/send.mail");

const sendAccountConfirmationMail = async (email) => {
  const user = await User.findOne({ email });

  if (user) {
    let secretCode = await Code.findOne({ email });

    if (!secretCode) {
      secretCode = await Code.create({
        secretCode: await bcrypt.hash(uuidv4().toString(), 10),
        email,
      });
    }

    const link = `${serverUrl}/emailConfirm/${secretCode.secretCode}/${user._id}`;

    try {
      await sendEmail(
        user.email,
        "Welcome! Please confirm your email",
        { name: `${user.first_name} ${user.last_name} `, link },
        "./template/welcome.handlebars"
      );
      return {
        success: true,
        msg: "Email sucessfully sent",
      };
    } catch (e) {
      return {
        success: false,
        msg: e.message,
      };
    }
  } else {
    return {
      success: false,
      msg: "No account linked to mail",
    };
  }
};

const createToken = async (user) => {
  // the next 2 lines prevents users from having multiple login devices,
  // delete if not needed
  const oldToken = await Token.findOne({ userId: user._id });
  oldToken && await oldToken.deleteOne();

  return await Token.create({
    userId: user._id,
    token: await user.createToken(),
    createdAt: Date.now(),
  });

};

module.exports = {
  sendAccountConfirmationMail,
  createToken,
};
