const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { createTweet,getAllTweets, getUserTweets, getOtherUserTweets, deleteTweet, getFeed} = require('../controllers/tweetController');

// Routes for tweets
router.post('/create', ensureAuthenticated, createTweet);
router.get('/', getAllTweets);
router.get('/user/:id', getOtherUserTweets);
router.delete('/delete/:id', ensureAuthenticated, deleteTweet);
router.get('/feed', ensureAuthenticated, getFeed);

module.exports = router;
