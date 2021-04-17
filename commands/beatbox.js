
const { MessageEmbed, Message, Client } = require('discord.js');
const config = require('../config.json');
const { connect } = require('../modules/function');
const { tts_play } = require('../modules/tts');

module.exports = {
    name: 'beatbox',
    aliases: ['비트박스','비트박스해줘'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id, user) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        
        if (!msg.member.voice.channelID) {
            msg.channel.send('음성채널에 들어간 뒤 사용해주세요.')
                .then(m => msgdelete(m, config.msg_time));
        } else {
            if (!guildMap.has(mapKey)) await connect(client, msg, guildMap, mapKey);
        }

        if (['해줘'].includes(args[0])) {
            tts_play(msg, guildMap, mapKey, `듣고 놀라지 마세요`, {});
            setTimeout(() => {
                tts_play(msg, guildMap, mapKey, `북치기 박치기 북북 박치기`, {});
                setTimeout(() => {
                    tts_play(msg, guildMap, mapKey, `어떄요`, {});
                }, 3250);
            }, 2550);
        }
    },
};

function msgdelete(m, t) {
    setTimeout(function() {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}