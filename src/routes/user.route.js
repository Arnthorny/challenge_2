const express = require('express');

const router = express.Router();

const Auth = require('../middlewares/authentication_token');
const UserController = require('../controllers/user.controller');

router.post('/auth/signup', UserController.createUser);
router.post('/auth/signin', UserController.loginUser);
router.patch(
  '/user/:userId',
  Auth.tokenAuthentication,
  UserController.updateUser,
);
router.get('/mentors', UserController.getAllMentors);
router.get('/mentors/:mentorId', UserController.getSpecificMentor);

module.exports = router;

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register as user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignupReqBody'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TokenResponseObj'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 */

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Login as user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginReqBody'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "User is successfully logged in"
 *                 data:
 *                   $ref: '#/components/schemas/TokenResponseObjNoMsg'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 */

/**
 * @swagger
 * /user/:userId:
 *   patch:
 *     summary: Change user to a mentor.
 *     tags: [Admin]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Auth token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Id of user to update
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/BasicMessageObj'
 *       403:
 *         description: Forbidden request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 */

/**
 * @swagger
 * /mentors/:mentorId:
 *   get:
 *     summary: Get a specific mentor.
 *     tags: [Mentors]
 *     parameters:
 *       - in: path
 *         name: mentorId
 *         required: true
 *         description: Id of mentor to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Retrieval successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/MentorSchema'
 *       404:
 *         description: Mentor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 */

/**
 * @swagger
 * /mentors:
 *   get:
 *     summary: Get all mentors.
 *     tags: [Mentors]
 *     responses:
 *       200:
 *         description: Retrieval successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MentorSchema'
 *       404:
 *         description: Mentor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 */
