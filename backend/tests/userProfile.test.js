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

describe('GET /users/:id', () => {
  let user;
  
  beforeEach(async () => {
    await prisma.follows.deleteMany();
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
        tweets: {
          create: [
            { content: 'Test tweet 1' },
            { content: 'Test tweet 2' }
          ]
        }
      },
      include: {
        tweets: true
      }
    });

    console.log('User created:', user);
  });

  afterEach(async () => {
    await prisma.follows.deleteMany();
    await prisma.tweet.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should return the user profile data', async () => {
    console.log('Fetching profile for user ID:', user.id);
    const response = await request(app).get(`/users/${user.id}`);
    console.log('Response received:', response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toHaveProperty('username', 'testuser');
    expect(response.body.user.tweets).toHaveLength(2);
    expect(response.body.user.tweets[0].content).toBe('Test tweet 1');
  });

  it('should return a 404 if the user is not found', async () => {
    const response = await request(app).get('/users/9999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
});
