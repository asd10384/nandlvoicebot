
require('dotenv').config();
const express = require('express');
const router = express.Router();

const fs = require('fs');
const log = require('../log/logmodule');

// log
router.get(`/`, async (req, res) => {
    var text = await log.load();
    res.render(`log`, {
        now: `log`,
        day: text.day,
        userid: text.userid,
        log: text.text,
        isfile: text.isfile
    });
});
router.post(`/`, async (req, res) => {
    var now = req.body.now;
    var name = req.body.name;
    var text = await log.load(now, name);
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