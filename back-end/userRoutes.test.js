// __tests__/api.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock your check functions
jest.mock('./check', () => ({
  Emailcheck: jest.fn(),
  UIDcheck: jest.fn(),
}));

// Import router and other dependencies
const router = require('../userRoutes');
const { Emailcheck } = require('./check');

// Create an instance of express and use the router
const app = express();
app.use(bodyParser.json());
app.use('/', router);

// Mock database connection
const mockDbConnection = {
  promise: () => ({
    query: jest.fn(),
  }),
};
app.set('dbConnection', mockDbConnection);

describe('POST /get', () => {
  it('should respond with user data', async () => {
    // Mocking the database query
    mockDbConnection.promise().query.mockResolvedValueOnce([
      [{ UID: '123', FirstName: 'John', LastName: 'Doe', Email: 'john@example.com', ProfileURL: 'url' }],
    ]);

    // Mocking Emailcheck function
    Emailcheck.mockResolvedValue();

    // Make a request to the API
    const response = await request(app)
      .post('/get')
      .send({ p1: 'john@example.com', p2: 'someToken' });

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      UID: '123',
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      ProfileURL: 'url',
    });

    // Check if the mocked functions are called correctly
    expect(Emailcheck).toHaveBeenCalledWith(mockDbConnection, 'john@example.com');
    expect(mockDbConnection.promise().query).toHaveBeenCalledTimes(2);
  });

  // Add more tests as needed, like error handling scenarios
});

