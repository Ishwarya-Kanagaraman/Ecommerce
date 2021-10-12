const jwt = require("jsonwebtoken");
const SECRET_KEY = "~Qc(V7/p424C>z`z5Ct3CUU6TY5~ZA,M:9PMds?Czr*F}EzX7";
const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Invalid authentication" });
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(400).json({ msg: "Invalid authentication" });
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
