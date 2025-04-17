const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

const app = require('../app');

jest.setTimeout(15000);

const mockUser = {
  id: 1,
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
  save: jest.fn(),
};

describe('Promote user - PATCH /api/v1/user/:userId', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should promote user to mentor', async () => {
    const spy = jest.spyOn(User, 'get_by_id');
    const adminUser = { role: 'admin', id: 2, ...mockUser };
    const token = jwt.sign(adminUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    spy
      .mockImplementationOnce(() => adminUser)
      .mockImplementationOnce(() => mockUser);

    const response = await request(app)
      .patch('/api/v1/user/1')
      .set('token', token);

    expect(mockUser.role).toBe('mentor');
    expect(spy).toHaveBeenNthCalledWith(1, adminUser.id);
    expect(spy).toHaveBeenLastCalledWith(mockUser.id);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.message).toBe('User account changed to mentor');
  });

  it('should throw a 403 for non-admin request', async () => {
    const spy = jest.spyOn(User, 'get_by_id');
    const adminUser = { id: 2, ...mockUser };
    const token = jwt.sign(adminUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    spy.mockImplementationOnce(() => adminUser);

    const response = await request(app)
      .patch('/api/v1/user/1')
      .set('token', token);

    expect(spy).toHaveBeenCalledWith(adminUser.id);
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('Admin only request');
  });

  it('should throw a 401 for invalid token', async () => {
    const response = await request(app)
      .patch('/api/v1/user/1')
      .set('token', 'token');

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should throw a 401 for absent token', async () => {
    const response = await request(app).patch('/api/v1/user/1');

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should throw 404 if userId is not found', async () => {
    const spy = jest.spyOn(User, 'get_by_id');
    const adminUser = { ...mockUser, role: 'admin', id: 2 };
    const token = jwt.sign(adminUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    spy
      .mockImplementationOnce(() => adminUser)
      .mockImplementationOnce(() => undefined);

    const response = await request(app)
      .patch('/api/v1/user/1')
      .set('token', token);

    expect(spy).toHaveBeenNthCalledWith(1, adminUser.id);
    expect(spy).toHaveBeenLastCalledWith(1);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User with id 1 not found');
  });

  it('should throw 422 if userId is invalid', async () => {
    const spy = jest.spyOn(User, 'get_by_id');
    const adminUser = { ...mockUser, role: 'admin', id: 2 };
    const token = jwt.sign(adminUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    spy.mockImplementationOnce(() => adminUser);

    const response = await request(app)
      .patch('/api/v1/user/string')
      .set('token', token);

    expect(spy).toHaveBeenNthCalledWith(1, adminUser.id);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBeDefined();
  });
});

describe.only('Get Mentor - GET /api/v1/mentors/:mentorId', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retrieves a single mentor', async () => {
    const spyId = jest.spyOn(User, 'get_by_id');
    const spyFilter = jest.spyOn(User, 'filter_by');
    const mockMentor = { ...mockUser, role: 'mentor', firstName: 'Mentor' };

    const token = jwt.sign(mockUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    spyId.mockImplementationOnce(() => mockUser);
    spyFilter.mockImplementationOnce(() => [mockMentor]);

    const response = await request(app)
      .get(`/api/v1/mentors/${mockMentor.id}`)
      .set('token', token);

    const { firstName } = response.body.data;

    expect(spyId).toHaveBeenCalledWith(mockUser.id);
    expect(spyFilter).toHaveBeenCalledWith({
      role: 'mentor',
      id: mockMentor.id,
    });
    expect(firstName).toEqual(mockMentor.firstName);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeUndefined();
  });

  it('throws a 401 for unauthorized requests', async () => {
    const response = await request(app).get('/api/v1/mentors/1');

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('throws a 404 if mentor is not found', async () => {
    const spyId = jest.spyOn(User, 'get_by_id');
    const spyFilter = jest.spyOn(User, 'filter_by');
    const mockMentor = { ...mockUser, role: 'mentor', firstName: 'Mentor' };

    const token = jwt.sign(mockUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    spyId.mockImplementationOnce(() => mockUser);
    spyFilter.mockImplementationOnce(() => []);

    const response = await request(app)
      .get(`/api/v1/mentors/${mockMentor.id}`)
      .set('token', token);

    expect(spyId).toHaveBeenCalledWith(mockUser.id);
    expect(spyFilter).toHaveBeenCalledWith({
      role: 'mentor',
      id: mockMentor.id,
    });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      `Mentor with id ${mockMentor.id} not found`,
    );
  });

  it.only('throws a 422 if user id is invalid', async () => {
    const spyId = jest.spyOn(User, 'get_by_id');

    const token = jwt.sign(mockUser, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    spyId.mockImplementationOnce(() => mockUser);

    const response = await request(app)
      .get('/api/v1/mentors/invalidId')
      .set('token', token);

    expect(spyId).toHaveBeenCalledWith(mockUser.id);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBeDefined();
  });
});
