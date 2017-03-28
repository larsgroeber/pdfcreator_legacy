import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import router = require('./router');

let app = express();

app.use( router );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../dist/')));

const port = 3000;

app.set('port', port);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
