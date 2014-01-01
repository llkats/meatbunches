var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var jade = require('jade');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.set('port', 80);
  app.set('views', __dirname + '/views');
  app.engine('jade', require('jade').__express);
});

var io = require('socket.io').listen(app.listen(app.get('port')));

app.get('/', function(req, res){
  res.render('layout.jade');
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


var socketClient = require('socket.io-client');
var socket = socketClient.connect('https://chat.meatspac.es');

socket.on('message', function(data) {
  io.sockets.emit('newmeat', { meat: data });
});
