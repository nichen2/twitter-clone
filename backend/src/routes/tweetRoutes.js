const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { createTweet,getAllTweets, getUserTweets, getOtherUserTweets, deleteTweet, getFeed} = require('../controllers/tweetController');

// Routes for tweets
router.post('/create',  createTweet);
router.get('/', getAllTweets);
router.get('/user/:id', getOtherUserTweets);
router.delete('/delete/:id',  deleteTweet);
router.get('/feed',  getFeed);

module.exports = router;
