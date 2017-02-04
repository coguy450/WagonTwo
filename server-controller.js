var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var connectionString = 'mongodb://localhost/wagon2';
var cookie = require('cookie');

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
function eatCookie(reqIn) {
  const cookieIn = reqIn.headers.cookie;
  let thisCookie = cookie.parse(cookieIn);
  thisCookie = thisCookie['wagon'];
  const subCookie = thisCookie.substring(12,thisCookie.length -2);
  return subCookie;
}

exports.isUser = (req, res, next) => {
  const cookieIn = req.headers.cookie;
  if (cookieIn) {
    let thisCookie = cookie.parse(cookieIn);
    thisCookie = thisCookie['wagon'];
    console.log('testing security', thisCookie);
    if (thisCookie) {
      next()
    } else {
      res.status(403).send('You are not authorized');
    }
  } else {
    res.status(403).send('You are not authorized');
  }
};

exports.addActivity = (req, res) => {
  console.log('adding activity');
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
  try {
    const uEmail = eatCookie(req);
  } catch (err){
    console.log('this guy needs a cookie and he should log in');
  }

  conMongo((db) => {
    var activity = db.collection('actions');
      activity.insert(req.body, (err, result) => {
      //  console.log(err, result);
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
exports.deleteActivity = (req, res) => {
  const uEmail = eatCookie(req);
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.remove({email: uEmail, _id: req.query.actId}, {justOne: true}, (delResult) => {
      if (err) console.error(err);
      else res.status(200).send(results);
    })
  })
}
exports.actionsDone = (req, res) => {
  const uEmail = eatCookie(req);
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.find({email: uEmail}).toArray((err, results) => {
      if (err) console.error(err);
      res.status(200).send(results);
    })
  })
}

exports.updateActions = (req, res) => {
  const uEmail = eatCookie(req);
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.updateOne({_id: req.body._id}, req.body, (uErr, uRes) => {
      console.log();
    })
  })
}

exports.login = (req, res) => {
  res.cookie('wagon',{email: 'coguy450@gmail.com'}, {maxAge: 604800000, httpOnly: true, path: '/'}).status(200).send('You are logged in dude');
}
