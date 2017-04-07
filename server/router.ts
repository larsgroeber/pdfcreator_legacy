/**
 * @file router.ts
 *
 * Contains all routes for the CRUD and latex backend.
 *
 * @author Lars Gröber
 */

import express = require('express');
import bodyParser = require('body-parser');
import fs = require('fs-extra');
import multer = require('multer');

let mime = require('mime-types');

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

// Converts a single latex page to pdf
router.post('/api/convert', (req, res) => {
  require('latex')(req.body.latex)
    .on('error', (err) => {
      console.error(err);
      res.status(500).send({error: err.toString()});
    })
    .pipe(require('dataurl').stream({mimetype: 'application/pdf'}))
    .pipe(res);
});

// Converts a complete latex document by taking the 'main.tex' file
// and the name of the document as arguments in the body.
// Returns the compiled PDF as a dataurl.
router.post('/api/latex/convert', (req, res) => {
  let name = req.body.name;
  let latex = req.body.latex;
  if (name && latex) {
    require('node-latex')(latex, { inputs: Config.DATA_PATH + name + '/' })
      .on('error', err => {
        console.error(err);
        res.status(500).send({error: err.toString()});
      })
      .pipe(require('dataurl').stream({mimetype: 'application/pdf'}))
      .pipe(res);
  } else {
    console.log('Bad Request!');
    res.sendStatus(400);
  }
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
          let m = mime.lookup(f);
          if (m == 'image/png' || m == 'image/jpeg') {
            docFiles.push({name: f, text: 'Picture, not implemented'});
            continue;
          }
          if (m == 'application/pdf') {
            docFiles.push({name: f, text: 'PDF, not implemented'});
            continue;
          }
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
router.post('/api/latex/update/one', (req, res) => {
  let name: string = req.body.name;
  let newFiles: File[] = req.body.files;
  if (name && newFiles) {
    if (!fs.existsSync(Config.DATA_PATH + name)) {
      res.send({files: ''});
      return;
    }
    fs.readdir(Config.DATA_PATH + name, (err, oldFiles) => {
      if (!handleErr(err, res)) return;
      try {
        for (let of of oldFiles) {
          if (!newFiles.find(f => f.name === of)) {
            fs.unlinkSync(Config.DATA_PATH + name + '/' + of);
            console.log('unlinked ' + of);
          }
        }
        for (let nf of newFiles) {
          let m = mime.lookup(nf.name);
          if (m == 'image/png' || m == 'image/jpeg') {
            continue;
          }
          fs.writeFileSync(Config.DATA_PATH + name + '/' + nf.name, nf.text);
        }
      } catch (err) {
        console.error(err);
        res.status(500).send(err);
      }
      res.send({files: newFiles});
    })
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
  return true;
}

function removeDir(path: string, res, callback?): boolean {
  fs.remove(path, err => {
    if (!handleErr(err, res)) {
      return false;
    }
    callback();
  });
  return true;
}
