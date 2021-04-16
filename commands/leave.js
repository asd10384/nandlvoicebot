
const { MessageEmbed, Message, Client } = require('discord.js');
const config = require('../config.json');
const { connect, leave } = require('../modules/function');

module.exports = {
    name: 'leave',
    aliases: ['나가','꺼져','저리가','종료'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        
        await leave(guildMap, mapKey);
    },
};

function msgdelete(m, t) {
    setTimeout(function() {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}