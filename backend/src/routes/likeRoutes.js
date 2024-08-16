const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { likeTweet, unlikeTweet } = require('../controllers/likeController');

// Routes for liking and unliking tweets
router.post('/:id/like',  likeTweet);
router.post('/:id/unlike', unlikeTweet);

module.exports = router;
