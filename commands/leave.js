
const { MessageEmbed, Message, Client, User } = require('discord.js');
const config = require('../config.json');
const { connect, leave } = require('../modules/function');

module.exports = {
    name: 'leave',
    aliases: ['나가','꺼져','저리가','종료'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id, user) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setDescription(`명령어 : \` 빅스비 ${this.name} \`\n같은 명령어 : [${this.aliases}]`)
            .setColor('RED');

        const usermember = msg.guild.members.cache.get(user.id);
        if (!usermember.permissions.has(config.role)) return user.send(per).then(m => msgdelete(m, config.msg_time + 7000));
        
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