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
import async = require('async');

let mime = require('mime-types');

import * as Config from '../../config';
import {TemplateDB} from "../template.db";
import {TemplateI} from "../interfaces/template";

let router = express.Router();
router.use(bodyParser.json());

let upload = multer({dest: '/tmp/'});

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
    require('node-latex')(latex, {inputs: Config.DATA_PATH + name + '/'})
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
interface mFile {
  name: string,
  text: string,
}

// Get all documents, returns a list of available templates in the db.
router.get('/api/template/get_all', (req, res) => {
  TemplateDB.getAll((err, templates) => {
    if (!handleErr(err, res)) return;
    res.send({
      templates: templates
    });
  });
});

// Get one document, returns all file objects.
// Expects a 'name' parameter in body.
router.post('/api/template/get', (req, res) => {
  let name = req.body.name;
  if (name) {
    fs.readdir(Config.DATA_PATH + name, (err, files) => {
      if (!handleErr(err, res)) return;

      let docFiles: mFile[] = [];
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
router.post('/api/template/create', (req, res) => {
  let name = req.body.name;
  if (name) {
    // TODO: check db
    if (fs.existsSync(Config.DATA_PATH + name)) {
      res.status(500).send({
        error: 'Template name already exists!'
      });
      return;
    }

    async.parallel([
        callback => { // save to db
          TemplateDB.save({
            name: name,
            desc: req.body.desc,
            active: true,
          }, callback);
        },
        callback => { // create dir and main.tex
          fs.mkdir(Config.DATA_PATH + name, (err) => {
            if (err) callback(err);
            fs.writeFile(Config.DATA_PATH + name + '/' + 'main.tex', '', (err) => {
              callback(err, [{name: 'main.tex', text: ''}]);
            });
          });
        }],
      (err, results) => { // callback
        if (!handleErr(err, res)) return;
        res.send({
          template: results[0],
          files: results[1],
        })
      });
  } else {
    console.log('Bad Request.');
    res.sendStatus(400);
  }
});

// Delete one document, returns an empty response.
// Expects the template to delete in body.
router.post('/api/template/delete', (req, res) => {
  let template: TemplateI = req.body.template;
  console.log("Delete: ", template);
  if (template) {
    async.parallel([
        callback => { // delete from db
          TemplateDB.remove(template, callback);
        },
        callback => { // delete from disk
          fs.remove(Config.DATA_PATH + template.name, err => {
            if (err) callback(err);
            callback(undefined);
          });
        }
      ],
      (err, result) => { // callback
        if (!handleErr(err, res)) return;
        res.sendStatus(200);
      });
  } else {
    console.log('Bad Request.');
    res.sendStatus(400);
  }
});

// Update a document, returns all updated file objects.
// Expects a 'template' and a 'files' property with an array of all file objects in body.
router.post('/api/template/update', (req, res) => {
  let template: TemplateI = req.body.template;
  let newFiles: mFile[] = req.body.files;
  console.log('Update: ', req.body);
  if (template && newFiles) {
    async.parallel([
        callback => { // update db
          TemplateDB.change(template, callback);
        },
        callback => { // update files
          if (!fs.existsSync(Config.DATA_PATH + template.name)) {
            callback(`Could not find directory ${template.name}!`);
          }
          fs.readdir(Config.DATA_PATH + template.name, (err, oldFiles) => {
            if (err) callback(err);
            try {
              for (let of of oldFiles) {
                if (!newFiles.find(f => f.name === of)) {
                  fs.unlinkSync(Config.DATA_PATH + template.name + '/' + of);
                  console.log('unlinked ' + of);
                }
              }
              for (let nf of newFiles) {
                let m = mime.lookup(nf.name);
                if (m == 'image/png' || m == 'image/jpeg') {
                  continue;
                }
                fs.writeFileSync(Config.DATA_PATH + template.name + '/' + nf.name, nf.text);
              }
            } catch (err) {
              callback(err);
            }
            callback(undefined, newFiles);
          })
        }
      ],
      (err, result) => {
        if (!handleErr(err, res)) return;
        res.send({
          template: result[0],
          files: result[1],
        })
      });

  } else {
    console.log('Bad Request.');
    res.sendStatus(400);
  }
});

function handleErr(err, res): boolean {
  if (err) {
    console.error(err);
    res.status(500).send({
      error: err
    });
    return false;
  }
  return true;
}
