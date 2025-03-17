import 'reflect-metadata';
import request from 'supertest';

import app from '../../app';

describe('Auth routes', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return a 201 status code if given the correct user structure and the user does not exist yet', async () => {
      // Arrange
      const newUser = {
        email: 'example1@example.com',
        password: 'test-password',
      };

      // Act
      const { status } = await request(app).post('/api/v1/auth/register').send(newUser);

      // Assert
      expect(status).toEqual(201);
    });

    it('should return a 400 status code if request is missing new user information', async () => {
      // Act
      const { status } = await request(app).post('/api/v1/auth/register').send({});

      // Assert
      expect(status).toEqual(400);
    });

    it('should return a 400 status code if user already exists', async () => {
      // Arrange
      const newUser = {
        email: 'example2@example.com',
        password: 'test-password',
      };

      // Act

      // We need to create the user first
      await request(app).post('/api/v1/auth/register').send(newUser);

      // Try to create the user again
      const result = await request(app).post('/api/v1/auth/register').send(newUser);

      const { error, code } = result.body;

      // Assert
      expect(result.status).toEqual(400);
      expect(error).toEqual('Bad Request');
      expect(code).toEqual(400);
    });
  });
});
