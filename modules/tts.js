
require('dotenv').config();
const TTS = require('@google-cloud/text-to-speech');
const { writeFileSync } = require('fs');
const ttsclient = new TTS.TextToSpeechClient({
    keyFile: 'googlettsapi.json'
});

module.exports = {
    tts_msg,
    tts_play,
};

function tts_msg (text = '') {
    text = text.replace(/\?/gi, '물음표') || text;
    text = text.replace(/\!/gi, '느낌표') || text;
    text = text.replace(/\~/gi, '물결표') || text;

    text = text.replace(/\'/gi, '따옴표') || text;
    text = text.replace(/\"/gi, '큰따옴표') || text;

    text = text.replace(/\(/gi, '여는소괄호') || text;
    text = text.replace(/\)/gi, '닫는소괄호') || text;
    text = text.replace(/\{/gi, '여는중괄호') || text;
    text = text.replace(/\}/gi, '닫는중괄호') || text;
    text = text.replace(/\[/gi, '여는대괄호') || text;
    text = text.replace(/\]/gi, '닫는대괄호') || text;

    text = text.replace(/ㄹㅇ/gi, '리얼') || text;
    text = text.replace(/ㅅㅂ/gi, '시바') || text;
    text = text.replace(/ㄲㅂ/gi, '까비') || text;
    text = text.replace(/ㅅㄱ/gi, '수고') || text;
    text = text.replace(/ㅎㅇ/gi, '하이') || text;
    text = text.replace(/ㄴㅇㅅ/gi, '나이스') || text;

    return text;
}
async function tts_play(msg, guildMap, mapKey, text = '', opt = {
    customtext: false,
    volume: 0.75
}) {
    var options = {};
    var url = '';
    if (!opt.customtext) {
        const [response] = await ttsclient.synthesizeSpeech({
            input: {text: tts_msg(text)},
            voice: {
                languageCode: 'ko-KR',
                name: 'ko-KR-Standard-A'
            },
            audioConfig: {
                audioEncoding: 'MP3', // 형식
                speakingRate: 0.905, // 속도
                pitch: 0, // 피치
                // sampleRateHertz: 16000, // 헤르츠
                // effectsProfileId: ['medium-bluetooth-speaker-class-device'] // 효과 https://cloud.google.com/text-to-speech/docs/audio-profiles
            },
        });
        url = `tts.wav`;
        writeFileSync(url, response.audioContent);
    } else {
        url = text;
    }
    options['volume'] = (opt.volume) ? opt.volume : 0.75;
    return await ttsstart(msg, guildMap, mapKey, url, options);
}

async function ttsstart(msg, guildMap, mapKey, url, options) {
    var channel;
    try {
        channel = guildMap.get(mapKey).voice_Channel;
    } catch(err) {
        channel = msg.member.voice.channel;
    }
    channel.join().then((connection) => {
        connection.play(url, options);
    });
}