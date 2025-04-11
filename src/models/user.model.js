const { BaseModel } = require("./index");

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
  role = "user"; // Can be user, mentor or admin
  static excluded_fields = ["role", "password"];

  constructor(param_obj) {
    // Used initialization method to avoid field declaration overwriting instance properties
    super();
    this.initialize_data(param_obj);
  }

  static get_by_id(id) {
    return this.filter_by({ id: id })[0];
  }

  static filter_by(filter_obj) {
    return super.filter_by(filter_obj, this);
  }

  static get_all() {
    return this.filter_by({}, this);
  }

  static async create(params) {
    const email_unique = this.filter_by({ email: params.email }).length === 0;
    if (!email_unique) throw Error("This email already exists");

    const new_user = await super.create(params, this);

    return new_user;
  }
  to_json() {
    const new_obj = super.to_json();

    for (const field in this.constructor.excluded_fields) {
      delete new_obj[field];
    }
    return new_obj;
  }
}

module.exports = User;
