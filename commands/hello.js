
const { MessageEmbed, Message, Client } = require('discord.js');
const config = require('../config.json');
const { connect } = require('../modules/function');
const { tts_play } = require('../modules/tts');
const { randm } = require('../modules/math');

module.exports = {
    name: 'hello',
    aliases: ['안녕','안뇽'],
    async run (client = new Client(), msg = new Message(), args = [], guildMap = new Map(), mapKey = new Message().guild.id, user) {
        const prefix = config.prefix;
        const voice_prefix = config.voice_prefix;
        
        const per = new MessageEmbed()
            .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
            .setColor('RED');
        
        var text = {
            1: '안녕하세요.',
            2: '반가워요',
            3: '안녕하세요 저는 빅스비입니다.',
            4: '만나서 반갑습니다',
            5: '안녕하세요.',
            6: '반가워요',
            7: '반갑습니다',
            8: '안녕 반가워요',
            9: '네 안녕하세요',
            10: '안 반가우면서 거짓말 하지마세요'
        };
        
        tts_play(msg, guildMap, mapKey, text[randm(1, 10)], {});
    },
};

function msgdelete(m, t) {
    setTimeout(function() {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}