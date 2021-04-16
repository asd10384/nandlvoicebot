
const { MessageEmbed, Collection } = require('discord.js');
const fs = require('fs');
const util = require('util');
const path = require('path');
const { Readable } = require('stream');
const { tts_play } = require('../modules/tts');
const { randm } = require('../modules/math');

const config = require('../config.json');
let WITAPIKEY = process.env.WITAPIKEY;
if (!WITAPIKEY) {
    WITAPIKEY = config.wit_ai_token;
    if (!WITAPIKEY) throw 'failed loading config #113 missing keys!';
}

const witClient = require('node-witai-speech');

module.exports = {
    connect,
    process_commands_query,
    speak_impl,
    transcribe,
    transcribe_witai,
    leave,
};

async function leave(guildMap, mapKey) {
    if (guildMap.has(mapKey)) {
        let val = guildMap.get(mapKey);
        if (val.voice_Channel) val.voice_Channel.leave();
        if (val.voice_Connection) val.voice_Connection.disconnect();
        if (val.musicYTStream) val.musicYTStream.destroy();
        guildMap.delete(mapKey);
    }
}

async function connect(client, msg, guildMap, mapKey) {
    try {
        let voice_Channel = await client.channels.fetch(msg.member.voice.channelID);
        if (!voice_Channel) return msg.channel.send("음성채널에 들어갈수 없음");
        let text_Channel = await client.channels.fetch(config.text_channel);
        if (!text_Channel) return msg.channel.send("텍스트채널을 볼수 없습니다.");
        let voice_Connection = await voice_Channel.join();
        voice_Connection.play('sounds/sound.mp3', { volume: 0.8 });
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
    } catch (e) {
        console.log('connect: ' + e);
        msg.channel.send('음성채널에 들어갈수 없습니다.');
        throw e;
    }
}

function speak_impl(client, msg, guildMap, voice_Connection, mapKey) {
    voice_Connection.on('speaking', async (user, speaking) => {
        if (speaking.bitfield == 0 || user.bot) return;
        // this creates a 16-bit signed PCM, stereo 48KHz stream
        const audioStream = voice_Connection.receiver.createStream(user, { mode: 'pcm' });
        audioStream.on('error',  (e) => {
            console.log('audioStream: ' + e);
        });
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
                let out = await transcribe(new_buffer);
                if (out != null) process_commands_query(client, msg, guildMap, mapKey, out, user.id);
            } catch (e) {
                console.log('tmpraw rename: ' + e);
            }
        });
    });
}
async function process_commands_query(client, msg, guildMap, mapKey, text, userid) {
    if (!text || !text.length) return;

    const regex = eval(`/^${config.voice_prefix} ([a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+)(.+?)?$/`);
    if (text.toLowerCase().match(regex)) {
        const args = text.trim().slice(config.voice_prefix.length).trim().split(/ +/g);

        // 커맨드 불러오기
        client.commands = new Collection();
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(path.join(__dirname, '../commands', `${file}`));
            client.commands.set(command.name, command);
        }
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        try {
            await command.run(client, msg, args, guildMap, mapKey);
        } catch(err) {
            // 오류 확인console.log(err);
            
            var text = {
                1: '잘 못알아들었어요',
                2: '저는 잘 모르겠어요',
                3: '처음들어보는 말이예요',
            };
            tts_play(guildMap, mapKey, text[randm(1, 3)], {});
        }
    }
}
// SPEECH
async function transcribe(buffer) {
  return transcribe_witai(buffer);
}

async function transcribe_witai(buffer) {
    try {
        const extractSpeechIntent = util.promisify(witClient.extractSpeechIntent);
        var stream = Readable.from(buffer);
        const contenttype = "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little";
        const output = await extractSpeechIntent(WITAPIKEY, stream, contenttype);
        witAI_lastcallTS = Math.floor(new Date());
        stream.destroy();
        if (output && '_text' in output && output._text.length) {
            console.log(output._text);
            return output._text;
        }
        if (output && 'text' in output && output.text.length) {
            console.log(output.text);
            return output.text;
        }
        return output;
    } catch (e) {
        console.log('transcribe_witai 851:' + e);
        console.log(e);
    }
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
    } catch (e) {
        console.log(e);
        console.log('convert_audio: ' + e);
        throw e;
    }
}