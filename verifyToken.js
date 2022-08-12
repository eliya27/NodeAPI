const jwt = require("jsonwebtoken");

//Verify Token middleware
module.exports = function (req, res, next) {
  //Get Auth header value
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Denied access");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.loginuser = verified;
    console.log("Verified");
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
