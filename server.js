var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var actions = require('./server-controller');
var cookieParser = require('cookie-parser');

app.set('port', (process.env.PORT || 12000));
app.use(express.static(__dirname + '/public'));
// app.use('/favicon', express.static(__dirname + '/public/favicon.ico'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.post('/addActivity', [actions.isUser, actions.addActivity]);
app.get('/activityAverages', actions.getAverages);
app.post('/doActivity', actions.doActivity);
app.get('/activities', actions.activities);
app.get('/badActivities', actions.badActivities);
app.get('/goodActivities', actions.goodActivities);
app.get('/actions', actions.actionsDone);
app.get('/login', actions.login);
app.get('/pastActions', actions.pastActions);
app.post('/actions', actions.updateActions);
app.delete('/deleteActivity', actions.deleteActivity);
app.get('/getRatings', actions.getRatings);
app.post('/checkin', actions.checkin);
app.post('/checkinNotes', actions.checkinNotes);

process.on('uncaughtException', function (err) {
    console.error(err);
});
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
