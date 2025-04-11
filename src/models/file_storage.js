const fsPromises = require("fs").promises;
const path = require("path");

class FileStorage {
  // Represents a data storage class
  __file_name = "data_store.json";
  __file_path = path.join(process.cwd(), this.__file_name);

  __objects = { Session_id_seq: 0, User_id_seq: 0 };

  constructor() {}

  new(obj) {
    // Sets in __objects the obj with key <obj class name>.id
    const key = `${obj.constructor.name}.${obj.id}`;
    this.__objects[key] = obj;
  }

  /**
   *
   * @param {string} key
   * @returns string | object
   */
  get_by_key(key) {
    return this.__objects[key];
  }

  get_all_objects() {
    return this.__objects;
  }

  get_next_seq(seq_name) {
    if (this.__objects[seq_name] === undefined) return;
    this.__objects[seq_name] = this.__objects[seq_name] + 1;

    return this.__objects[seq_name];
  }

  async save() {
    //Serializes __objects to the JSON file
    const objects_dict = {};

    for (const [key, value] of Object.entries(this.__objects)) {
      if (typeof value === "object") objects_dict[key] = value.to_obj();
      else objects_dict[key] = value;
    }

    try {
      await fsPromises.writeFile(
        this.__file_path,
        JSON.stringify(objects_dict)
      );
    } catch (err) {
      console.log(err);
    }
  }

  async close() {
    await this.save();
    delete this.__objects;
  }

  async reload() {
    const { ALL_MODELS } = require("./index");

    //Deserializes JSON file to __objects
    let new_obj = {};

    try {
      const fileStr = await fsPromises.readFile(this.__file_path, {
        encoding: "utf-8",
      });
      new_obj = JSON.parse(fileStr);

      for (const [key, value] of Object.entries(new_obj)) {
        if (value["__class__"] !== undefined)
          this.__objects[key] = new ALL_MODELS[value["__class__"]](value);
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        await fsPromises.writeFile(
          this.__file_path,
          JSON.stringify(this.__objects)
        );
      } else {
        console.log(err);
      }
    }
  }
}

const storage = new FileStorage();

module.exports = storage;
