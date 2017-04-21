
import bodyParser = require("body-parser");
import express = require('express');
import mongoosse = require('mongoose');
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
import {UserModel, UserModelI} from "../models/user.model";

import {AUTH_SECRET} from '../secrets';

let router = express.Router();
router.use(bodyParser.json());

export = router;

router.post('/api/user/authenticate', authenticate);
router.post('/api/user/register', register);



function authenticate(req, res) {
  let reqUser: { name: string, password: string } = req.body;
  if (!reqUser) {
    res.sendStatus(400);
    return;
  }

  UserModel.findOne({name: reqUser.name}, (err, user) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (user && bcrypt.compareSync(reqUser.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        role: user.role,
        token: jwt.sign({ sub: user._id }, AUTH_SECRET),
      })
    } else {
      res.send({});
    }
  })
}

function register(req, res) {
  let reqUser: { name: string, password: string, role: string, email: string } = req.body;
  console.log(req.body, reqUser);
  if (!reqUser.name) {
    res.sendStatus(400);
    return;
  }

  UserModel.findOne({name: reqUser.name}, (err, user) => {
    if (err) {
      res.status(500).send({
        error: err
      });
      return;
    }

    if (user) {
      res.send({
        error: `Username '${reqUser.name}' is already taken!`
      });
      return;
    } else {
      createUser();
    }

    function createUser() {
      let user = new UserModel(reqUser);
      user.password = bcrypt.hashSync(reqUser.password, 10);

      user.save(err => {
        if (err) {
          res.status(500).send({
            error: err
          });
          return;
        }

        res.sendStatus(200);
      })
    }
  })
}
