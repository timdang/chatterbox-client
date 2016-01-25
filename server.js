'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.json());

var id = 2;
var messages = [{
  id: 1,
  username: 'codybot',
  roomname: 'Lobby',
  text: 'Hello World',
  createdAt: Date.now()
}];

app.route('/1/classes/chatterbox/')
  .get(function (req, res) {
    res.send({results: messages});
  })
  .post(function (req, res) {
    var msg = req.body;
    msg.id = id;
    msg.createdAt = Date.now();
    id++;
    messages.push(msg);
    res.status(201).send(msg);
  });

app.listen(3000, function (err) {
  if(err) {
    console.error(err);
  } else {
    console.log('The server is running at http://localhost:3000/1/classes/chatterbox/');
  }
});
