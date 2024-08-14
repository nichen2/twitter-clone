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
  await prisma.tweet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('User Tweets Route', () => {
  let user, otherUser;

  const userData = {
    username: 'userTweetsUser',
    email: 'usertweetsuser@example.com',
    password: 'usertweetspassword123',
  };

  const otherUserData = {
    username: 'otherUser',
    email: 'otheruser@example.com',
    password: 'otherpassword123',
  };

  beforeEach(async () => {
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const hashedOtherPassword = await bcrypt.hash(otherUserData.password, 10);

    user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });

    otherUser = await prisma.user.create({
      data: {
        username: otherUserData.username,
        email: otherUserData.email,
        password: hashedOtherPassword,
      },
    });

    // Create some tweets for the user
    await prisma.tweet.create({
      data: {
        content: 'First tweet from user',
        authorId: user.id,
        createdAt: new Date(Date.now() - 10000), // 10 seconds earlier
      },
    });

    await prisma.tweet.create({
      data: {
        content: 'Second tweet from user',
        authorId: user.id,
      },
    });

    // Create a tweet for the other user
    await prisma.tweet.create({
      data: {
        content: 'Tweet from other user',
        authorId: otherUser.id,
      },
    });
  });

  afterEach(async () => {
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should return tweets for the specified user', async () => {
    const response = await request(app).get(`/tweets/user/${user.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.tweets.length).toBe(2);
    expect(response.body.tweets[0].content).toBe('Second tweet from user');
    expect(response.body.tweets[1].content).toBe('First tweet from user');
  });

  it('should return an empty array if the user has no tweets', async () => {
    // Delete tweets for the user
    await prisma.tweet.deleteMany({ where: { authorId: user.id } });

    const response = await request(app).get(`/tweets/user/${user.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.tweets.length).toBe(0);
  });

  it('should not return tweets from other users', async () => {
    const response = await request(app).get(`/tweets/user/${user.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.tweets.length).toBe(2);
    response.body.tweets.forEach(tweet => {
      expect(tweet.authorId).toBe(user.id);
    });
  });
});
