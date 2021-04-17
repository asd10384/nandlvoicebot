
const config = require('../../config.json');
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const app = express();
const PORT = process.env.PORT || config.HTMLPORT;
const Route = require('./routes');

module.exports = {
    start,
};

function start() {
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/ejsfile');

    app.use(flash());
    app.use(bodyParser.urlencoded({extended : true})); 

    app.use(Route);
    app.use(express.static(__dirname + '/public'));

    app.listen(PORT, function() {
        console.log('HTTP IS ONLINE PORT : ', PORT);
    });
}
