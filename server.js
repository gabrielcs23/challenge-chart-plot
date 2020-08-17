const express = require('express');
const path = require('path');
const app = express();

const buildPath = 'build';

app.use(express.static(buildPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, buildPath, 'index.html'));
});

app.listen(process.env.PORT || 8080);

