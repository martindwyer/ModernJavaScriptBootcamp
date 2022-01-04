const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);
class UserRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating repository requires filename");
    }

    this.filename = filename;

    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    const data = JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );

    return data;
  }

  async create(attrs) {
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const derivedKey = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${derivedKey.toString("hex")}.${salt}`,
    };

    records.push(record);

    await this.writeAll(records);

    return record;
  }

  async comparePasswords(saved, supplied) {
    const [hashed, salt] = saved.split(".");
    const derivedKey = await scrypt(supplied, salt, 64);
    return hashed === derivedKey.toString("hex");
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async update(id, obj) {
    const records = await this.getAll();
    const user = records.find((record) => record.id === id);
    if (!user) {
      throw new Error(`Record with id of ${id} not found`);
    }
    Object.assign(user, obj);
    await this.writeAll(records);
  }

  async getOneByEmail(email) {
    const records = await this.getAll();

    for (let record of records) {
      if (record.email === email) {
        return record;
        break;
      }
    }
  }

  // This needs more testing - failed in production
  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] != filters[key]) {
          let found = false;
          break;
        }
      }
      if (found) {
        return record;
      }
    }
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id != id);
    await this.writeAll(filteredRecords);
  }
}

module.exports = new UserRepository("users.json");
