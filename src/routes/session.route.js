const express = require('express');

const router = express.Router();

const Auth = require('../middlewares/authentication_token');
const SessionController = require('../controllers/session.controller');

router
  .route('/sessions')
  .post(
    Auth.tokenAuthentication,
    SessionController.createSession.bind(SessionController),
  )
  .get(
    Auth.tokenAuthentication,
    SessionController.getAllSessions.bind(SessionController),
  );

router.patch(
  '/sessions/:sessionId/accept',
  Auth.tokenAuthentication,
  SessionController.rejectOrAcceptSession.bind(SessionController),
);
router.patch(
  '/sessions/:sessionId/reject',
  Auth.tokenAuthentication,
  SessionController.rejectOrAcceptSession.bind(SessionController),
);

router
  .route('/sessions/:sessionId/review')
  .post(
    Auth.tokenAuthentication,
    SessionController.reviewSession.bind(SessionController),
  )
  .delete(
    Auth.tokenAuthentication,
    SessionController.deleteSessionReview.bind(SessionController),
  );

module.exports = router;

/**
 * @swagger
 * /api/v1/sessions:
 *   post:
 *     summary: Register a session
 *     tags: [Session]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Auth token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionReqBody'
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
 *                 data:
 *                   $ref: '#/components/schemas/SessionRespSchema'
 *       400:
 *         description: Bad request
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
 * /api/v1/sessions/{sessionId}/accept:
 *   patch:
 *     summary: Accept a mentorship session request.
 *     tags: [Session]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Auth token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: Id of session to be accepted
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
 *                   $ref: '#/components/schemas/SessionRespSchema'
 *       403:
 *         description: Forbidden request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       404:
 *         description: Session not found
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
 * /api/v1/sessions/{sessionId}/reject:
 *   patch:
 *     summary: Reject a mentorship session request.
 *     tags: [Session]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Auth token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: Id of session to be rejected
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
 *                   $ref: '#/components/schemas/SessionRespSchema'
 *       403:
 *         description: Forbidden request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       404:
 *         description: Session not found
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
 * /api/v1/sessions:
 *   get:
 *     summary: Get all sessions.
 *     tags: [Session]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Auth token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     responses:
 *       200:
 *         description: "For mentee, return array of sessions created by them.\n
 *                       For mentor, return array of sessions assigned them."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SessionRespSchema'
 *       401:
 *         description: Unauthorized request
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
 * /api/v1/sessions/{sessionId}/review:
 *   post:
 *     summary: Review a mentorship session.
 *     tags: [Session]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: Auth token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: Id of session to be reviewed
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionReviewBody'
 *     responses:
 *       200:
 *         description: Review successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/SessionReviewRespSchema'
 *       400:
 *         description: Bad request
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
 *       403:
 *         description: Forbidden request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       404:
 *         description: Session not found
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
 * /api/v1/sessions/{sessionId}/review:
 *   delete:
 *     summary: Delete a mentorship session review.
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
 *         name: sessionId
 *         required: true
 *         description: Id of review to be deleted
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
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Review successfully deleted"
 *       401:
 *         description: Unauthorized request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       403:
 *         description: Forbidden request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericErrorObj'
 *       404:
 *         description: Session not found
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
