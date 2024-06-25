const parser = require("ua-parser-js");

const detectDevice = (req) => {
  const ua = parser(req.headers["user-agent"]);
  // console.log(ua);
  return {
    browser: ua.browser.name,
    os: ua.os.name,
    device: ua.device.type || "desktop",
  };
};

module.exports = { detectDevice };
