
const { MessageEmbed, Message, Client } = require('discord.js');
const config = require('../config.json');
const { connect } = require('../modules/function');

module.exports = {
    name: 'help',
    aliases: ['도움말','명령어'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        
        var text = '';
        var commandlist = {
            "도움말": "도움말 확인",
            "안녕": "여러가지 인사로 받아줍니다.",
            "핑": "핑 확인",
        };
        var commandlist_name = Object.keys(commandlist);
        for (i in commandlist_name) {
            text = `\` ${voice_prefix} ${commandlist_name[i]} \` : ${commandlist[commandlist_name[i]]}\n`;
        }
        const embed = new MessageEmbed()
            .setTitle(`명령어`)
            .setDescription(`
                \` TEXT 명령어 \`
                ${prefix}join : 봇을 음성에 불러옵니다.
                ${prefix}leave : 봇을 음성에서 내보냅니다.

                \` 음성 명령어 \`
                ${text}
            `)
            .setFooter(`${prefix}JOIN 을하고 말하면됩니다.`)
            .setColor(`ORANGE`);
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