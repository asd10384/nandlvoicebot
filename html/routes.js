
const express = require('express');
const router = express.Router();

const fs = require('fs');
const fnc = require('./funcs');

// log
router.get(`/`, (req, res) => {
    var text = fnc.logpage();
    res.render(`log`, {
        now: `./log`,
        day: text.day,
        userid: text.userid,
        log: text.text,
        isfile: text.isfile
    });
});
router.post(`/`, (req, res) => {
    var now = req.body.now;
    var name = req.body.name;
    var text = fnc.logpage(now, name);
    res.render(`log`, {
        now: `${now}/${name}`,
        day: text.day,
        userid: text.userid,
        log: text.text,
        isfile: text.isfile
    });
});
// log end



module.exports = router;