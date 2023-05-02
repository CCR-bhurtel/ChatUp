const express = require('express');
const path = require('path');

const app = express();

const publicPath = path.resolve(__dirname, '../public');

console.log(publicPath);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.send('<h1> Hello world</h1>');
});

module.exports = app;
