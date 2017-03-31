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
import fs = require('fs');
import https = require('https');

import * as Config from '../config';

let app = express();

app.use(Config.ROOT_URL_EXPRESS, router);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(Config.ROOT_URL_EXPRESS, express.static(path.join(__dirname, '../dist/')));

if (Config.PORT) {
  const port = Config.PORT || 3000;

  app.set('port', port);

  app.listen(port, () => {
    console.log(`Listening for http requests on port ${port}`);
  });
}

if (Config.PORT_SSL && Config.PRIVATE_KEY && Config.CERTIFICATE) {
  const port = Config.PORT_SSL || 3001;

  try {
    let privateKey = fs.readFileSync(Config.PRIVATE_KEY, 'utf8');
    let certificate = fs.readFileSync(Config.CERTIFICATE, 'utf8');
    let credentials = {key: privateKey, cert: certificate};

    let httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port, () => {
      console.log(`Listening for https requests on port ${port}`);
    })
  } catch (err) {
    console.log(`There was an error setting up the https server: ${err}`);
  }
}
