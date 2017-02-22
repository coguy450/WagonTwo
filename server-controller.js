const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
// const connectionString = 'mongodb://localhost/wagon2';
const connectionString = 'mongodb://coguy450:Col2nago@ds033086.mlab.com:33086/wagontwo'
const cookie = require('cookie');
const ObjectID = require('mongodb').ObjectID;

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


function convertToObjectId(idIn) {
  let aId;
  try {
      aId = new ObjectID(idIn);
  }
  catch(err) {
      console.log(err);
      aId = false;
  }
  return aId;
}

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
    activity.find({$or: [{actType: 'Negative'}, {actType: 'Nuetral'}]}).toArray((err, results) => {
      if (err) res.status(400).send(err);
      console.log(results);
      res.status(200).send(results);
    })
  })
}
exports.goodActivities = (req, res) => {
  conMongo((db) => {
    var activity = db.collection('activities');
    activity.find().toArray((err, results) => {
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
  const unratedAct = {email: uEmail, $or: [{rating: {$exists: false}}, {desc: {$exists: false}}]};
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.find(unratedAct).toArray((err, results) => {
      if (err) console.error(err);
      res.status(200).send(results);
    })
  })
}

exports.updateActions = (req, res) => {
  const uEmail = eatCookie(req);
  const unratedAct = {email: uEmail, $or: [{rating: {$exists: false}}, {desc: {$exists: false}}]};
  const oId = convertToObjectId(req.body._id);
  conMongo((db) => {
    var actions = db.collection('actions');
    delete req.body._id;
    actions.updateOne({_id: oId}, req.body, (uErr, uRes) => {
      if (uErr) console.log(uErr);
      else console.log(uRes.result);
      actions.find(unratedAct).toArray((fErr, fResults) => {
        res.status(200).send(fResults);
      })
    })
  })
}

exports.pastActions = (req, res) => {
  const uEmail = eatCookie(req);
  const unratedAct = {email: uEmail, $or: [{rating: {$exists: true}}, {desc: {$exists: true}}]};
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.find(unratedAct).toArray((err, results) => {
      if (err) console.error(err);
      res.status(200).send(results);
    })
  })
}

exports.getRatings = (req, res) => {
  const uEmail = eatCookie(req);
  conMongo((db) => {
    const actions = db.collection('actions');
    actions.aggregate([{ $match: {user: uEmail}},
       {$group: {_id: '$actName',
            Avg: { $avg: '$rating'}
        }}, {$sort: {Avg: 1}}
      ], function (err, results) {
          res.send({success:true, ratings: results});
      });
  })
}

exports.checkin = (req, res) => {
  const newCheckin = req.body;
  const uEmail = eatCookie(req);
  newCheckin.date = new Date();
  newCheckin.user = uEmail;
  conMongo((db) => {
    const checkins = db.collection('checkins');
    checkins.insert(newCheckin, (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(result)
      }
    });
  })
}

exports.checkinNotes = (req, res) => {
  const newCheckin = req.body;
  const uEmail = eatCookie(req);
  newCheckin.date = new Date();
  newCheckin.user = uEmail;
  conMongo((db) => {
    const checkins = db.collection('checkins');
    checkins.insert(newCheckin, (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(result)
      }
    });
  })
}

exports.login = (req, res) => {
  res.cookie('wagon',{email: 'coguy450@gmail.com'}, {maxAge: 604800000, httpOnly: true, path: '/'}).status(200).send('You are logged in dude');
}
