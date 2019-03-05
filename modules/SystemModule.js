const Module = require('../class/Module');
class SystemModule extends Module {
  constructor() {
    super('sys', 'System');
  }

  async start(Dawn) {
    super.start();

    this.commands = [{
      prefixes: ['shutdown', 'stop', 'quit'],
      permissions: 2,
      handler: function(message, args) {
        const embed = new Dawn.Discord.RichEmbed()
        .setTitle("Système")
        .setAuthor("Arrêt en cours")
        .setColor("#c0392b")
        .setDescription("Le bot s'arrête.")
        .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
        .setTimestamp()

        message.channel.send(embed).then(m => m.delete(5000).then(() => Dawn.emit('shutdown', 'USER')));
      }
    }];
  }
}

module.exports = SystemModule;
