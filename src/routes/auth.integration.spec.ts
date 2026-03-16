import request from 'supertest';

import { createContainer } from '@infra/di/container';

import { createApp } from '../app';

const app = createApp(createContainer());

describe('auth', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return 201 with user data on valid registration', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'newuser@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        email: 'newuser@example.com',
        role: 'guest',
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should return 400 when email is already registered', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'existing@example.com', password: 'password123' });

      expect(response.status).toBe(400);
    });

    it('should return 201 with owner role when role is specified', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'owner@example.com', password: 'password123', role: 'owner' });

      expect(response.status).toBe(201);
      expect(response.body.role).toBe('owner');
    });

    it('should return 400 when body is empty', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'notanemail', password: 'password123' });

      expect(response.status).toBe(400);
    });

    it('should return 400 when password is too short', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'newuser@example.com', password: 'short' });

      expect(response.status).toBe(400);
    });

    it('should return 400 when role is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'newuser@example.com', password: 'password123', role: 'superadmin' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 200 with a token on valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'existing@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 when email does not exist', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(response.status).toBe(401);
    });

    it('should return 401 when password is incorrect', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'existing@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    it('should return 400 when body is empty', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'notanemail', password: 'password123' });

      expect(response.status).toBe(400);
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'existing@example.com' });

      expect(response.status).toBe(400);
    });
  });
});
