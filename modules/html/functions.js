
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
        text = fs.readFileSync(url, 'utf-8');
        text.replace(/\\n/g, '<br/>');
        isfile = true;
    }
    return {
        text: text,
        day: day,
        userid: userid,
        isfile: isfile
    };
}
