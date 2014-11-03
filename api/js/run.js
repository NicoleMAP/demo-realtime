// Requires
var express     = require('express'),
    bodyParser  = require('body-parser'),
    redis       = require('redis');


// Global vars
var app           = express(),
    redis_client  = redis.createClient(),
    port          = process.argv[2],
    urlencParser  = bodyParser.urlencoded({ extended: false });


// Routes
app.post('/users', urlencParser, function(req, res, next) {

  var username = req.param('username');

  redis_client.sadd('users', username);

  res.send({
    'status': 'ok',
    'data': username
  });

});

app.get('/users', function(req, res, next) {

  redis_client.smembers('users', function(err, result) {

    res.send(result);

  });

});

app.post('/chat', urlencParser, function(req, res, next) {

  var content = req.param('content'),
      owner = req.param('owner');

  if (content && owner) {

    var msg_id,
        users,
        users_count,
        message_hash;

    redis_client.incr('message:incr', function(err, result) {

      msg_id = result;

      message_hash = {
        'id': msg_id,
        'content': content,
        'owner': owner
      };

      redis_client.hmset('message:' + msg_id, message_hash);

      redis_client.smembers('users', function(err, result) {

        for (var i = 0; i < result.length; i++) {
          redis_client.lpush(result[i] + ':channel', 'message:' + msg_id);
        }

        res.status(201).send({
          'status': 'ok',
          'data': message_hash
        });

      });

    });

  } else {
    res.status(400).send('Bad Request');
  }

});

app.get('/chat', urlencParser, function(req, res, next) {

  var username = req.param('username');

  if (username) {

    redis_client.brpop([username + ':channel', 10], function(list, result) {

      redis_client.hgetall(result[1], function(err, result) {

        res.send(result);

      });

    });

  } else {
    res.status(400).send('Bad Request');
  }

});


// Start server
var server = app.listen(port, '192.168.33.3', function() {
  console.log('Started at http://%s:%s', server.address().address, server.address().port);
});