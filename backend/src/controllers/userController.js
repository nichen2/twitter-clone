const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserProfile = async (req, res) => {
  const userId = parseInt(req.params.id);
  const currentUserId = req.session.userId; // Get the current logged-in user's ID

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        tweets: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            likes: {
              select: {
                userId: true,
              },
            },
            author: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        followers: {
          select: {
            followerId: true,
          },
        },
        following: {
          select: {
            followingId: true,
          },
        },
        likes: {
          select: {
            tweet: {  
              select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
                likes: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the current user is following this user
    const isFollowing = await prisma.follows.findFirst({
        where: {
          followerId: currentUserId,
          followingId: userId
        }
      });

    res.status(200).json({ user, followedByCurrentUser: isFollowing });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

module.exports = {
  getUserProfile,
};
