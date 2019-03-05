const Module = require('../class/Module');
const Discord = require('discord.js');

class ShowcaseModule extends Module {
  constructor() {
    super('showcase', 'Showcase');
    this.guilds = {};
  }

  async start(Dawn) {
    super.start();

    Dawn.client.guilds.forEach(guild => {
      if (!this.storage.get('guilds.' + guild.id + '.channel')) ;
      this.guilds[guild.id] = setInterval(() => this.showcase(guild.channels.get(this.storage.get('guilds.' + guild.id + '.channel'))), 86400000);
    });

    this.commands = [{
      prefixes: ['showcase'],
      permissions: 1,
      delete: true,
      handler: (message, args) => {
        this.showcase(message.channel);
      }
    },
    {
      prefixes: ['showcase-link',  'showcase-enable'],
      permissions: 2,
      delete: true,
      handler: (message, args) => {
        const embed = new Discord.RichEmbed()
        .setTitle("Galerie active sur ce salon textuel")
        .setAuthor("Showcase", 'https://icons-for-free.com/free-icons/png/512/1622830.png')
        .setColor("#f1c40f")
        .setDescription("Une image y sera affichée toutes les 24h.")
        .setFooter("Commande exécutée par " + message.author.username, message.author.avatarURL)
        .setTimestamp();

        this.storage.put('guilds.' + message.guild.id + '.channel', message.channel.id);
        message.channel.send(embed);
      }
    },
    {
      prefixes: ['showcase-delete', 'showcase-disable', 'showcase-remove', 'showcase-del'],
      permissions: 2,
      delete: true,
      handler: (message, args) => {
        this.storage.remove('guilds.' + message.guild.id + '.channel');
        
        clearInterval(this.guilds[message.guild.id]);
        delete this.guilds[message.guild.id];

        const embed = new Discord.RichEmbed()
        .setTitle("Galerie désactivée")
        .setAuthor("Showcase", 'https://icons-for-free.com/free-icons/png/512/1622830.png')
        .setColor("#f1c40f")
        .setDescription("Plus aucune image n'y sera affichée.")
        .setFooter("Commande exécutée par " + message.author.username, message.author.avatarURL)
        .setTimestamp();

         message.channel.send(embed);
      }
    }
  ];
  }

  showcase(channel) {
    const embed = new Discord.RichEmbed()
    .setAuthor("Showcase", 'https://icons-for-free.com/free-icons/png/512/1622830.png')
    .setDescription("Image aléatoire - unsplash.com")
    .setColor("#16a085")
    .setFooter("Evènement déclenché")
    .setImage("https://source.unsplash.com/random/1280x1024")
    .setTimestamp();

    channel.send(embed);
  }
}

module.exports = ShowcaseModule;
