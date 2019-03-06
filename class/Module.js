const errors = require('./errors');
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

  async generateErrorMessage(chan, user, error, embed) {
    console.error(error);

    if (!embed) embed = new Discord.RichEmbed()
    .setTitle("Erreur lors de l'exécution de la commande")
    .setAuthor("Second Dawn", user.avatarURL)
    .setColor("#c0392b")
    .setFooter("Commande exécutée par " + user.username, message.author.avatarURL)
    .setTimestamp();

    embed.setDescription(error.code && errors[error.code] ? errors[error.code] : error.toString());
    await chan.send(embed);
  }

  getDependencies() {
    return [];
  }
}

module.exports = Module;
