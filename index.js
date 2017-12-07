const express = require('express');
const https = require('https');
const app = express();

app.get('/events', (req, res) => {
    var edge = 'events';
    var fields = 'name,cover,description,start_time,end_time,is_canceled';
    var cb = filterEvents;
    sendResults(edge, fields, cb, res);
});

app.get('/photos', (req, res) => {
    var edge = 'photos/uploaded';
    var fields = 'images';
    var cb = parsePhotos;
    sendResults(edge, fields, cb, res);
});

app.listen(8000);

function sendResults(edge, fields, cb, res) {
    res.set('Access-Control-Allow-Origin', '*');
    getAccessToken()
        .then((token) => getData(edge, fields, token))
        .then((data) => cb(data))
        .then((results) => res.send(results));
}

function parsePhotos(photos) {
    return photos
        .map((i) => i.images[0])
        .map((i) => i.source);
}

function filterEvents(events) {
    return events
        .filter((event) => new Date(event.start_time) > new Date())
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
}

function getData(edge, fields, access_token) {
    var url = 'https://graph.facebook.com/v2.10/cavalierfencingmb/' + edge
        + '?fields=' + fields
        + '&access_token=' + access_token;

    return get(url)
        .then((res) => res.data);
}

function getAccessToken() {
    var url = 'https://graph.facebook.com/oauth/access_token'
        + '?client_id=' + 'app id'
        + '&client_secret=' + 'secret'
        + '&grant_type=client_credentials'

    return get(url)
        .then((res) => res.access_token);
}

function get(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (res) => {
            if (res.statusCode > 399) {
                reject(new Error('Failed, status code ' + res.statusCode));
            }
            const body = [];
            res.on('data', (chunk) => body.push(chunk));
            res.on('end', () => resolve(JSON.parse(body.join(''))));
        });
        request.on('error', (e) => reject(e));
    });
}
