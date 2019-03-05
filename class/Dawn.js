const fs = require('fs'), path = require('path');
const EventEmitter = require('events');

const Discord = require('discord.js');
const Storage = require('node-storage');

class Dawn extends EventEmitter {
  constructor(client) {
    super();
    this.storage = new Storage(path.join(__dirname, '../data/dawn.json'));

    this.Discord = Discord;
    this.client = client;

    this.commands = [];
    this.modules = [];
  }

  _readdir(x) {
    return new Promise((resolve, reject) => {
      fs.readdir(x, function (err, dir) {
        if (err) return reject(err);
        resolve(dir);
      });
    });
  }

  async load() {
    console.log('[System] Loading');
    if (!this.storage.get('prefix')) {
      this.storage.put('administration', { owner: '98840465624809472', groups: [{ id: '375010276489297920', level: 1 }, { id: '375009917968318495', level: 2 }] });
      this.storage.put('prefix', '!');
    }

    let dir = (await this._readdir(path.join(__dirname, '../modules'))).filter(x => x.slice(-3) === '.js');

    for (let i = 0; i < dir.length; i++) {
      try {
        console.log(`[Modules] ${dir[i]} >> Registering`);

        let module = new (require(path.join(__dirname, '../modules/', dir[i])))();
        this.modules.push(module);

        // Let's hook onXXEvent methods to Discord.js events
        Object.getOwnPropertyNames(Object.getPrototypeOf(module)).filter(x => x.startsWith('on') && x.slice(-5) === 'Event').map(x => [x, x.slice(2, -5).toLowerCase()]).forEach(x => {
          console.log(`[Modules] ${module.name}#${x[0]} >> Hooking  to ${x[1]} event`);
          this.client.on(x[1], (...a) => module[x[0]](this, ...a));
        });
      }
      catch(err) {
        console.error(err);
      }
    }

    console.log(`[Modules] Finished Registering`);
  }

  async onReady(client) {
    this.client.user.setActivity('!help', { type: 'LISTENING' });

    console.log(`[Modules] >> Loading all modules`);
    const d = await Promise.all(this.modules.map(x => x.start(this)));

    this.modules.forEach(x => {
      this.commands = this.commands.concat(x.commands);
    });

    console.log(`[Modules] >> Loaded all modules`);
  }

  onMessage(message) {
    if(message.author.bot) return;
    let content = message.content.trim();

    if(content.indexOf(this.storage.get('prefix')) !== 0) return;

    const args = content.slice(this.storage.get('prefix').length).trim().split(/ +/g);
    const prefix = args.shift().toLowerCase();

    console.log('[CommandExecuter] >> Received: \'' + content + '\' by ' + message.author.username);
    console.log(prefix);

    let cmd = this.commands.find(x => x.prefixes.some(y => prefix === y));

    if (!cmd) return;

    if (message.author.id !== this.storage.get('administration').owner && !this.hasRole(message.member.highestRole.id, cmd.permissions)) {
      console.log('[CommandExecuter] >> Required roles: level ' + cmd.permissions + ' for ' + message.author.username);
      return;
    }

    console.log('[CommandExecuter] >> Executing command');

    try {
      cmd.handler(message, args);
      console.log('[CommandExecuter] >> Executed command');
    }
    catch(err) {
      console.log('[CommandExecuter] >> Error while executing command');
      console.error(err);

      if (cmd.errorHandler) this.errorHandler(message, args, err);
      else this.onCommandError(message, args, err);
    }

    if (cmd.delete)
      message.delete();
  }

  onCommandError(message, args, err) {
    const embed = new Discord.RichEmbed()
    .setTitle("Erreur")
    .setAuthor("Second Dawn", message.client.user.avatarURL)
    .setColor("#f1c40f")
    .setDescription(err.toString())
    .setFooter("Commande exécutée par " + message.author.username, 'https://i.imgur.com/cA0ExpQ.png')
    .setTimestamp()
    .addField('Commande', message.content.trim());

    return message.channel.send(embed);
  }

  hasRole(id, level) {
    if (!level) return true;
    return this.storage.get('administration').groups.some(group => group.id === id && group.level <= level);
  }

  async shutdown() {
    await Promise.all(this.modules.map(x => x.stop(this)));
  }
}

module.exports = Dawn;
