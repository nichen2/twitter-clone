const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

// Use the test database URL
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
  // Run migrations to set up the test database
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  });
});

afterAll(async () => {
  await prisma.tweet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Tweet Routes', () => {
    const userDataTweet = {
        username: 'tweetUser',
        email: 'tweetuser@example.com',
        password: 'tweetpassword123',
    };      

  let agent;

  beforeEach(async () => {
    // Create a user
    const hashedPassword = await bcrypt.hash(userDataTweet.password, 10);
    await prisma.user.create({
      data: {
        username: userDataTweet.username,
        email: userDataTweet.email,
        password: hashedPassword,
      },
    });

    agent = request.agent(app);

    // Log in the user
    await agent.post('/auth/login').send({
      email: userDataTweet.email,
      password: userDataTweet.password,
    });
  });

  afterEach(async () => {
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should create a new tweet', async () => {
    const response = await agent.post('/tweets/create').send({
      content: 'Hello, Twitter!',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Tweet created successfully');
    expect(response.body.tweet).toHaveProperty('content', 'Hello, Twitter!');
  });

  it('should not create a tweet if not authenticated', async () => {
    const response = await request(app).post('/tweets/create').send({
      content: 'Hello, Twitter!',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Not authenticated');
  });

  it('should allow a user to delete their own tweet', async () => {
    const createResponse = await agent.post('/tweets/create').send({
      content: 'This is a tweet to be deleted',
    });

    const tweetId = createResponse.body.tweet.id;

    const deleteResponse = await agent.delete(`/tweets/delete/${tweetId}`);
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.message).toBe('Tweet deleted successfully');
  });

  it('should not allow a user to delete someone else’s tweet', async () => {
    const otherUser = await prisma.user.create({
      data: {
        username: 'otheruser',
        email: 'otheruser@example.com',
        password: await bcrypt.hash('password456', 10),
      },
    });

    const otherTweet = await prisma.tweet.create({
      data: {
        content: 'This is someone else’s tweet',
        authorId: otherUser.id,
      },
    });

    const response = await agent.delete(`/tweets/delete/${otherTweet.id}`);
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Not authorized to delete this tweet');
  });
});
