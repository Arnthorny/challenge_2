const httpStatus = require("http-status");
const Joi = require("joi");

const userRouter = express.Router();
const bcrypt = require("bcryptjs");

const { User } = require("../models");
const {
  error_response_json: error_res,
  response_json,
} = require("../utils/resp_handling");
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
// const catchAsync = require('../utils/catchAsync');
// const { userService } = require('../services');

const joi_regular_str = Joi.string().trim().required().max(50).min(1);

const signupSchema = Joi.object({
  firstName: joi_regular_str,
  lastName: joi_regular_str,
  password: joi_regular_str,
  email: Joi.string().email(),
  address: Joi.string().trim().required().max(200).min(1),
  bio: Joi.string().trim().required().min(5),
  occupation: joi_regular_str,
  expertise: Joi.string().trim().required().max(100).min(1),
});

const loginSchema = Joi.object({
  email: Joi.string().email(),
  password: joi_regular_str,
});

class UserController {
  static genToken(param) {}

  static async createUser(req, res, next) {
    try {
      const validation = signupSchema.validate(req.body);

      if (validation.error)
        res
          .status(422)
          .json(error_res(422, validation.error.details[0].message));

      const { password, ...bodyDup } = validation.value;
      bodyDup["password"] = bcrypt.hashSync(password, 15);

      const user = await User.create(bodyDup);
      const token = this.genToken(user.to_json());

      const res_obj = {
        token,
        message: "User created successfully",
      };

      res
        .status(201)
        .json(response_json(201, "User created successfully", res_obj));
    } catch (err) {
      next(err);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const validation = loginSchema.validate(req.body);

      if (validation.error)
        res
          .status(422)
          .json(error_res(422, validation.error.details[0].message));

      const { email, password } = validation.value;

      const user = User.filter_by({ email })[0];

      if (!user || !bcrypt.compareSync(password, user.password))
        res.status(400).json(error_res(400, "Invalid username or password"));
      else {
        res.status(200).json({
          message: "Login successful",
          data: {
            username: user.username,
            _id: user._id,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const all_instances = await User.get_all();
      res.send(result);
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.userId);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }
      res.send(user);
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await userService.updateUserById(
        req.params.userId,
        req.body
      );
      res.send(user);
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res) {
    try {
      await userService.deleteUserById(req.params.userId);
      res.status(httpStatus.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
}
module.exports = UserController;
