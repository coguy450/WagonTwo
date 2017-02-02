var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
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

exports.addActivity = (req, res) => {
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
};

exports.doActivity = (req, res) => {
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
}

exports.activities = (req, res) => {
  conMongo((db) => {
    var activity = db.collection('activities');
    activity.find({}).toArray((err, results) => {
      res.status(200).send(results);
    })
  })
}
exports.badActivities = (req, res) => {
  conMongo((db) => {
    var activity = db.collection('activities');
    activity.find({actType: 'Negative'}).toArray((err, results) => {
      res.status(200).send(results);
    })
  })
}
exports.goodActivities = (req, res) => {
  conMongo((db) => {
    var activity = db.collection('activities');
    activity.find({$or: [{actType: 'Positive'}, {actType: 'Nuetral'}]}).toArray((err, results) => {
      if (err) console.error(err);
      res.status(200).send(results);
    })
  })
}
