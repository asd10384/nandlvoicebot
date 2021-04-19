
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
    var addtime = (date.getHours()+Number(addtime) >= 24) ? 1 : 0;
    return `${
        date.getFullYear()
    }-${
        az(date.getMonth()+1)
    }-${az(date.getDate()+Number(addtime))}`;
}
function getFormatTime(date = new Date()) {
    var hours = date.getHours()+Number(addtime);
    if (hours >= 24) hours = hours-24;
    return `${
        az(hours)
    }:${
        az(date.getMinutes())
    }:${az(date.getSeconds())}`;
}

function az(num) {
    return (num < 10) ? '0'+num : num;
}