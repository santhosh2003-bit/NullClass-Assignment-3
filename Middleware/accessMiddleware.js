const User = require("../Model/User");
const { detectDevice } = require("../utility/deviceDetection");

const logAccess = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { ip, browser, os, device } = detectDevice(req);

  user.accessLogs.push({
    ipAddress: ip,
    browser,
    os,
    device,
  });

  await user.save();
  next();
};

module.exports = logAccess;
