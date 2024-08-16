const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Like a tweet
const likeTweet = async (req, res) => {
  const tweetId = parseInt(req.params.id);
  const userId = parseInt(req.body.userId);
  
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Check if the tweet exists
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    // Check if the user already liked the tweet
    const existingLike = await prisma.like.findFirst({
      where: {
        tweetId,
        userId,
      },
    });

    if (existingLike) {
      return res.status(400).json({ error: 'Tweet already liked' });
    }

    // Create the like
    const like = await prisma.like.create({
      data: {
        tweetId,
        userId,
      },
    });

    res.status(201).json({ message: 'Tweet liked successfully', like });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like tweet' });
  }
};

// Unlike a tweet
const unlikeTweet = async (req, res) => {
  const tweetId = parseInt(req.params.id);
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Find the like
    const like = await prisma.like.findFirst({
      where: {
        tweetId,
        userId,
      },
    });

    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    // Delete the like
    await prisma.like.delete({
      where: { id: like.id },
    });

    res.status(200).json({ message: 'Tweet unliked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlike tweet' });
  }
};

module.exports = {
  likeTweet,
  unlikeTweet,
};
