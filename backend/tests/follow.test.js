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
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Follow Routes', () => {
  const userData = {
    username: 'followUser',
    email: 'followuser@example.com',
    password: 'followpassword123',
  };

  const otherUserData = {
    username: 'otherUser',
    email: 'otheruser@example.com',
    password: 'otherpassword123',
  };

  let agent;
  let otherUserId;
  let userId;

  beforeEach(async () => {
    await prisma.follows.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const hashedOtherPassword = await bcrypt.hash(otherUserData.password, 10);
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });

    const otherUser = await prisma.user.create({
      data: {
        username: otherUserData.username,
        email: otherUserData.email,
        password: hashedOtherPassword,
      },
    });

    otherUserId = otherUser.id;
    userId = user.id;
    agent = request.agent(app);
    await agent.post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });
  });

  afterEach(async () => {
    await prisma.follows.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should allow a user to follow another user', async () => {
    const response = await agent.post(`/users/${otherUserId}/follow`);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User followed successfully');
  });

  it('should not allow a user to follow the same user twice', async () => {
    await agent.post(`/users/${otherUserId}/follow`);
    const response = await agent.post(`/users/${otherUserId}/follow`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Already following this user');
  });

  it('should allow a user to unfollow a user', async () => {
    // Follow the user first
    await agent.post(`/users/${otherUserId}/follow`);

    // Then unfollow the user
    const response = await agent.post(`/users/${otherUserId}/unfollow`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User unfollowed successfully');
  });

  it('should not allow a user to unfollow a user they are not following', async () => {
    const response = await agent.post(`/users/${otherUserId}/unfollow`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'You are not following this user');
  });

  it('should not allow a user to follow themselves', async () => {
    const response = await agent.post(`/users/${userId}/follow`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'You cannot follow yourself');
  });

  it('should not allow a user to unfollow themselves', async () => {
    const response = await agent.post(`/users/${userId}/unfollow`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'You cannot unfollow yourself');
  });

  it('should return an error if trying to follow a non-existent user', async () => {
    const nonExistentUserId = 9999;
    const response = await agent.post(`/users/${nonExistentUserId}/follow`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should return an error if trying to unfollow a non-existent user', async () => {
    const nonExistentUserId = 9999;
    const response = await agent.post(`/users/${nonExistentUserId}/unfollow`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
});

