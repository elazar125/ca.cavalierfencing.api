module.exports = function(app, graph) {
    app.get('/events', (req, res) => {
        graph.getEvents()
            .then(function(response) {
                res.send(response);
            });
    });

    app.get('/photos', (req, res) => {
        graph.getPhotos()
            .then(function(response) {
                res.send(response);
            });
    });
}
