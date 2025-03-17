import 'reflect-metadata';
import request from 'supertest';

import app from '../../app';

describe('Auth routes', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return a 201 status code if given the correct user structure and the user does not exist yet', async () => {
      // Arrange
      const newUser = {
        email: 'example1234@example.com',
        password: 'test-password',
      };

      // Act
      const result = await request(app).post('/api/v1/auth/register').send(newUser);

      // Assert
      expect(result.status).toEqual(201);
    });
  });
});
