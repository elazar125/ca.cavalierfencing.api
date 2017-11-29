const express = require('express');
const https = require('https');
const app = express();

app.get('/events', (req, res) => {
    getAuthorized(
        'events',
        'name,cover,description,start_time,end_time,is_canceled',
        (response) => res.send(response
            .filter((event) => new Date(event.start_time) > new Date())
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))));
});

app.get('/photos', (req, res) => {
    getAuthorized(
        'photos/uploaded',
        'images',
        (response) => res.send(response
            .map((i) => i.images[0])));
});

app.listen(8000);

function getAuthorized(edge, fields, cb) {
    var url = 'https://graph.facebook.com/oauth/access_token'
        + '?client_id=' + 'app id'
        + '&client_secret=' + 'secret'
        + '&grant_type=client_credentials'

    get(url, (res) => {
        var url = 'https://graph.facebook.com/v2.10/cavalierfencingmb/' + edge
            + '?access_token=' + res.access_token
            + '&fields=' + fields

        get(url, (res) => cb(res.data));
    });
}

function get(url, cb) {
    https.get(url, (res) => {
        const body = [];
        res.on('data', (chunk) => body.push(chunk));
        res.on('end', () => cb(JSON.parse(body.join(''))));
    }).on('error', (e) => console.error(e));
}
