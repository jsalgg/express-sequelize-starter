const express = require("express");
const router = express.Router();
const db = require("../db/models");
//all the imports
const { Tweet } = db;
const { asyncHandler, handleValidationErrors } = require("../utils/utils");
const { check, validationResult } = require("express-validator");
const { requireAuth } = require("../auth");
//all the middleware
const validatorErrors = [
  check("message")
    .exists({ checkFalsy: true })
    .withMessage("enter msg")
    .isLength({ max: 280 })
    .withMessage("Cannot be more than 280 charecters"),
  handleValidationErrors,
];
router.use(requireAuth);
//actual routes
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
  validatorErrors,
  asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (message) {
      const newTweet = await db.Tweet.build({ message });
      await newTweet.save();
      res.json({ newTweet });
    }
  })
);

router.put(
  "/:id(\\d+)",
  validatorErrors,
  asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id);
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet) {
      tweet.message = req.body.message;
      await tweet.save();
      res.json({ tweet });
    }
    let err = new Error("Tweet not found");
    err.status = 404;
    next(err);
  })
);

router.delete(
  "/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id);
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet) {
      await tweet.destroy();
      res.status(204).end();
    }
    let err = new Error("Tweet not found");
    err.status = 404;
    next(err);
  })
);

module.exports = router;
