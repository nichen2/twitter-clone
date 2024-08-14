const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { followUser, unfollowUser } = require('../controllers/followController');

// Routes for following and unfollowing users
router.post('/:id/follow', ensureAuthenticated, followUser);
router.post('/:id/unfollow', ensureAuthenticated, unfollowUser);

module.exports = router;
