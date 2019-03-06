const Module = require('../class/Module');

class FunModule extends Module {
  constructor() {
    super('fun', 'Fun');
  }

  async start(Dawn, generateErrorMessage = this.generateErrorMessage, storage = this.storage) {
    super.start();

    this.commands = [{
      prefixes: ['kickinv', 'kickinvite'],
      permissions: 2,
      handler: async function(message, args) {
        let user = message.mentions.users.first();

        const embed = new Dawn.Discord.RichEmbed()
        .setTitle("Modération")
        .setAuthor("Instant-kick", 'https://i.imgur.com/NSTJpQL.png')
        .setColor("#f1c40f")
        .setDescription("L'utilisateur à été kické et réinvité.")
        .setFooter("Commande exécutée par " + message.author.username, message.author.avatarURL)
        .setTimestamp();

        if (!user)
          embed.setDescription('Impossible de kick un utilisateur inexistant.');
          return message.channel.send(embed);

        try {
          let invite = await message.channel.createInvite({ reason: 'Kicked', maxUses: 1, unique: true });

          storage.put('to.put.back.roles.' + user.id, user.roles.keyArray());
          await user.kick('Kické par ' + message.author.username + ' (et réinvité automatiquement)');

          await user.send('Vous avez été kické par ' + message.author.username + ' (et réinvité automatiquement).\n' + invite.toString());
          message.channel.send(embed);
        }
        catch(err) {
          generateErrorMessage(message.channel, message.author, err, embed);
        }
      }
    }];
  }

  onGuildMemberAddEvent(Dawn, member) {
    let roles = this.storage.get('to.put.back.roles.' + member.id);

    if (roles) {
      console.log('[Roles] >> Giving back roles to @' + member.user.username);
      member.edit({ roles });
    }
  }
}

module.exports = FunModule;
