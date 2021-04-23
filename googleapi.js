
require('dotenv').config();
const fs = require('fs');

module.exports = {
    getkeysttfile,
    getkeyttsfile,
};

function getkeysttfile() {
    var option = {
        "type": process.env.google_type,
        "project_id": process.env.google_project_id,
        "private_key_id": process.env.stt_private_key_id,
        "private_key": process.env.stt_private_key.replace(/\\n/gm,'\n'),
        "client_email": process.env.stt_client_email,
        "client_id": process.env.stt_client_id,
        "auth_uri": process.env.google_auth_uri,
        "token_uri": process.env.google_token_uri,
        "auth_provider_x509_cert_url": process.env.stt_auth_provider_x509_cert_url,
        "client_x509_cert_url": process.env.google_auth_provider_x509_cert_url
    };
    fs.writeFileSync(`googlesttapi.json`, JSON.stringify(option).replace(/\{/g,'{\n').replace(/\}/g,'\n}').replace(/\,/g, ',\n'));
}

function getkeyttsfile() {
    var option = {
        "type": process.env.google_type,
        "project_id": process.env.google_project_id,
        "private_key_id": process.env.tts_private_key_id,
        "private_key": process.env.tts_private_key.replace(/\\n/gm,'\n'),
        "client_email": process.env.tts_client_email,
        "client_id": process.env.tts_client_id,
        "auth_uri": process.env.google_auth_uri,
        "token_uri": process.env.google_token_uri,
        "auth_provider_x509_cert_url": process.env.tts_auth_provider_x509_cert_url,
        "client_x509_cert_url": process.env.google_auth_provider_x509_cert_url
    };
    fs.writeFileSync(`googlettsapi.json`, JSON.stringify(option).replace(/\{/g,'{\n').replace(/\}/g,'\n}').replace(/\,/g, ',\n'));
}
