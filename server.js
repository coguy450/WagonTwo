var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var fs = require('fs')
var connectionString = 'mongodb://localhost/wagon2';
var thisDB;
var conMongo = ((callback) => {
  if (!thisDB) {
    MongoClient.connect(connectionString, function(err, db){
      if (err) console.log(err);
        thisDB = db;
        callback(thisDB);
    })
  } else {
    callback(thisDB);
  }
})

app.set('port', (process.env.PORT || 12000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/addActivity', (req, res) => {
  conMongo((db) => {
    var activity = db.collection('activities');
      activity.insert(req.body, (err, result) => {
        if (err) {
          res.status(400).send(err);
        } else {
          activity.find({}).toArray((fErr, allActs) => {
              res.status(200).send(allActs);
          });
        }
      });
  });
});

app.post('/doActivity', (req, res) => {
  console.log(req.body);
  conMongo((db) => {
    var activity = db.collection('actions');
      activity.insert(req.body, (err, result) => {
        console.log(err, result);
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(result);
        }
      });
  });
})

app.get('/activities', (req, res) => {
  conMongo((db) => {
    var activity = db.collection('activities');
    activity.find({}).toArray((err, results) => {
      res.status(200).send(results);
    })
  })
})
app.get('/badActivities', (req, res) => {
  conMongo((db) => {
    var activity = db.collection('activities');
    activity.find({actType: 'Negative'}).toArray((err, results) => {
      res.status(200).send(results);
    })
  })
})
app.get('/goodActivities', (req, res) => {
  conMongo((db) => {
    var activity = db.collection('activities');
    activity.find({$or: [{actType: 'Positive'}, {actType: 'Nuetral'}]}).toArray((err, results) => {
      if (err) console.error(err);
      res.status(200).send(results);
    })
  })
})


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
