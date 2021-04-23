
require('dotenv').config();
const { randm } = require('./math');
const { inc } = require('./date');
const { tts_play } = require('./tts');

module.exports = {
    say,
};

async function say(msg, guildMap, mapKey, args = []) {
    var saytext = '';
    if (args[0] == '') {
        var text = {
            1: '네 듣고있어요!',
            2: '왜 부르셨나요?',
            3: '네!',
            4: '네?',
        };
        saytext = text[randm(1,4)];
    }
    if (inc(['어때', '생각해', '생각하니'], args[args.length-1])) {
        var text = {
            1: '처음들어보는 단어라 잘 모르겠어요',
            2: '바보같다고 생각해요',
            3: '그게 뭔가요 물음표',
        };
        saytext = text[randm(1,3)];
    }
    if (inc(['뭐야'], args[args.length-1])) {
        saytext = `내가 어떻게 알겠니?`;
    }
    return await tts_play(msg, guildMap, mapKey, saytext, {});
}
