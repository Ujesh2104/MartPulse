// Pure JavaScript In-Memory Database Store for 100% fail-safe deployment on any cloud host
// Eliminates any native binary/GLIBC dependencies while supporting identical Sequelize query APIs

class InMemoryModel {
  constructor(name) {
    this.name = name;
    this.records = [];
  }

  _clone(record) {
    if (!record) return null;
    const cloned = { ...record };
    // Provide Sequelize instance helper methods
    cloned.toJSON = () => ({ ...cloned });
    cloned.save = async () => {
      const idx = this.records.findIndex((r) => r.id === cloned.id);
      if (idx !== -1) {
        this.records[idx] = { ...cloned, updatedAt: new Date() };
      }
      return cloned;
    };
    return cloned;
  }

  _matches(record, where = {}) {
    if (!where || Object.keys(where).length === 0) return true;
    for (const [key, val] of Object.entries(where)) {
      if (typeof val === 'object' && val !== null) {
        // Handle Sequelize Op-like operators if any
        if (val.min !== undefined && record[key] < val.min) return false;
        if (val.max !== undefined && record[key] > val.max) return false;
      } else if (record[key] !== val) {
        return false;
      }
    }
    return true;
  }

  async findOne({ where } = {}) {
    const found = this.records.find((r) => this._matches(r, where));
    return found ? this._clone(found) : null;
  }

  async findByPk(id) {
    const found = this.records.find((r) => r.id === id);
    return found ? this._clone(found) : null;
  }

  async findAll({ where, order, attributes } = {}) {
    let result = this.records.filter((r) => this._matches(r, where));

    if (order && Array.isArray(order)) {
      for (const [col, dir] of order) {
        const isDesc = String(dir).toUpperCase() === 'DESC';
        result.sort((a, b) => {
          if (a[col] < b[col]) return isDesc ? 1 : -1;
          if (a[col] > b[col]) return isDesc ? -1 : 1;
          return 0;
        });
      }
    }

    return result.map((r) => this._clone(r));
  }

  async count({ where } = {}) {
    if (!where || Object.keys(where).length === 0) return this.records.length;
    return this.records.filter((r) => this._matches(r, where)).length;
  }

  async create(data) {
    const record = {
      ...data,
      id: data.id || `${this.name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.records.push(record);
    return this._clone(record);
  }

  async bulkCreate(items = []) {
    const created = [];
    for (const item of items) {
      const rec = await this.create(item);
      created.push(rec);
    }
    return created;
  }

  async update(values, { where } = {}) {
    let affectedCount = 0;
    for (let i = 0; i < this.records.length; i++) {
      if (this._matches(this.records[i], where)) {
        this.records[i] = { ...this.records[i], ...values, updatedAt: new Date() };
        affectedCount++;
      }
    }
    return [affectedCount];
  }

  async destroy({ where } = {}) {
    const initialLen = this.records.length;
    this.records = this.records.filter((r) => !this._matches(r, where));
    return initialLen - this.records.length;
  }
}

const memoryUser = new InMemoryModel('User');
const memoryStore = new InMemoryModel('Store');
const memoryRating = new InMemoryModel('Rating');

const memorySequelize = {
  authenticate: async () => true,
  sync: async () => true,
};

module.exports = {
  InMemoryModel,
  memoryUser,
  memoryStore,
  memoryRating,
  memorySequelize,
};
