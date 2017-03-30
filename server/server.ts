/**
 * @file server.ts
 *
 * Simple configuration for an express server.
 * For routes see router.ts
 *
 * @author Lars Gröber
 */

import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import router = require('./router');

import * as Config from '../config';

let app = express();

app.use(Config.ROOT_URL, router);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(Config.ROOT_URL, express.static(path.join(__dirname, '../dist/')));

const port = Config.PORT || 3000;

app.set('port', port);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
