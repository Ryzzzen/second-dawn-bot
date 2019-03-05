const Module = require('../class/Module');
const Discord = require('discord.js');

const axios = require('axios');
const moment = require('moment');

class ApexModule extends Module {
  constructor() {
    super('apex', 'Apex Legends: Companion Module');
  }

  async start(Apex) {
    super.start();

    this.commands = [{
      prefixes: ['apex-link', 'a-link', 'apexlink'],
      handler: async (message, args) => {
        if (!args[0]) {
          const embed = new Discord.RichEmbed()
          .setTitle("Erreur")
          .setAuthor("Apex Companion", 'https://purepng.com/public/uploads/large/apex-legends-icon-high-resolution-scy.png')
          .setColor("#f1c40f")
          .setDescription("Commande: !apex-link <Nom du compte> [Plateforme]")
          .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
          .setTimestamp();

          return message.channel.send(embed);
        }

        try {
          let platform = args[1] || 'pc', name = encodeURIComponent(args[0]).toLowerCase();
          let search = (await axios.get('https://apextab.com/api/search.php?platform=pc&search=' + name)).data.results;

          this.storage.put('u_' + message.author.id, search[0].aid);

          const embed = new Discord.RichEmbed()
          .setTitle("C'est fait!")
          .setAuthor("Apex Companion", 'https://purepng.com/public/uploads/large/apex-legends-icon-high-resolution-scy.png')
          .setColor("#00b894")
          .setTimestamp()
          .setDescription('Utilisateur relié: **' + search[0].name + '**')
          .setThumbnail(search[0].avatar)
          .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
          .addField('Niveau', search[0].level, true)
          .addField('Plateforme', search[0].platform.toUpperCase(), true);

          return message.channel.send(embed);
        }
        catch(err) {
          console.error(err);

          const embed = new Discord.RichEmbed()
          .setTitle("Erreur")
          .setAuthor("Apex Companion", 'https://purepng.com/public/uploads/large/apex-legends-icon-high-resolution-scy.png')
          .setColor("#f1c40f")
          .setDescription(err)
          .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
          .setTimestamp();

          return message.channel.send(embed);
        }
      }
    }, {
      prefixes: ['apex-info', 'a-info', 'apexinfo'],
      handler: async (message, args) => {
        if (!args[0] && this.storage.get('u_' + message.author.id) !== null) {
          let search = (await axios.get('https://apextab.com/api/player.php?aid=' + this.storage.get('u_' + message.author.id))).data;

          if (search.error && search.error === 'Player not found!') {
            const embed = new Discord.RichEmbed()
            .setTitle("Erreur")
            .setAuthor("Apex Companion", 'https://purepng.com/public/uploads/large/apex-legends-icon-high-resolution-scy.png')
            .setColor("#f1c40f")
            .setDescription("Impossible de vous retrouver! Réessayez avec la commande `!apex-link`")
            .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
            .setTimestamp();

            return message.channel.send(embed);
          }

          let date = new Date(search.utime * 1000);

          const embed = new Discord.RichEmbed()
          .setTitle('Résultats: ' + search.name + ' (' + search.platform + ')')
          .setAuthor("Apex Companion", 'https://purepng.com/public/uploads/large/apex-legends-icon-high-resolution-scy.png')
          .setColor("#00b894")
          .setDescription(`*Statistiques actualisées ${moment(date).fromNow()}.*\nLes statistiques dépendent des trackers sur votre profil. Si vous enlevez le tracker de kills, ils ne seront plus affichés ici.`)
          .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
          .setTimestamp()
          .setThumbnail(search.avatar)
          .addField('Niveau', search.level, true)
          .addField('Total Kills', search.kills, true)
          .addField('Dernière légende', search.legend ? search.legend : 'inconnu', true)
          .addField('Headshots', search.headshots, true)
          .addField('Parties', search.matches, true)
          .addField('Dégats', search.damage, true)
          .addField('Rang global', '#' + search.globalrank, true)
          .addField('Plateforme', search.platform.toUpperCase(), true);

          return message.channel.send(embed);
        }
        else if (!args[0]) {
          const embed = new Discord.RichEmbed()
          .setTitle("Erreur")
          .setAuthor("Apex Companion", 'https://purepng.com/public/uploads/large/apex-legends-icon-high-resolution-scy.png')
          .setColor("#f1c40f")
          .setDescription("Commande: !apex-info <Nom du compte> [Plateforme]")
          .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
          .setTimestamp();

          return message.channel.send(embed);
        }

        try {
          let platform = args[1] || 'pc', name = encodeURIComponent(args[0]).toLowerCase();
          let search = (await axios.get('https://apextab.com/api/search.php?platform=pc&search=' + name)).data.results;

          const embed = new Discord.RichEmbed()
          .setTitle("Résultats" + search.length === 1 ? ': ' + search[0].name : '')
          .setAuthor("Apex Companion", 'https://purepng.com/public/uploads/large/apex-legends-icon-high-resolution-scy.png')
          .setColor("#00b894")
          .setDescription(`${search.length} utilisateurs trouvés`)
          .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
          .setTimestamp();

          if (!search || search.length === 0)
            embed.setDescription(`Impossible de trouver un utilisateur. Avez-vous bien écrit \`${name}\` (plateforme ${platform.toUpperCase()}) ?`);
          else if (search.length === 1) {
            embed
            .setTitle('Utilisateur trouvé - **' + search[0].name + '**')
            .setDescription('Les statistiques dépendent des trackers sur votre profil. Si vous enlevez le tracker de kills, ils ne seront plus affichés ici.')
            .setThumbnail(search[0].avatar)
            .setFooter('Tape !apex-link ' + search[0].name + ' pour ne plus avoir à taper la commande entièrement')
            .addField('Niveau', search[0].level, true)
            .addField('Total Kills', search[0].kills, true)
            .addField('Dernière légende', search[0].legend ? search[0].legend : 'inconnu', true)
            .addField('Plateforme', search[0].platform.toUpperCase(), true);
          }
          else for (let i = 0; i < search.length; i++)
            embed.addField('**#' + i +  `** - ${search[i].name}`, `**${search[i].kills}** Total Kills${search[i].legend ? ', Dernière légende: **' + search[i].legend + '**' : ''}`);

          return message.channel.send(embed);
        }
        catch(err) {
          console.error(err);

          const embed = new Discord.RichEmbed()
          .setTitle("Erreur")
          .setAuthor("Apex Companion", 'https://purepng.com/public/uploads/large/apex-legends-icon-high-resolution-scy.png')
          .setColor("#f1c40f")
          .setDescription(err)
          .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
          .setTimestamp();

          return message.channel.send(embed);
        }
      }
    }];

    return Promise.resolve();
  }
}

module.exports = ApexModule;
