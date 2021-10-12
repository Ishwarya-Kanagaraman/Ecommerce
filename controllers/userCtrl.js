const Users = require("../models/userModel.js");
const Payments = require("../models/PaymentModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "~Qc(V7/p424C>z`z5Ct3CUU6TY5~ZA,M:9PMds?Czr*F}EzX7";
const REFRESH_KEY =
  "eT}<5na@u*tfK6n6d=HYdH/xy:G;6?DYv[&XA(vfc/3nNCxPQ!=nJ;7FN_b^>n{^/{Y~,v!dJeZ?XvuAV7{qj5zEgCF$tPGq)";
const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "The Email already exists!" });
      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password is atleast 6 characters long " });
      }

      // password encryption
      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      // save to mongodb
      await newUser.save();

      //create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7*24*60*60*1000  // 7 days in milliseconds

      });
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // if login success, create Access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7*24*60*60*1000  // 7 days in milliseconds
      });
      res.json({ accesstoken });
      //   res.json({msg:"login Successful"})
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res.status(400).json({
          msg: "Please Login or Register",
        });
      }
      jwt.verify(rf_token, REFRESH_KEY, (err, user) => {
        if (err)
          return res.status(400).json({
            msg: "Please Login or Register",
          });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
      res.json({ rf_token });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User doesnot exists" });
      res.json(user);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
  },

  addCart:async (req,res)=>{
    try{
        const user=await Users.findById(req.user.id)
        if(!user) return res.status(400).json({ msg:"user doesn't exist." });
        await Users.findOneAndUpdate({_id:req.user.id},{
          cart:req.body.cart
        })
        return res.json({msg:"Added to Cart"})
    }catch(err){
      return res.status(500).json({ msg: err.message });

    }
  },

  history: async(req,res)=>{
    try{
      const history=await Payments.find({user_id:req.user.id})
      res.json(history)
    }catch(err){
      return res.status(500).json({ msg: err.message });
    }
  }
};
const createAccessToken = (user) => {
  return jwt.sign(user, SECRET_KEY, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, REFRESH_KEY, { expiresIn: "7d" });
};
module.exports = userCtrl;
