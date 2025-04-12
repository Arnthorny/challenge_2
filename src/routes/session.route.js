const express = require('express');

const router = express.Router();

const Auth = require('../middlewares/authentication_token');
const SessionController = require('../controllers/session.controller');

router
  .route('/sessions')
  .post(Auth.tokenAuthentication, SessionController.createSession)
  .get(Auth.tokenAuthentication, SessionController.getAllSessions);

router.patch(
  '/sessions/:sessionId/accept',
  Auth.tokenAuthentication,
  SessionController.rejectOrAcceptSession,
);
router.patch(
  '/sessions/:sessionId/reject',
  Auth.tokenAuthentication,
  SessionController.rejectOrAcceptSession,
);

router
  .route('/sessions/:sessionId/review')
  .post(Auth.tokenAuthentication, SessionController.reviewSession)
  .delete(Auth.tokenAuthentication, SessionController.deleteSessionReview);

module.exports = router;
