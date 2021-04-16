
const { MessageEmbed, Message, Client } = require('discord.js');
const config = require('../config.json');
const { connect } = require('../modules/function');

module.exports = {
    name: 'ping',
    aliases: ['핑'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        
        const embed = new MessageEmbed()
        .setTitle(`\` PONG! \``)
        .setDescription(`🏓 \` ${client.ws.ping} \` ms`)
        .setColor('RANDOM');

        msg.channel.send(embed)
            .then(m => msgdelete(m, config.msg_time + 15000));
    },
};

function msgdelete(m, t) {
    setTimeout(function() {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}