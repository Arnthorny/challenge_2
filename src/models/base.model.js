const storage = require('./file_storage');

class BaseModel {
  /**
   *
   * @param {object} params
   * @returns {BaseModel}
   */
  initialize_data(params) {
    Object.entries(params).forEach(([key, value]) => {
      this[key] = value;
    });
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  async save() {
    await storage.save();
  }

  /**
   *
   * @param {object} params
   * @param {*} Cls Class Constructor/Name
   * @returns {Promise<BaseModel>}
   */
  static async create(params, Cls) {
    const newData = new Cls(params);
    const newDataId = storage.get_next_seq(`${Cls.name}_id_seq`);
    if (newDataId === undefined) throw Error('Model pk sequence not found');

    newData.id = newDataId;

    storage.new(newData);
    await storage.save();

    return newData;
  }

  /**
   *
   * @param {object} filter_obj
   * @param {class} Cls
   * @returns Array
   */
  static filter_by(filterObj, Cls) {
    const allObjs = storage.get_all_objects();
    const modelObjs = Object.keys(allObjs)
      .filter((key) => key.startsWith(`${Cls.name}.`))
      .map((key) => allObjs[key]);

    const filteredObjects = modelObjs.filter((obj) => {
      let matches = true;
      Object.entries(filterObj).forEach(([key, value]) => {
        matches = matches && obj[key] === value;
      });
      return matches;
    });
    return filteredObjects;
  }

  to_obj() {
    const newObj = {};
    Object.entries(this).forEach(([key, value]) => {
      if (value !== undefined) newObj[key] = value;
    });

    /* eslint-disable no-underscore-dangle */
    newObj.__class__ = this.constructor.name;
    return newObj;
  }

  to_json() {
    const obj = this.to_obj();

    delete obj.__class__;
    return obj;
  }

  async delete() {
    const allObjs = storage.get_all_objects();
    const objId = `${this.constructor.name}.${this.id}`;

    delete allObjs[objId];

    await storage.reload();
  }
}

module.exports = BaseModel;
