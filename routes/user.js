const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { asyncHandler, handleValidationErrors } = require("../utils/utils");
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const { User } = db;
const { getUserToken } = require("../auth");

const validateUsername = check("username")
  .exists({ checkFalsy: true })
  .withMessage("Please provide a username");

const validateEmailAndPassword = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
];

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findAll();
    res.json({ user });
  })
);

router.post(
  "/",
  validateUsername,
  validateEmailAndPassword,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, hashedPassword });
    // TODO: Generate JSON Web Token (access token)
    const token = getUserToken(user);
    res.status(201).json({
      user: { id: user.id },
      token,
    });
    // TODO: Render user in JSON
  })
);

module.exports = router;
