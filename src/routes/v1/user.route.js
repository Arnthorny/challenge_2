const router = require('express').Router();

const Auth = require('../../middlewares/authentication_token');
const UserController = require('../../controllers/user.controller');

router.patch(
  '/user/:userId',
  Auth.tokenAuthentication,
  UserController.updateUser.bind(UserController),
);
router.get('/mentors', UserController.getAllMentors.bind(UserController));
router.get(
  '/mentors/:mentorId',
  UserController.getSpecificMentor.bind(UserController),
);

module.exports = router;
/**
 * @swagger
 * /api/v1/user/{userId}:
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
 *       401:
 *         description: Unauthorized request
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
 * /api/v1/mentors/{mentorId}:
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
 * /api/v1/mentors:
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
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 */
