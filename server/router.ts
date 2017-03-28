import express = require('express');
import bodyParser = require('body-parser');

let router = express.Router();
router.use(bodyParser.json());

export = router;

router.get('/api', (req, res) => {
  res.send('router works');
});

router.post('/api/convert', (req, res) => {
  require('latex')(req.body.latex)
    .on('error', (err) => {
      console.error(err);
      res.status(500).send({ error: err.toString() });
    })
    .pipe(require('dataurl').stream({mimetype: 'application/pdf'}))
    .pipe(res);
});

