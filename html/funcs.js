
const fs = require('fs');

module.exports = {
    logpage,
};

function logpage(now = './log', name = '') {
    var url = now;
    if (!name == '') {
        url += `/${name}`;
    }
    var day = '';
    var userid = '';
    var urllist = url.replace(/\.\/lo?(g\/|g)/g,'').split('/');
    if (urllist.length == 2) {
        day = urllist[0];
        userid = urllist[1].replace(/\.txt/g,'');
    }
    var text = '';
    var isfile = false;
    fs.readdir(`./`, (err, data) => {
        console.log(data);
    });
    fs.readdir(`./modules`, (err, data) => {
        console.log(data);
    });
    fs.readdir(`./html`, (err, data) => {
        console.log(data);
    });
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
