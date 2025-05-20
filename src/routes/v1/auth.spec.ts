import 'reflect-metadata';
import request from 'supertest';

import app from '../../app';

describe('Auth routes', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return a 201 status code if given the correct user structure and the user does not exist yet', async () => {
      const newUser = {
        email: 'example1@example.com',
        password: 'test-password',
      };

      const { status } = await request(app).post('/api/v1/auth/register').send(newUser);

      expect(status).toEqual(201);
    });

    it('should return a 400 status code if request is missing new user information', async () => {
      const { status } = await request(app).post('/api/v1/auth/register').send({});

      expect(status).toEqual(400);
    });

    it('should return a 400 status code if user already exists', async () => {
      const newUser = {
        email: 'example2@example.com',
        password: 'test-password',
      };

      // Create the user first
      await request(app).post('/api/v1/auth/register').send(newUser);

      // Try to create the user again
      const result = await request(app).post('/api/v1/auth/register').send(newUser);

      const { error, code } = result.body;

      expect(result.status).toEqual(400);
      expect(error).toEqual('Bad Request');
      expect(code).toEqual(400);
    });
  });
  describe('POST /api/v1/auth/login', () => {
    const testUser = {
      email: 'login-test@example.com',
      password: 'secure-password',
    };

    beforeAll(async () => {
      await request(app).post('/api/v1/auth/register').send(testUser);
    });

    it('should return 200 and a token for valid login', async () => {
      const response = await request(app).post('/api/v1/auth/login').send(testUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({ email: testUser.email });
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should return 400 for incorrect password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ ...testUser, password: 'wrong-password' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should return 400 for missing login fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should return 400 for non-existent user', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'any-password',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });
  });
});
