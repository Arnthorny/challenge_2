const { BaseModel } = require('./index');

class Review extends BaseModel {
  id;

  sessionId;

  mentorId;

  menteeId;

  menteeFullName;

  score; // Scale of 1 - 5

  remark;

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
   * @returns {Review | undefined}
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

    delete newObj.id;
    return newObj;
  }
}
module.exports = Review;
