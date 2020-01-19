var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const nsp = io.of('/nsp');


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/userpage', function(req, res){
	res.sendFile(__dirname + '/userpage.html');
});

app.get('/serverpage', function(req, res){
	res.sendFile(__dirname + '/serverpage.html');
});

servers = [];

io.on('connection', function(socket,roomName){
	socket.on('adduser', function(roomName){
		//CHECK IF SERVERS CONTAINS ROOMNAME
		console.log(servers,roomName);
		if(servers.includes(roomName)){
			console.log(servers,roomName);
			socket.join(roomName);
			socket.room = roomName;
			// echo to client they've connected
			// socket.emit('updatechat', 'SERVER', 'you have connected to room1');
			// echo to room 1 that a person has connected to their room
			socket.broadcast.to(roomName).emit('chat message', 'someone has connected to this room');
			return true;
		}
		else{
			return false;
		}
		

	});
	socket.on('addserver', function(roomName){
		servers.push(roomName);
		console.log(servers);
		socket.join(roomName);
		socket.room = roomName;
		// echo to client they've connected
		// socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(roomName).emit('chat message', 'someone has connected to this room');
	});

	socket.on('chat message', function(msg){
		//console.log("message content = "+msg);
		//save to database or memory
		io.sockets.in(socket.room).emit('chat message', msg);
	});
});




http.listen(3000, function(){
	console.log('listening on *:3000');
});