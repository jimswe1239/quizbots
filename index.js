var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const nsp = io.of('/nsp');


app.get('/', function(req, res){
	res.sendFile(__dirname + '/mainpage.html');
});

app.get('/room', function(req, res){
	res.sendFile(__dirname + '/room.html');
});

io.on('connection', function(socket,roomName){
	socket.on('adduser', function(roomName){
		socket.join(roomName);
		socket.room = roomName;
		// echo to client they've connected
		// socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(roomName).emit('chat message', 'someone has connected to this room');
	});

	socket.on('chat message', function(msg){
		io.sockets.in(socket.room).emit('chat message', msg);
	});
});




http.listen(3000, function(){
	console.log('listening on *:3000');
});