const Module = require('../class/Module');

class ModerationModule extends Module {
  constructor() {
    super('mod', 'Moderation');
  }

  async start(Dawn) {
    super.start();

    this.commands = [{
      prefixes: ['rm', 'purge', 'clean'],
      permissions: 2,
      delete: true,
      handler: async function(message, args) {
        const embed = new Dawn.Discord.RichEmbed()
        .setTitle("Modération")
        .setAuthor("Suppression de messages", 'https://i.imgur.com/NSTJpQL.png')
        .setColor("#f1c40f")
        .setDescription("Des messages sont entrain d'être supprimés de ce canal de discussion")
        .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
        .setTimestamp();

        if (args.length >= 1 && isFinite(args[0])) {
          embed.addField("Critères", 'Suppression des ' + args[0] + ' derniers messages');
          let m = await message.channel.send(embed);

          message.channel.bulkDelete(parseInt(args[0]));
          m.delete(10000);
        }
        else if (args.length >= 1) {
          embed.addField("Critères", 'Filtre: `' + args.join(' ').trim() + '`');
          let m = await message.channel.send(embed);

          let messages = await message.channel.awaitMessages(m => m.content.includes(args.join(' ').trim()), { max: 100, time: 60000 });
          await Promise.all(messages.map(m => m.delete()));

          m.delete(10000);
        }
      }
    }];
  }

  async stop() {
    super.stop();
  }
}

module.exports = ModerationModule;
