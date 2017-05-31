var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var connectionString = process.env.PROD_MONGODB ? process.env.PROD_MONGODB : 'mongodb://localhost/test';

var cookie = require('cookie');
var ObjectID = require('mongodb').ObjectID;
var request = require('superagent')
var apiKey = '400f0ae9826281a7931208be31f9bee76a1c8633'
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
  var aId;
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
  var cookieIn = reqIn.headers.cookie;
  var thisCookie = cookie.parse(cookieIn);
  thisCookie = thisCookie['wagon'];
  var subCookie = thisCookie.substring(12,thisCookie.length -2);
  return subCookie;
}

exports.isUser = (req, res, next) => {
  var cookieIn = req.headers.cookie;
  if (cookieIn) {
    var thisCookie = cookie.parse(cookieIn);
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
exports.getAverages = (req, res) => {
  console.time('avg');
  var uEmail = eatCookie(req);
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.aggregate([{$match: {user: uEmail}},{ $group: {_id: '$actName',Avg: { $avg: '$rating'}}}])
    .toArray((err, accts) => {
      console.timeEnd('avg');
      res.status(200).send(accts);
      console.log( accts);
    })
  });
}
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
    var uEmail = eatCookie(req);
  } catch (err){
    console.log('this guy needs a cookie and he should log in');
  }
  var actDone = req.body.actName;
  conMongo((db) => {
    var activity = db.collection('actions');
      activity.insert(req.body, (err, result) => {

      //  console.log(err, result);
        if (err) {
          res.status(400).send(err);
        } else {
          activity.find({actName: actDone, rating: {$exists: true}, desc: {$exists: true}}).toArray((fErr, prevNotes) => {
            res.status(200).send(prevNotes);
          })
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
  var uEmail = eatCookie(req);
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.remove({email: uEmail, _id: req.query.actId}, {justOne: true}, (delResult) => {
      if (err) console.error(err);
      else res.status(200).send(results);
    })
  })
}
exports.actionsDone = (req, res) => {
  var uEmail = eatCookie(req);
  var unratedAct = {email: uEmail, $or: [{rating: {$exists: false}}, {desc: {$exists: false}}]};
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.find(unratedAct).toArray((err, results) => {
      if (err) console.error(err);
      res.status(200).send(results);
    })
  })
}
exports.updateActions = (req, res) => {
  var uEmail = eatCookie(req);
  var unratedAct = {email: uEmail, $or: [{rating: {$exists: false}}, {desc: {$exists: false}}]};
  var oId = convertToObjectId(req.body._id);
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
  var uEmail = eatCookie(req);
  var unratedAct = {email: uEmail, $or: [{rating: {$exists: true}}, {desc: {$exists: true}}]};
  conMongo((db) => {
    var actions = db.collection('actions');
    actions.find(unratedAct).toArray((err, results) => {
      if (err) console.error(err);
      res.status(200).send(results);
    })
  })
}
exports.getRatings = (req, res) => {
  var uEmail = eatCookie(req);
  conMongo((db) => {
    var actions = db.collection('actions');
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
  var newCheckin = req.body;
  var uEmail = eatCookie(req);
  newCheckin.date = new Date();
  newCheckin.user = uEmail;
  conMongo((db) => {
    var checkins = db.collection('checkins');
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
  var newCheckin = req.body;
  var uEmail = eatCookie(req);
  newCheckin.date = new Date();
  newCheckin.user = uEmail;
  conMongo((db) => {
    var checkins = db.collection('checkins');
    checkins.insert(newCheckin, (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(result)
      }
    });
  })
}
exports.checkVideos = (req, res) => {
  // Guidebox API key: 400f0ae9826281a7931208be31f9bee76a1c8633
  var searchType = req.body.type
  var queryString = req.body.queryString
  request
   .get('http://api-public.guidebox.com/v2/search?api_key=400f0ae9826281a7931208be31f9bee76a1c8633')
   .query({ type: searchType })
   .query({ query: queryString })
   .end(function(err, response){
     if (err) {
       console.log(err)
     } else {
       res.status(200).send(response.body)
     }
   });
}

exports.specificShow = (req, res) => {
  var searchId = req.body.searchId;
  var searchType;
  if (req.body.type === 'movie') {
    searchType = 'movies'
  } else if (req.body.type === 'show') {
    searchType = 'shows'
  }
  // /v2/shows/{id}?sources=free,subscription
  request
   .get('http://api-public.guidebox.com/v2/' + searchType + '/' + searchId)
   .query({api_key: apiKey})
   .query({ sources: 'free,subscription' })
   .end(function(err, response){
     if (err) {
       console.log(err)
     } else {
       res.status(200).send(response.body)
     }


   });
}

exports.login = (req, res) => {
  res.cookie('wagon',{email: 'coguy450@gmail.com'}, {maxAge: 604800000, httpOnly: true, path: '/'}).status(200).send('You are logged in dude');
}
