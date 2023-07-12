const express = require("express");
let router = express.Router();

const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
// const auth = require('../../middleware/auth');
const User = require(".././models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth");

const Container = require("../models/Container");
const Card = require("../models/Card");
const { body, validationResult } = require("express-validator");

// create a user
router.post(
  "/",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({
    min: 6,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    console.log("errors", errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      // encrypt password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  }
);

// get user by id
router.get("/:id", async (req, res) => {
  res.send("get all users");
});

// delete a user
router.delete("/", auth, async (req, res) => {
  try {
    await Container.deleteMany({ user: req.user.id });
    await Card.deleteMany({ user: req.user.id });

    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
    //res.end()
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(500).json({ msg: "User not found" });
    }
  }
});

module.exports = router;
