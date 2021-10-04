var express = require('express');
var Datastore = require('nedb');

var app = express();
var db = new Datastore({ filename: 'opn.db', autoload: true });

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

app.post('/users/', function (req, res) {
    let data = req.body;
    data['table'] = 'user';

    db.insert(data, function (err, newDoc) {
        res.json(newDoc);
    })
});

app.post('/users/:id', function (req, res) {
    let data = req.body;
    if (data._id !== req.params.id) {
        res.statusCode = 404;
        res.json(err);
    }

    db.update({ _id: data._id }, { $set: data }, function (err, newDoc) {
        res.json(newDoc);
    })
});

app.delete('/users/:id', function (req, res) {
    db.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
        db.find({ table: 'user' }).exec(function (err, docs) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            };
            var data = {};

            data['success'] = true;
            data['user'] = docs;

            res.json(data);
        });
    });
});

app.get('/users/', function (req, res) {
  if(req.query.name) {
    db.find({ table: 'user', name: /req.query.name/ }).sort({ name: 1 }).exec(function (err, docs) {
      if (err) {
          res.statusCode = 404;
          res.json(err);
      };

      res.json(docs);
    });
  } else {
    db.find({ table: 'user' }).exec(function (err, docs) {
        if (err) {
            res.statusCode = 404;
            res.json(err);
        };

        res.json(docs);
    });
  }
});

app.get('/users/:id', function (req, res) {
    db.findOne({ table: 'user', _id: req.params.id }).sort({ id: 1 }).exec(function (err, docs) {
        if (err) {
            res.statusCode = 404;
            res.json(err);
        };

        res.json(docs);
    });
});

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('API server listening at http://%s:%s', host, port);
});