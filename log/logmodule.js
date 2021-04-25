
require('dotenv').config();
const fs = require('fs');
const mkdirp = require('mkdirp');
const { getFormatDate, getFormatTime } = require('../modules/date');

module.exports = {
    write,
    load,
};

function write(client, text = '', user) {
    const text_channel = process.env.text_channel || config.text_channel;
    if (text == undefined || text == null || text == '') return;
    var lc = __dirname + `/log`;
    var date = getFormatDate(new Date());
    var time = getFormatTime(new Date());
    mkdirp.sync(`${lc}/${date}`);
    fs.appendFile(`${lc}/${date}/${user.id}.txt`, `[${time}] ${user.username} : ${text} <br/>\n`, function (err) {
        if (err) throw err;
        client.channels.cache.get(text_channel).send(`[${time}] ${user.username} : ${text}`);
    });
}

function load(now = __dirname + '/log', name = '') {
    console.log(__dirname);
    var url = now;
    if (!name == '') {
        url += `/${name}`;
    }
    var day = '';
    var userid = '';
    var urllist = url.replace(/\\/g,'/').split('/');
    if (urllist.length > 2) {
        day = urllist[urllist.length-2];
        userid = urllist[urllist.length-1].replace(/\.txt/g,'');
    }
    var text = '';
    var isfile = false;
    try {
        var filelist = fs.readdirSync(url, 'utf-8');
        text = `<form action="/" method="POST" id="form">
            <input type="hidden" name="now" value="${url}"/>
        `;
        for (i in filelist) {
            text += `<input type="submit" name="name" value="${filelist[i]}"/>
            <br/>
        `;
        }
        text += `</form>`;
    } catch(err) {
        try {
            text = fs.readFileSync(url, 'utf-8');
            text.replace(/\\n/g, '<br/>');
            isfile = true;
        } catch(err) {
            text = '아직 파일이 없음';
        }
    }
    return {
        text: text,
        day: day,
        userid: userid,
        isfile: isfile
    };
}