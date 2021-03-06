
require('dotenv').config();
const config = require('../config.json');
const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const app = express();
const PORT = process.env.PORT || config.HTMLPORT;
const Route = require('./routes');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/ejsfile');

app.use(flash());
app.use(bodyParser.urlencoded({extended : true}));

app.use(Route);
app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
    console.log('HTTP IS ONLINE PORT : ', PORT);
    setInterval(function () {
        http.get("http://bixbydiscordbot.herokuapp.com");
    }, 600000);
});
