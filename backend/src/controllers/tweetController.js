const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a tweet
const createTweet = async (req, res) => {
  const { content, userId } = req.body;  // Expect userId to be optionally provided in the body
  console.log('Session Data:', req.session);
  console.log('Request Body:', req.body);
  try {
    const tweetData = { content };
    // Include authorId if it is provided
    if (userId) {
      tweetData.authorId = userId;
    }
    const tweet = await prisma.tweet.create({
      data: tweetData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        likes: true,
      },
    });

    res.status(201).json({ message: 'Tweet created successfully', tweet });
  } catch (err) {
    console.error('Failed to create tweet:', err);
    res.status(500).json({ error: 'Failed to create tweet' });
  }
};

// Get all tweets
const getAllTweets = async (req, res) => {
  try {
    const tweets = await prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        likes: true,
      },
    });
    res.status(200).json({ tweets });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
};


// Get tweets for the logged-in user
const getUserTweets = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const tweets = await prisma.tweet.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        likes: true,
      },
    });
    res.status(200).json({ tweets });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
};


// Get user's tweets by id
const getOtherUserTweets = async (req, res) => {
    const userId = parseInt(req.params.id);
  
    try {
      // Fetch tweets authored by the specified user, sorted by creation date
      const tweets = await prisma.tweet.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
      });
  
      res.status(200).json({ tweets });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user tweets' });
    }
};
  
// Delete a tweet
const deleteTweet = async (req, res) => {
  const tweetId = parseInt(req.params.id);
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweet || tweet.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this tweet' });
    }

    await prisma.tweet.delete({
      where: { id: tweetId },
    });

    res.status(200).json({ message: 'Tweet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tweet' });
  }
};

const getFeed = async (req, res) => {
    const userId = req.session.userId;
  
    try {
      // Fetch the list of users that the logged-in user follows
      const following = await prisma.follows.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
  
      const followingIds = following.map(f => f.followingId);
  
      // Fetch tweets from these users, sorted by creation date
      const tweets = await prisma.tweet.findMany({
        where: { authorId: { in: followingIds } },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
  
      res.status(200).json({ tweets });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch feed' });
    }
};
    

module.exports = {
  createTweet,
  getAllTweets,
  getUserTweets,
  getOtherUserTweets,
  deleteTweet,
  getFeed
};
