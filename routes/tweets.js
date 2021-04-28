const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { Tweet } = db;
const asyncHandler = require("../utils/asynchandler");
const { check, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  console.log(req);
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
  }
  next();
};

const validatorErrors = [
  check("message")
    .exists({ checkFalsy: true })
    .withMessage("enter msg")
    .isLength({ max: 280 })
    .withMessage("Cannot be more than 280 charecters"),
  handleValidationErrors,
];

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tweets = await Tweet.findAll();
    res.json({ tweets });
  })
);

router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id);
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet) res.json(tweet);
    let err = new Error("Tweet not found");
    err.status = 404;
    next(err);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { message } = req.body;
    if (message) {
      const newTweet = await db.Tweet.build({ message });
      await newTweet.save();
      res.json({ newTweet });
    }
  })
);

router.put("/:id(\\d+)", async (req, res) => {
  const tweetId = parseInt(req.params.id);
  const updatedTweet = await Tweet.findByPk(tweetId);
  //we need to update
});

module.exports = router;
