const { BaseModel } = require("./index");

class Session extends BaseModel {
  id;
  mentorId;
  menteeId;
  questions;
  menteeEmail;
  status = "pending"; // Can be pending, accepted or rejected

  constructor(param_obj) {
    // Used initialization method to avoid field declaration overwriting instance properties

    super();
    this.initialize_data(param_obj);
  }

  static async create(params) {
    const new_session = await super.create(params, this);

    return new_session;
  }

  static get_by_id(id) {
    return this.filter_by({ id: id })[0];
  }
  static filter_by(filter_obj) {
    return super.filter_by(filter_obj, this);
  }

  static get_all() {
    return super.filter_by({}, this);
  }

  to_json() {
    const new_obj = super.to_json();

    new_obj["sessionId"] = new_obj["id"];
    delete new_obj["id"];
    return new_obj;
  }
}
module.exports = Session;
