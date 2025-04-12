const { basename } = require('path');
const { Session, User, Review } = require('../models');
const {
  createSessionSchema,
  sessionIdParamSchema,
  reviewSessionSchema,
} = require('../schemas/validation.schema');

const {
  successRes: successResJson,
  ApiError,
} = require('../utils/resp_handling');

class SessionController {
  static async createSession(req, res, next) {
    try {
      const validation = createSessionSchema.validate(req.body);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }

      const newSessObj = { ...validation.value };
      const { mentorId } = newSessObj;

      const mentor = User.filter_by({ role: 'mentor', id: mentorId })[0];
      if (mentor === undefined) {
        throw new ApiError(404, `Mentor with id: ${mentorId} not found`);
      }

      newSessObj.mentorId = mentorId;
      newSessObj.menteeId = req.user.id;
      newSessObj.menteeEmail = req.user.email;

      const sess = await Session.create(newSessObj);

      res.status(200).json(successResJson(200, undefined, sess.to_json()));
    } catch (err) {
      next(err);
    }
  }

  static async rejectOrAcceptSession(req, res, next) {
    try {
      if (req.user.role === 'user') {
        throw new ApiError(403, 'Mentor only request');
      }

      const validation = sessionIdParamSchema.validate(req.params);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }

      const { sessionId } = validation.value;

      const sess = Session.get_by_id(sessionId);
      if (sess === undefined) {
        throw new ApiError(404, `Session with id: ${sessionId} not found`);
      }

      const status = basename(req.path) === 'accept' ? 'accepted' : 'rejected';

      sess.status = status;
      await sess.save();

      res.status(200).json(successResJson(200, undefined, sess.to_json()));
    } catch (err) {
      next(err);
    }
  }

  static async getAllSessions(req, res, next) {
    try {
      let allSessions;
      const isUser = req.user.role === 'user';

      if (isUser) allSessions = Session.filter_by({ menteeId: req.user.id });
      else allSessions = Session.filter_by({ mentorId: req.user.id });

      allSessions = allSessions.map((sess) => sess.to_json());

      res.status(200).json(successResJson(200, undefined, allSessions));
    } catch (err) {
      next(err);
    }
  }

  static async reviewSession(req, res, next) {
    try {
      const validationParam = sessionIdParamSchema.validate(req.params);
      if (validationParam.error) {
        throw new ApiError(422, validationParam.error.details[0].message);
      }

      const validationBody = reviewSessionSchema.validate(req.body);
      if (validationBody.error) {
        throw new ApiError(422, validationBody.error.details[0].message);
      }

      const { sessionId } = validationParam.value;

      const sess = Session.get_by_id(sessionId);
      if (sess === undefined) {
        throw new ApiError(404, `Session with id: ${sessionId} not found`);
      }
      // Only mentee for given session can review session
      if (sess.menteeId !== req.user.id) {
        throw new ApiError(403, 'Forbidden');
      }
      const reviewed = Review.filter_by({ sessionId })[0] !== undefined;

      if (reviewed) {
        throw new ApiError(400, `Session ${sessionId} already reviewed`);
      }

      const newReviewObj = { ...validationBody.value };
      newReviewObj.sessionId = sess.id;
      newReviewObj.mentorId = sess.mentorId;
      newReviewObj.menteeId = req.user.id;
      newReviewObj.menteeFullName = `${req.user.firstName} ${req.user.lastName}`;

      const rev = await Review.create(newReviewObj);

      res.status(200).json(successResJson(200, undefined, rev.to_json()));
    } catch (err) {
      next(err);
    }
  }

  static async deleteSessionReview(req, res, next) {
    try {
      const validationParam = sessionIdParamSchema.validate(req.params);
      if (validationParam.error) {
        throw new ApiError(422, validationParam.error.details[0].message);
      }

      const { sessionId } = validationParam.value;

      const sess = Session.get_by_id(sessionId);
      if (sess === undefined) {
        throw new ApiError(404, `Session with id: ${sessionId} not found`);
      }

      if (req.user.role === 'admin') {
        throw new ApiError(403, 'Admin only request');
      }

      const resData = { message: 'Review successfully deleted' };

      res.status(200).json(successResJson(200, undefined, resData));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SessionController;
