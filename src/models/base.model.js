const storage = require("./file_storage");

class BaseModel {
  initialize_data(params) {
    for (const [key, value] of Object.entries(params)) {
      this[key] = value;
    }
    // return this;
  }

  async save() {
    await storage.save();
  }

  /**
   *
   * @param {*} params
   * @param {*} cls
   * @returns
   */
  static async create(params, cls) {
    const new_data = new cls(params);
    const new_data_id = storage.get_next_seq(`${cls.name}_id_seq`);
    if (new_data_id === undefined) throw Error("Model pk sequence not found");

    new_data.id = new_data_id;

    storage.new(new_data);
    await storage.save();

    return new_data;
  }

  /**
   *
   * @param {object} filter_obj
   * @param {class} cls
   * @returns Array
   */
  static filter_by(filter_obj, cls) {
    const all_objs = storage.get_all_objects();
    const model_objs = Object.keys(all_objs)
      .filter((key) => key.startsWith(`${cls.name}.`))
      .map((key) => all_objs[key]);

    const filtered_objs = model_objs.filter((obj) => {
      let matches = true;

      for (const [key, value] of Object.entries(filter_obj)) {
        matches = matches && obj[key] === value;
      }
      return matches;
    });
    return filtered_objs;
  }

  to_obj() {
    const new_obj = {};
    for (const [key, value] of Object.entries(this)) {
      if (value !== undefined) new_obj[key] = value;
    }
    new_obj["__class__"] = this.constructor.name;
    return new_obj;
  }

  to_json() {
    const obj = this.to_obj();

    delete obj.__class__;
    return obj;
  }

  async delete() {
    const all_objs = storage.get_all_objects();
    const obj_id = `${this.constructor.name}.${this.id}`;

    delete all_objs[obj_id];

    await storage.reload();
  }
}

module.exports = BaseModel;
