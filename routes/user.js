require("dotenv").config();
const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const sendMail = require("../helpers");
const forgotPasswordSecret = process.env.FORGOT_PASSWORD_SECRET;
const router = new express.Router();

router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    await user.toJSON();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post("/forgetpassword", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      forgotPasswordSecret,
      {
        expiresIn: "10m",
      }
    );
    const url = `https://delightful-buttercream-12ecde.netlify.app/reset?token=${token}`;
    await sendMail(
      email,
      "Reset Pass for your Task",
      `<h4>Someone (hopefully you) has requested a password reset for your account. Follow the link below to set a new password:</h4><a href="https://delightful-buttercream-12ecde.netlify.app/reset?token=${token}">Reset Password Here</a>`
    );
    return res.status(200).send(url);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
});

router.put("/resetpassword", async (req, res) => {
  try {
    const { token, password } = req.body;
    const { id, email } = jwt.verify(token, forgotPasswordSecret);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.status(200).json({
      message: "Password changed succesfully",
      success: true,
      email: email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save;
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
