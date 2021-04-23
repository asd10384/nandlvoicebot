
const { MessageEmbed, Message, Client } = require('discord.js');
const config = require('../config.json');
const { connect, setInter } = require('../modules/stt_function');

module.exports = {
    name: 'join',
    aliases: ['접속','빅스비'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id, user) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        try {
            if (!msg.member.voice.channelID) {
                msg.channel.send('먼저 음성대화방에 들어간 다음 사용해주세요.')
                    .then(m => msgdelete(m, config.msg_time));
            } else {
                if (!guildMap.has(mapKey)) await connect(client, msg, guildMap, mapKey);
                setInter(client, msg, guildMap, mapKey);
            }
        } catch(err) {
            client.channels.cache.get(config.voice_channel).join();
            await connect();
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