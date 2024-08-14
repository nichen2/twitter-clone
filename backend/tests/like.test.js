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
  await prisma.like.deleteMany();
  await prisma.tweet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Like Routes', () => {
  const userData = {
    username: 'likeUser',
    email: 'likeuser@example.com',
    password: 'likepassword123',
  };

  let agent;
  let tweetId;

  beforeEach(async () => {
    await prisma.like.deleteMany();
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });

    const tweet = await prisma.tweet.create({
      data: {
        content: 'This is a tweet to be liked',
        authorId: user.id,
      },
    });

    tweetId = tweet.id;

    agent = request.agent(app);
    await agent.post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });
  });

  afterEach(async () => {
    await prisma.like.deleteMany();
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should allow a user to like a tweet', async () => {
    const response = await agent.post(`/tweets/${tweetId}/like`);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Tweet liked successfully');
  });

  it('should not allow a user to like a tweet more than once', async () => {
    await agent.post(`/tweets/${tweetId}/like`);
    const response = await agent.post(`/tweets/${tweetId}/like`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Tweet already liked');
  });

  it('should allow a user to unlike a tweet', async () => {
    await agent.post(`/tweets/${tweetId}/like`);
    const response = await agent.post(`/tweets/${tweetId}/unlike`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Tweet unliked successfully');
  });

  it('should not allow a user to unlike a tweet they haven’t liked', async () => {
    const response = await agent.post(`/tweets/${tweetId}/unlike`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Like not found');
  });
});
