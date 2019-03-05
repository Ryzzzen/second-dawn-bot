/* Module configurations */
require('dotenv').config();
require('moment').locale(process.env.LOCALE);
/* Module configurations */

const Discord = require('discord.js');
const client = new Discord.Client();

const Dawn = new (require('./class/Dawn'))(client);

Dawn.on('shutdown', async () => {
  console.log('Shutting down core modules.');

  await Dawn.shutdown();
  await Dawn.client.destroy();
  process.timeout(process.exit, 5000);
});

client.on('ready', async () => {
  await Dawn.onReady(client);
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of the guilds.`);
});

client.on('message', msg => Dawn.onMessage(msg));

Dawn.load().then(x => client.login(process.env.DISCORD_TOKEN));

if (process.env.FREE_HOST == true) {
  const http = require('http');
  http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-type': 'text/plain'
    });

    res.write('working');
    res.end();
  }).listen(4000);
}
