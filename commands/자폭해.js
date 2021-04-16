
const { MessageEmbed, Message, Client } = require('discord.js');
const config = require('../config.json');
const { connect, leave } = require('../modules/function');
const { tts_play } = require('../modules/tts');
const { randm } = require('../modules/math');

module.exports = {
    name: '자폭해',
    aliases: ['작곡해'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        
        try {
            channel = guildMap.get(mapKey).voice_Channel
        } catch(err) {
            channel = msg.member.voice.channel;
        }
        tts_play(msg, guildMap, mapKey, `네 알겠습니다.`);
        setTimeout(() => {
            tts_play(msg, guildMap, mapKey, `sounds/boom.mp3`, {
                customtext: true,
                volume: 0.5
            });
            setTimeout(async () => {
                await leave(guildMap, mapKey);
                try {
                    channel.leave();
                } catch(err) {}
            }, 7100);
        }, 2600);
    },
};

function msgdelete(m, t) {
    setTimeout(function() {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}