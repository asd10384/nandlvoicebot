
const fs = require('fs');
const path = require('path');

// CONFIG
const config = require('./config.json');
const prefix = config.prefix;
const DISCORD_TOKEN = process.env.TOKEN || config.discord_token;
// CONFIG END


const guildMap = new Map();

const Discord = require('discord.js');
const client = new Discord.Client();

// 커맨드 불러오기
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', `${file}`));
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activity: {
            name: `${prefix}help`,
            type: 'WATCHING'
        },
        status: 'online'
    });
});
client.login(DISCORD_TOKEN);

client.on('message', async (msg) => {
    if (msg.author.bot) return;
    if (!('guild' in msg) || !msg.guild) return;
    
    const mapKey = msg.guild.id;
    if (msg.content.trim().startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        try {
            msgdelete(msg, 300);
            await command.run(client, msg, args, guildMap, mapKey, msg.member.user);
        } catch(err) {
            // console.log(err);
            const embed = new Discord.MessageEmbed()
                .setColor('DARK_RED')
                .setDescription(`\` ${commandName} \` 이라는 명령어를 찾을수 없습니다.`)
                .setFooter(` ${prefix}help 를 입력해 명령어를 확인해 주세요.`);
            return msg.channel.send(embed).then(m => msgdelete(m, config.msg_time));
        }
    }
});

// 메세지 삭제
function msgdelete(msg, time) {
    setTimeout(() => {
        try {
            msg.delete();
        } catch(err) {}
    }, time);
}
