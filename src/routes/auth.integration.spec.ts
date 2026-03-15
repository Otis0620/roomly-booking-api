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
});
