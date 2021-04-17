
const { MessageEmbed, Message, Client } = require('discord.js');
const config = require('../config.json');
const { connect } = require('../modules/function');

module.exports = {
    name: 'help',
    aliases: ['도움말','명령어'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id, user) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        
        var text = '';
        var commandlist = config.commandhelp;
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
        user.send(embed);
    },
};

function msgdelete(m, t) {
    setTimeout(function() {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}