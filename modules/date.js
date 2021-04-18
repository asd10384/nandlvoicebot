
const config = require('../config.json');
const addtime = process.env.ADDTIME || config.addtime;

module.exports = {
    inc,
    getFormatDate,
    getFormatTime,
};

function inc(args = [], text = '') {
    if (args.includes(text)) {
        return true;
    }
    false;
}

function getFormatDate(date = new Date()) {
    return `${
        date.getFullYear()
    }-${
        az(date.getMonth()+1)
    }-${az(date.getDate())}`;
}
function getFormatTime(date = new Date()) {
    return `${
        az(date.getHours()+Number(addtime))
    }:${
        az(date.getMinutes())
    }:${az(date.getSeconds())}`;
}

function az(num) {
    return (num < 10) ? '0'+num : num;
}