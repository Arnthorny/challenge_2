const { BaseModel } = require('./index');

class Session extends BaseModel {
  id;

  mentorId;

  menteeId;

  questions;

  menteeEmail;

  status = 'pending'; // Can be pending, accepted or rejected

  constructor(paramObj) {
    // Used initialization method to avoid field declaration overwriting instance properties

    super();
    this.initialize_data(paramObj);
  }

  static async create(params) {
    const newSession = await super.create(params, this);

    return newSession;
  }

  /**
   *
   * @param {Number} id
   * @returns {Session | undefined}
   */
  static get_by_id(id) {
    return this.filter_by({ id })[0];
  }

  static filter_by(filterObj) {
    return super.filter_by(filterObj, this);
  }

  static get_all() {
    return super.filter_by({}, this);
  }

  to_json() {
    const newObj = super.to_json();

    newObj.sessionId = newObj.id;
    delete newObj.id;
    return newObj;
  }
}
module.exports = Session;
