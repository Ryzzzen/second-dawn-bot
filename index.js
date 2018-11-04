const Discord = require('discord.js');
const client = new Discord.Client();

/* Makes this bot work on Heroku */
require('http').createServer(function (req, res) {
  res.write('Hello World!');
  res.end();
}).listen(process.env.PORT || 3000);

setInterval(() => {
  console.log('Making heroku request..');
  require('https').get('https://second-dawn-bot.herokuapp.com/');
}, Math.random() * (3600*1000 - 100*1000) + 100*1000);

async function createChannelsIfNecessary(old, backup) {
  console.log('Creating required channels');
  await Promise.all(old.channels.filter(x => !backup.channels.find(y => y.name === x.name)).map(x => backup.createChannel(x.name, x.type, x.permissionOverwrites.values())));

  old.channels.filter(x => x.parent).forEach(x => {
    backup.channels.find(y => y.name === x.name).setParent(backup.channels.find(y => y.name === x.parent.name && y.type === 'category'));
  });
}

client.on('ready', async () => {
  const old = client.guilds.find(x => x.id === '263831002382598144');
  const backup = client.guilds.find(x => x.id === '508436055285039104');

  console.log(`Ready to backup from ${old.name} to ${backup.name}!`);

  await createChannelsIfNecessary(old, backup);
  client.on('message', async message => {
    if (message.guild.id === backup.id) return;
    await createChannelsIfNecessary(old, backup);

    backup.channels.find(x => x.name === message.channel.name).send(`<@${message.author.id}> > ${message.content}`, message.attachments.values());
  });
});

client.login(process.env.TOKEN);
