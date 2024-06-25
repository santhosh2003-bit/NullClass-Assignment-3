const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ip = require("ip");
const { detectDevice } = require("../utility/deviceDetection");
const dotenv = require("dotenv");
dotenv.config();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    const bcryptPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: bcryptPassword,
    });
    await user.save();
    return res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const { browser, os, device } = detectDevice(req);

  user.loginHistory.push({ ipAddress: ip.address(), browser, os, device });
  await user.save();

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 1 * 60000); // OTP valid for 1 minute
  await user.save();

  const Transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASS,
    },
  });
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: "OTP",
    html: `<h1>Your OTP is ${otp}</h1>`,
  };

  Transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.json({ message: "OTP sent to your email ", success: true, user });
    }
  });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!email || !otp) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }
  try {
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    const useDetails = {
      email: user.email,
      name: user.name,
    };
    res.json({ token, useDetails });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const checkAccessControl = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const currentTime = new Date().toTimeString().slice(0, 5); // Current time in HH:MM format

  // Extracting start and end times
  const { start, end } = user.accessControl.timeBased;

  if (start > end) {
    // Handle cases where the time range spans midnight (e.g., 22:00 to 06:00)
    if (currentTime < start && currentTime > end) {
      return res
        .status(403)
        .json({ message: "Access not allowed at this time" });
    }
  } else {
    // Regular time range comparison
    if (currentTime < start || currentTime > end) {
      return res
        .status(403)
        .json({ message: "Access not allowed at this time" });
    }
  }

  next();
};

// const setAccessControlTimes = async (req, res) => {
//   const { start, end } = req.body;
//   const user = await User.findById(req.user.id);

//   user.accessControl.timeBased.start = start;
//   user.accessControl.timeBased.end = end;
//   await user.save();

//   res.json({ message: "Access control times updated" });
// };

const getAccessLogs = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

module.exports = {
  register,
  login,
  verifyOTP,
  checkAccessControl,
  // setAccessControlTimes,
  getAccessLogs,
};
