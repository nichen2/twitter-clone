const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  });
});

afterAll(async () => {
  await prisma.follows.deleteMany();
  await prisma.tweet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Feed Route', () => {
  let agent;
  let user, followedUser, notFollowedUser;

  const userData = {
    username: 'feedUser',
    email: 'feeduser@example.com',
    password: 'feedpassword123',
  };

  const followedUserData = {
    username: 'followedUser',
    email: 'followeduser@example.com',
    password: 'followedpassword123',
  };

  const notFollowedUserData = {
    username: 'notFollowedUser',
    email: 'notfolloweduser@example.com',
    password: 'notfollowedpassword123',
  };

  beforeEach(async () => {
    await prisma.follows.deleteMany();
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const hashedFollowedPassword = await bcrypt.hash(followedUserData.password, 10);
    const hashedNotFollowedPassword = await bcrypt.hash(notFollowedUserData.password, 10);

    user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });

    followedUser = await prisma.user.create({
      data: {
        username: followedUserData.username,
        email: followedUserData.email,
        password: hashedFollowedPassword,
      },
    });

    notFollowedUser = await prisma.user.create({
      data: {
        username: notFollowedUserData.username,
        email: notFollowedUserData.email,
        password: hashedNotFollowedPassword,
      },
    });

    await prisma.follows.create({
      data: {
        followerId: user.id,
        followingId: followedUser.id,
      },
    });

    await prisma.tweet.create({
      data: {
        content: 'This is a tweet from followed user',
        authorId: followedUser.id,
      },
    });

    await prisma.tweet.create({
      data: {
        content: 'This is a tweet from not followed user',
        authorId: notFollowedUser.id,
      },
    });

    agent = request.agent(app);
    await agent.post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });
  });

  afterEach(async () => {
    await prisma.follows.deleteMany();
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should show tweets from followed users in the feed', async () => {
    const response = await agent.get('/tweets/feed');
    expect(response.statusCode).toBe(200);
    expect(response.body.tweets.length).toBe(1);
    expect(response.body.tweets[0].content).toBe('This is a tweet from followed user');
  });

  it('should not show tweets from users that are not followed', async () => {
    const response = await agent.get('/tweets/feed');
    expect(response.statusCode).toBe(200);
    expect(response.body.tweets.length).toBe(1);
    expect(response.body.tweets[0].content).not.toBe('This is a tweet from not followed user');
  });

  it('should show tweets in the correct order', async () => {
    // Create an older tweet
    await prisma.tweet.create({
      data: {
        content: 'Older tweet from followed user',
        authorId: followedUser.id,
        createdAt: new Date(Date.now() - 10000), // 10 seconds earlier
      },
    });

    const response = await agent.get('/tweets/feed');
    expect(response.statusCode).toBe(200);
    expect(response.body.tweets.length).toBe(2);
    expect(response.body.tweets[0].content).toBe('This is a tweet from followed user');
    expect(response.body.tweets[1].content).toBe('Older tweet from followed user');
  });
});
