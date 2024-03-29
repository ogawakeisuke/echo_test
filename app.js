
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

server = http.createServer(app);
var socketio = require('socket.io');
var io = socketio.listen(server);

server.listen(app.get('port'), function(){
  console.log("server listening on port " + app.get('port'));
});


io.sockets.on('connection', function (socket) {
  console.log('接続');
 
  socket.on('msg', function (data) {
    console.log(data);
    // 送信者以外全員にメッセージを配信
    socket.broadcast.emit('message', data);
    // 送信者にメッセージを配信
    io.sockets.emit('message', data);
  });

  socket.on('remote_msg', function (data) {
    console.log(data);
    // 送信者以外全員にメッセージを配信
    socket.broadcast.emit('message', data);
    // 送信者にメッセージを配信
    io.sockets.emit('message', data);
  });
 
  socket.on('disconnect', function () {
    socket.broadcast.emit('announcement', 'ユーザが切断しました');
  });
});