require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {
  loginSchema,
  signupSchema,
  userIdParamSchema,
  mentorIdParamSchema,
} = require('../schemas/validation.schema');
const { User } = require('../models');

const {
  successRes: successResJson,
  ApiError,
} = require('../utils/resp_handling');

class UserController {
  static genToken(payload) {
    const newtoken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });
    return newtoken;
  }

  static async createUser(req, res, next) {
    try {
      const validation = signupSchema.validate(req.body);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }

      const { password, ...bodyDup } = validation.value;
      bodyDup.password = bcrypt.hashSync(password, 15);

      const user = await User.create(bodyDup);
      const token = this.genToken(user.to_json());

      const resObj = {
        token,
        message: 'User created successfully',
      };

      res
        .status(201)
        .json(successResJson(201, 'User created successfully', resObj));
    } catch (err) {
      next(err);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const validation = loginSchema.validate(req.body);

      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }
      const { email, password } = validation.value;

      const user = User.filter_by({ email })[0];

      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new ApiError(400, 'Invalid username or password');
      } else {
        const token = this.genToken(user.to_json());
        const resObj = { token };

        res
          .status(200)
          .json(successResJson(200, 'User is successfully logged in', resObj));
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw new ApiError(403, 'Admin only request');
      }
      const validation = userIdParamSchema.validate(req.params);
      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }
      const { userId } = validation.value;
      const userToUpdate = User.get_by_id(userId);

      if (userToUpdate === undefined) {
        throw new ApiError(404, `User with id ${userId} not found`);
      }
      userToUpdate.role = 'mentor';
      await userToUpdate.save();

      const data = { message: 'User account changed to mentor' };
      res.status(200).json(successResJson(200, undefined, data));
    } catch (err) {
      next(err);
    }
  }

  static async getAllMentors(req, res, next) {
    try {
      let allMentors = User.filter_by({ role: 'mentor' });
      allMentors = allMentors.map((mentor) => mentor.to_json());

      res.status(200).json(successResJson(200, undefined, allMentors));
    } catch (err) {
      next(err);
    }
  }

  static async getSpecificMentor(req, res, next) {
    try {
      const validation = mentorIdParamSchema.validate(req.params);
      if (validation.error) {
        throw new ApiError(422, validation.error.details[0].message);
      }
      const { mentorId } = validation.value;

      const mentor = User.filter_by({ role: 'mentor', id: mentorId })[0];

      if (mentor === undefined) {
        throw new ApiError(404, `Mentor with id ${mentorId} not found`);
      }
      res.status(200).json(successResJson(200, undefined, mentor.to_json()));
    } catch (err) {
      next(err);
    }
  }
}
module.exports = UserController;
