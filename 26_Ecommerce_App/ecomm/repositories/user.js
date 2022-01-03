const fs = require("fs");
const crypto = require("crypto");

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
    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);
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

  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] != filters[key]) {
          let found = false;
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
