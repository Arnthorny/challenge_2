const { BaseModel } = require('./index');
const { ApiError } = require('../utils/resp_handling');

class User extends BaseModel {
  id;

  firstName;

  lastName;

  email;

  password;

  address;

  bio;

  occupation;

  expertise;

  role = 'user'; // Can be user, mentor or admin

  static excluded_fields = ['role'];

  constructor(paramObj) {
    // Used initialization method to avoid field declaration overwriting instance properties
    super();
    this.initialize_data(paramObj);
  }

  /**
   *
   * @param {Number} id
   * @returns {User | undefined}
   */
  static get_by_id(id) {
    return this.filter_by({ id })[0];
  }

  /**
   *
   * @param {Object} filterObj
   * @returns {User[]}
   */
  static filter_by(filterObj) {
    return super.filter_by(filterObj, this);
  }

  /**
   *
   * @returns {User[]}
   */
  static get_all() {
    return this.filter_by({}, this);
  }

  static async create(params) {
    const emailUnique = this.filter_by({ email: params.email }).length === 0;
    if (!emailUnique) throw new ApiError(400, 'Email already exists');

    const newUser = await super.create(params, this);

    return newUser;
  }

  to_json() {
    const newObj = super.to_json();

    this.constructor.excluded_fields.forEach((field) => delete newObj[field]);
    return newObj;
  }
}

module.exports = User;
