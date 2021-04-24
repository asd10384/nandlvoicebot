
require('dotenv').config();
const STT = require('@google-cloud/speech');
const sttclient = new STT.SpeechClient({
    keyFile: 'googlesttapi.json'
});
const { MessageEmbed, Collection } = require('discord.js');
const fs = require('fs');
const util = require('util');
const path = require('path');
const { Readable } = require('stream');
const { tts_play } = require('./tts');
const { say } = require('./say');
const { randm } = require('./math');
const { getFormatDate, getFormatTime } = require('./date');

const config = require('../config.json');
const WITAPIKEY = process.env.WITAPIKEY || config.wit_ai_token;

const witClient = require('node-witai-speech');

module.exports = {
    connect,
    process_commands_query,
    speak_impl,
    transcribe,
    transcribe_witai,
    leave,
    setInter,
};

async function setInter(client, msg, guildMap, mapKey) {
    const defult_voice_channel = process.env.defult_voice_channel || config.defult_voice_channel;
    const setIntertimer = setInterval(async () => {
        if (!msg.guild.me.voice.channel) {
            client.channels.cache.get(defult_voice_channel);
            await tts_play(msg, guildMap, mapKey, `빅스비는 내보낼수 없습니다.`, {});
            connect(client, msg, guildMap, mapKey, {
                frist: false,
            });
        }
    }, 1000);
}
function logfile(client, text = '', user) {
    const text_channel = process.env.text_channel || config.text_channel;
    if (text == undefined || text == null || text == '') return;
    fs.access(`./log`, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
            try {
                fs.mkdirSync(`./log`);
            } catch(err) {
                console.log(err);
            }
        }
        var date = getFormatDate(new Date());
        fs.access(`./log/${date}`, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (err) {
                try {
                    fs.mkdirSync(`./log/${date}`);
                } catch(err) {
                    console.log(err);
                }
            }
            fs.open(`./log/${date}/${user.id}.txt`, 'a+', (err, fd) => {
                var time = getFormatTime(new Date());
                fs.appendFile(`./log/${date}/${user.id}.txt`, `[${time}] ${user.username} : ${text} <br/>\n`, function (err) {
                    if (err) throw err;
                    client.channels.cache.get(text_channel).send(`[${time}] ${user.username} : ${text}`);
                });
            });
        });
    });
}

async function leave(guildMap, mapKey) {
    if (guildMap.has(mapKey)) {
        let val = guildMap.get(mapKey);
        if (val.voice_Channel) val.voice_Channel.leave();
        if (val.voice_Connection) val.voice_Connection.disconnect();
        if (val.musicYTStream) val.musicYTStream.destroy();
        guildMap.delete(mapKey);
    }
}

async function connect(client, msg, guildMap, mapKey, setting = {
    frist: true
}) {
    try {
        let voice_Channel = await client.channels.fetch(msg.member.voice.channelID || process.env.defult_voice_channel || undefined);
        if (!voice_Channel) return msg.channel.send("음성채널에 들어갈수 없음");
        let text_Channel = await client.channels.fetch(process.env.text_channel || config.text_channel);
        if (!text_Channel) return msg.channel.send("텍스트채널을 볼수 없습니다.");
        let voice_Connection = await voice_Channel.join();
        if (setting.frist) await tts_play(msg, guildMap, mapKey, `빅스비가 활성화 되었습니다. 빅스비 명령어로 명령어들을 확인하실수있습니다.`, {});
        guildMap.set(mapKey, {
            'text_Channel': text_Channel,
            'voice_Channel': voice_Channel,
            'voice_Connection': voice_Connection,
            'debug': false,
        });
        speak_impl(client, msg, guildMap, voice_Connection, mapKey);
        voice_Connection.on('disconnect', async(e) => {
            guildMap.delete(mapKey);
        });
    } catch (e) {}
}

function speak_impl(client, msg, guildMap, voice_Connection, mapKey) {
    voice_Connection.on('speaking', async (user, speaking) => {
        if (speaking.bitfield == 0 || user.bot) return;
        // this creates a 16-bit signed PCM, stereo 48KHz stream
        const audioStream = voice_Connection.receiver.createStream(user, { mode: 'pcm' });
        let buffer = [];
        audioStream.on('data', (data) => {
            buffer.push(data);
        })
        audioStream.on('end', async () => {
            buffer = Buffer.concat(buffer);
            const duration = buffer.length / 48000 / 4;
            // 20 seconds max dur
            if (duration < 1.0 || duration > 30) return;

            try {
                let new_buffer = await convert_audio(buffer);
                let out = await transcribe(client, new_buffer, user);
                if (out != null) process_commands_query(client, msg, guildMap, mapKey, out, user);
            } catch (e) {}
        });
    });
}
async function process_commands_query(client, msg, guildMap, mapKey, text, user) {
    if (!text || !text.length) return;

    const voice_prefix = process.env.voice_prefix || config.voice_prefix;

    // 빅스비야
    const saycheck = text.trim().split(/ +/g);
    if ([`${voice_prefix}야`].includes(saycheck[0])) {
        const args = text.trim().slice(saycheck[0].length).trim().split(/ +/g);
        return await say(msg, guildMap, mapKey, args);
    }

    // 빅스비
    const regex = eval(`/^${voice_prefix} ([a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+)(.+?)?$/`);
    if (text.toLowerCase().match(regex)) {
        const args = text.trim().slice(voice_prefix.length).trim().split(/ +/g);

        // 커맨드 불러오기
        client.commands = new Collection();
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(path.join(__dirname, '../commands', `${file}`));
            client.commands.set(command.name, command);
        }
        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        try {
            await command.run(client, msg, args.slice(1), guildMap, mapKey, user);
        } catch(err) {
            // 오류 확인
            // console.log(err);
            var text = {
                1: '잘 못알아들었어요',
                2: '저는 잘 모르겠어요',
                3: '처음들어보는 말이예요',
            };
            return await tts_play(msg, guildMap, mapKey, text[randm(1, 3)], {});
        }
    }
}
// SPEECH
async function transcribe(client, buffer, user) {
    // return transcribe_witai(client, buffer, user);
    return transcribe_gspeech(client, buffer, user);
}

async function transcribe_gspeech(client, buffer, user) {
    try {
        const bytes = buffer.toString('base64');
        const [response] = await sttclient.recognize({
            audio: {content: bytes},
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 48000,
                languageCode: 'ko-KR',
            }
        });
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        logfile(client, transcription, user);
        return transcription;
    } catch(e) {}
}
async function transcribe_witai(client, buffer, user) {
    try {
        const extractSpeechIntent = util.promisify(witClient.extractSpeechIntent);
        var stream = Readable.from(buffer);
        const contenttype = "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little";
        const output = await extractSpeechIntent(WITAPIKEY, stream, contenttype);
        witAI_lastcallTS = Math.floor(new Date());
        stream.destroy();
        if (output && '_text' in output && output._text.length) {
            logfile(client, output._text, user);
            return output._text;
        }
        if (output && 'text' in output && output.text.length) {
            logfile(client, output.text, user);
            return output.text;
        }
        return output;
    } catch (e) {}
}

async function convert_audio(input) {
    try {
        // stereo to mono channel
        const data = new Int16Array(input);
        const ndata = new Int16Array(data.length/2);
        for (let i = 0, j = 0; i < data.length; i+=4) {
            ndata[j++] = data[i];
            ndata[j++] = data[i+1];
        }
        return Buffer.from(ndata);
    } catch (e) {}
}
