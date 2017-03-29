import express = require('express');
import bodyParser = require('body-parser');
import fs = require('fs-extra');
import multer = require('multer');

import * as Config from '../config';

let router = express.Router();
router.use(bodyParser.json());

let upload = multer({ dest: '/tmp/' });

export = router;

// upload a file to the requested directory

// test route
router.get('/api', (req, res) => {
  res.send('router works');
});

// convert a single latex page to pdf
router.post('/api/convert', (req, res) => {
  require('latex')(req.body.latex)
    .on('error', (err) => {
      console.error(err);
      res.status(500).send({error: err.toString()});
    })
    .pipe(require('dataurl').stream({mimetype: 'application/pdf'}))
    .pipe(res);
});

// Uploads a file and returns an empty response.
// Expects name property.
router.post('/api/upload', upload.single('file'), (req, res) => {
  let name = req.body.name;
  if (name && req.file) {
    let filePath = req.file.path;
    let fileName = req.file.originalname;
    fs.move(filePath, Config.DATA_PATH + name + '/' + fileName, (err) => {
      console.log('Uploaded file');
      res.sendStatus(200);
    });
  } else {
    console.log('Bad Request.');
    res.sendStatus(400);
  }
});

/**
 * CRUD system for managing different latex documents.
 */
interface File {
  name: string,
  text: string,
}
// Get all documents, returns a list of available document names.
router.get('/api/latex/get/all', (req, res) => {
  fs.readdir(Config.DATA_PATH, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }
    res.send({
      documents: files
    });
  });
});

// Get one document, returns all file objects.
// Expects a 'name' parameter in body.
router.post('/api/latex/get/one', (req, res) => {
  let name = req.body.name;
  if (name) {
    fs.readdir(Config.DATA_PATH + name, (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
        return;
      }
      let docFiles: File[] = [];
      for (let f of files) {
        try {
          docFiles.push({name: f, text: fs.readFileSync(Config.DATA_PATH + name + '/' + f, 'utf8')});
        } catch (err) {
          console.error(err);
          res.status(500).send(err);
          return;
        }
      }
      res.send({files: docFiles});
    });
  } else {
    console.log('Bad Request.');
    res.sendStatus(400);
  }
});

// Create a new document, returns an empty 'main.tex' file object.
// Expects a 'name' parameter in body.
router.post('/api/latex/create/one', (req, res) => {
  console.log(req.body);
  let name = req.body.name;
  if (name) {
    fs.mkdir(Config.DATA_PATH + name, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
        return;
      }
      fs.writeFile(Config.DATA_PATH + name + '/' + 'main.tex', '', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
          return;
        }

        res.send({
          files: [{name: 'main.tex', text: ''}],
        })
      });
    });
  } else {
    console.log('Bad Request.');
    res.sendStatus(400);
  }
});

// Delete one document, returns an empty response.
// Expects a 'name' parameter in body.
router.post('/api/latex/delete/one', (req, res) => {
  let name = req.body.name;
  if (name) {
    removeDir(Config.DATA_PATH + name, res, () => res.sendStatus(200))
  } else {
    console.log('Bad Request.');
    res.sendStatus(400);
  }
});

// Update a document, returns all updated file objects.
// Expects a 'name' property and a 'files' property with an array of all file objects in body.
// TODO: deltes the complete directory for some reason
router.post('/api/latex/update/one', (req, res) => {
  let name: string = req.body.name;
  let files: File[] = req.body.files;
  if (name && files) {
    fs.remove(Config.DATA_PATH + name, (err) => {
      if (!handleErr(err, res)) return;
      fs.mkdir(Config.DATA_PATH + name, (err) => {
        if (!handleErr(err, res)) return;
        for (let f of files) {
          fs.writeFile(Config.DATA_PATH + name + '/' + f.name, f.text, (err) => {
            if (!handleErr(err, res)) return;
          });
        }
        res.send({files: files});
      });
    });
  } else {
    console.log('Bad Request.');
    res.sendStatus(400);
  }
});

function handleErr(err, res): boolean {
  if (err) {
    console.error(err);
    res.status(500).send(err);
    return false;
  }
}

function removeDir(path: string, res, callback?): boolean {
  fs.remove(path, err => {
    if (!handleErr(err, res)) {
      return false;
    }
    callback();
  });
  return false;
}
