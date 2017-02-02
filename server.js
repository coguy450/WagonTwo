var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var fs = require('fs');

var cookieParser = require('cookie-parser');
var connectionString = 'mongodb://localhost/wagon2';
var actions = require('./server-controller');

app.set('port', (process.env.PORT || 12000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.post('/addActivity', [actions.isUser, actions.addActivity]);
app.post('/doActivity', actions.doActivity);
app.get('/activities', actions.activities);
app.get('/badActivities', actions.badActivities);
app.get('/goodActivities', actions.goodActivities);
app.get('/actions', actions.actionsDone);
app.get('/login', actions.login);
app.post('/actions', actions.updateActions);
app.delete('/deleteActivity', actions.deleteActivity);

process.on('uncaughtException', function (err) {
    console.error(err);
});
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
