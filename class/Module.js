class Module {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.storage = new (require('node-storage'))(require('path').join(__dirname, '../data/' + id + '.json'));
  }

  async start() {
    console.log(`[${this.name}] - Starting`);
    this.started = true;
  }

  async stop() {
    console.log(`[${this.name}] - Shutting down`);
    this.started = false;

    return Promise.resolve();
  }

  getDependencies() {
    return [];
  }
}

module.exports = Module;
