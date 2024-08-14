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
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Auth Routes', () => {
    const userData = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
    };

  // Ensure the user is created before testing login/logout
  beforeEach(async () => {
    await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      },
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpassword123',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('username', 'newuser');
  });

  it('should not register a user with existing email', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(userData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'User already exists');
  });

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email', userData.email);
  });

  it('should not log in with incorrect password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: userData.email,
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });

  it('should log out a user', async () => {
    const agent = request.agent(app);

    // Log in
    await agent.post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    // Log out
    const response = await agent.post('/auth/logout');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Logged out successfully');
  });

  it('should delete a user account', async () => {
    const agent = request.agent(app);

    // Log in
    await agent.post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    // Delete user
    const response = await agent.delete('/auth/delete');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User account deleted successfully');

    // Ensure user is deleted
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    expect(user).toBeNull();
  });
});
