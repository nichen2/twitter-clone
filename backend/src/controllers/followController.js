const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Follow a user
const followUser = async (req, res) => {
  const userIdToFollow = parseInt(req.params.id);
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (userId === userIdToFollow) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  try {
    // Check if the user to follow exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: userIdToFollow },
    });

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const existingFollow = await prisma.follows.findFirst({
      where: {
        followerId: userId,
        followingId: userIdToFollow,
      },
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Create the follow relationship
    const follow = await prisma.follows.create({
      data: {
        followerId: userId,
        followingId: userIdToFollow,
      },
    });

    res.status(201).json({ message: 'User followed successfully', follow });
  } catch (err) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const userIdToUnfollow = parseInt(req.params.id);
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (userId === userIdToUnfollow) {
    return res.status(400).json({ error: 'You cannot unfollow yourself' });
  }

  try {
    // Check if the user to unfollow exists
    const userToUnfollow = await prisma.user.findUnique({
      where: { id: userIdToUnfollow },
    });

    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if following
    const follow = await prisma.follows.findFirst({
      where: {
        followerId: userId,
        followingId: userIdToUnfollow,
      },
    });

    if (!follow) {
      return res.status(400).json({ error: 'You are not following this user' });
    }

    // Delete the follow relationship
    await prisma.follows.delete({
      where: { id: follow.id },
    });

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

module.exports = {
  followUser,
  unfollowUser,
};
