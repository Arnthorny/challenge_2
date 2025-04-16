const v1Router = require('express').Router();
const sessionRoutes = require('./session.route');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

v1Router.use('/v1', sessionRoutes);
v1Router.use('/v1', userRoutes);
v1Router.use('/v1', authRoutes);

module.exports = v1Router;
