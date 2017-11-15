const express = require('express');
const app = express();
const graph = require('./graph.js');
const routes = require('./routes.js');

const port = 8000;

routes(app, graph);

app.listen(port, () => {
    console.log('Running on port ' + port);
});
