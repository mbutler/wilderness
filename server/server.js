var io = require("socket.io").listen(8099);
io.set('log level', 1);

io.sockets.on("connection", function (socket) {	
	console.log('connected');

	socket.send('I,' + 'You have entered the wilderness');

	socket.on("message", function (data) {
		var new_data = data.split(',');
		console.log(new_data[1]);

	});

});