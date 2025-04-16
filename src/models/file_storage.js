const fsPromises = require('fs').promises;
const path = require('path');

class FileStorage {
  // Represents a data storage class
  #fileName = '.data_store.json';

  #filePath = path.join(process.cwd(), this.#fileName);

  #objects = { Session_id_seq: 0, User_id_seq: 0, Review_id_seq: 0 };

  new(obj) {
    // Sets in #objects the obj with key <obj class name>.id
    const key = `${obj.constructor.name}.${obj.id}`;
    this.#objects[key] = obj;
  }

  /**
   *
   * @param {string} key
   * @returns {object | undefined}
   */
  get_by_key(key) {
    return this.#objects[key];
  }

  /**
   *
   * @returns {BaseModel[]}
   */
  get_all_objects() {
    return this.#objects;
  }

  /**
   *
   * @param {string} seqName
   * @returns {Number|undefined}
   */
  get_next_seq(seqName) {
    if (this.#objects[seqName] === undefined) return undefined;
    this.#objects[seqName] += 1;

    return this.#objects[seqName];
  }

  async save() {
    // Serializes #objects to the JSON file
    const objectsDict = {};

    Object.entries(this.#objects).forEach(([key, value]) => {
      if (typeof value === 'object') objectsDict[key] = value.to_obj();
      else objectsDict[key] = value;
    });

    try {
      await fsPromises.writeFile(this.#filePath, JSON.stringify(objectsDict));
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
    }
  }

  async close() {
    await this.save();
  }

  async reload() {
    // eslint-disable-next-line global-require
    const { ALL_MODELS } = require('./index');

    // Deserializes JSON file to #objects
    let newObj = {};

    try {
      const fileStr = await fsPromises.readFile(this.#filePath, {
        encoding: 'utf-8',
      });
      newObj = JSON.parse(fileStr);
      Object.entries(newObj).forEach(([key, value]) => {
        /* eslint-disable no-underscore-dangle */
        if (value.__class__ !== undefined) {
          this.#objects[key] = new ALL_MODELS[value.__class__](value);
        }
      });
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fsPromises.writeFile(
          this.#filePath,
          JSON.stringify(this.#objects),
        );
      } else {
        console.log(err);
      }
    }
  }
}

const storage = new FileStorage();

module.exports = storage;
