const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

const app = require('../app');

jest.setTimeout(15000);

const mockUser = {
  firstName: 'User',
  lastName: 'One',
  email: 'userone@email.com',
  password: bcrypt.hashSync('User123', 15),
  address: 'The void',
  bio: 'Control',
  occupation: 'DB Admin',
  expertise: 'PostgreSQL',

  to_json() {
    return this;
  },
};

describe('Signup - POST /api/v1/auth/signup', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should signup a single user', async () => {
    jest.spyOn(User, 'create').mockImplementation(async () => mockUser);

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(mockUser);

    const { token } = response.body.data;

    const decodedObject = jwt.verify(token, process.env.JWT_SECRET);
    const { firstName } = decodedObject;

    expect(firstName).toEqual(mockUser.firstName);
    expect(response.statusCode).toBe(201);
    expect(response.body.data.message).toBe('User created successfully');
  });

  it('should throw a 422 when the request body is invalid', async () => {
    const { password, ...incompleteMockUser } = mockUser;

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(incompleteMockUser);

    expect(response.statusCode).toBe(422);
  });

  it('should throw a 400 when email already exists', async () => {
    jest
      .spyOn(User, 'filter_by')
      .mockImplementation(async () => [mockUser, mockUser]);

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(mockUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(400);
  });
});

describe('Login - POST /api/v1/auth/signin', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should login a user', async () => {
    const mockReq = { email: 'userone@email.com', password: 'User123' };

    jest.spyOn(User, 'filter_by').mockImplementation(() => [mockUser]);

    const response = await request(app)
      .post('/api/v1/auth/signin')
      .send(mockReq);

    const { token } = response.body.data;

    const decodedObject = jwt.verify(token, process.env.JWT_SECRET);
    const { firstName } = decodedObject;

    expect(firstName).toEqual(mockUser.firstName);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User is successfully logged in');
  });

  it('should throw a 422 when request body is invalid for a login', async () => {
    const { password, ...incompleteMockUser } = mockUser;

    const response = await request(app)
      .post('/api/v1/auth/signin')
      .send(incompleteMockUser)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(422);
  });

  it('should throw a 400 when email or password is incorrect', async () => {
    const mockReq = { email: 'userone@email.com', password: 'User12' };
    jest.spyOn(User, 'filter_by').mockImplementation(() => [mockUser]);

    const response = await request(app)
      .post('/api/v1/auth/signin')
      .send(mockReq);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid email or password');
    expect(response.body.status).toBe(400);
  });
});
