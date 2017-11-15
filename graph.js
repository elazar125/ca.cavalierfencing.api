module.exports = {
    getPhotos: getPhotos,
    getEvents: getEvents
}

function getPhotos() {
    return getAuthorized('photos/uploaded', 'images')
        .then(function(response) {
            return response
                .map(function(image) {
                   return image.images[0];
                });
        });
}

function getEvents() {
    return getAuthorized('events', 'name,cover,description,start_time,end_time,is_canceled')
        .then(function(response) {
            return response
                .filter(function(event) {
                    return new Date(event.start_time) > new Date();
                })
                .sort(function(a, b) {
                    return new Date(a.start_time) - new Date(b.start_time);
                });
        });
}

function getAuthorized(edge, fields) {
    return authorize('app id', 'secret')
        .then(function (response) {
            return get('cavalierfencingmb', response.data.access_token, edge, fields)
                .then(function(response) {
                    return response.data.data;
                });
        });
}

function get(page, access_token, edge, fields) {
    return $http({
        method: 'GET',
        url: `https://graph.facebook.com/v2.10/${ page }/${ edge }`,
        params: {
            access_token: access_token,
            fields: fields
        }
    });
}

function authorize(appId, secret) {
    return $http({
        method: 'GET',
        url: 'https://graph.facebook.com/oauth/access_token',
        params: {
            client_id: appId,
            client_secret: secret,
            grant_type: 'client_credentials'
        }
    });
}
