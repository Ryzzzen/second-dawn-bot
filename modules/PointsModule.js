const Module = require('../class/Module');
const Discord = require('discord.js');

class PointsModule extends Module {
  constructor() {
    super('xp', 'Points');
  }

  async start(Dawn) {
    super.start();

    this.commands = [{
      prefixes: ['xp', 'points'],
      help: 'Affiche votre profil de points sur le serveur',
      example: '!xp [@Utilisateur]',
      handler: (message, args) => {
        let id = message.mentions.users.first() || message.author.id;

        if (!this.storage.get('u_' + id))
          this.storage.put('u_' + id, { points: 1, level: 1 });

        let userStorage = this.storage.get('u_' + id);
        let xpRequiredForNextLevel = Math.round(Math.pow(userStorage.level / 0.23, 2)) - userStorage.points;

        const embed = new Discord.RichEmbed()
        .setTitle('Expérience: profil de ' + message.author.username)
        .setColor("#2ecc71")
        .setDescription(`${message.author.username} est actuellement niveau **${userStorage.level}**, pour un total de **${userStorage.points}** points.\nIl ne manque plus que **${xpRequiredForNextLevel}** points pour passer niveau **${userStorage.level + 1}**.`)
        .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
        .setThumbnail(message.author.avatarURL)
        .setTimestamp();

        message.channel.send(embed);
      }
    }];
  }

  onMessageEvent(Dawn, message) {
    if (message.author.bot) return;
    this.handleEvent(message.author, message.channel, Math.round(message.cleanContent.length * 0.06) > 1 ? Math.round(message.cleanContent.length * 0.06) : 1);
  }

  handleEvent(user, channel, points = 1, limit = 20) {
    if (limit < points) points = limit;
    let userStorage;

    if (!this.storage.get('u_' + user.id))
      userStorage = { points, level: 1 };
    else
      userStorage = { points: this.storage.get('u_' + user.id).points + points, level: this.storage.get('u_' + user.id).level };

    let level = Math.round(0.23 * Math.sqrt(userStorage.points));

    if(userStorage.level < level) {
      this.storage.put('u_' + user.id, { points: userStorage.points, level });

      const embed = new Discord.RichEmbed()
      .setTitle("Evènement: **Nouveau niveau**")
      .setColor("#2ecc71")
      .setDescription(user.username + ' est passé niveau **' + level + '** avec un total de **' + userStorage.points + '** points')
      .setFooter("Evènement déclenché par " + user.username)
      .setThumbnail(user.avatarURL)
      .setTimestamp();

      channel.send(embed).then(m => m.delete(8000));
    }
    else this.storage.put('u_' + user.id + '.points', userStorage.points);
  }

  async stop() {
    super.stop();
  }
}

module.exports = PointsModule;
