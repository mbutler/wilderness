
/////////////////////////////////////////////

var entities = [], count = 0;
var io = require("socket.io").listen(8099);

var INITIAL_X = 4;
var INITIAL_Y = 5;
var statusMessage = "connected";

io.set('log level', 1);
io.sockets.on("connection", function (socket) {
    var myNumber = count++;

    //mySelf is an array with count of 3
    //socket.send sends array of 4 (mySelf plus message code)

    statusMessage = "You have entered the wilderness";
    //assign number    
    var mySelf = entities[myNumber] = [myNumber, INITIAL_X, INITIAL_Y];
    console.log("++ENTITY " + myNumber + " CREATED++ " + mySelf);

    //Send the initial position and ID to connecting player
    console.log('I,' + statusMessage + ',' + mySelf[0] + ',' + mySelf[1] + ',' + mySelf[2]);
    socket.send('I,' + statusMessage + ',' + mySelf[0] + ',' + mySelf[1] + ',' + mySelf[2]);

    //Send to conencting client the current state of all the other players
    for (var entity_idx = 0; entity_idx < entities.length; entity_idx++) { //send initial update  
        if (entity_idx != myNumber) {
            entity = entities[entity_idx];
            console.log("inside client update loop: " + entity);
            if (typeof (entity) != "undefined" && entity != null) {

                //console.log('C,' + statusMessage + ',' + entity[1] + ',' + entity[2] + ',' + entity[0]);
                console.log(myNumber + ' sent a C message (in loop) to ' + entity_idx + ' with its position: ' + entity[1] + ',' + entity[2]);
                socket.send('C,' + statusMessage + ',' + entity[1] + ',' + entity[2] + ',' + entity[0]); //send the client that just connected the position of all the other clients 
            }
        }
    }

    //create new entity in all clients    
    socket.broadcast.emit("message",'C,' + statusMessage + ',' + mySelf[0] + ',' + mySelf[1] + ',' + mySelf[2]);
    console.log('creating new entity in client: C,' + statusMessage + ',' + mySelf[0] + ',' + mySelf[1] + ',' + mySelf[2]);
    socket.on("message", function (data) {
        
        console.log('data received: ' + data);
        var new_data = data.split(',');
        if (new_data[0] == 'UM') {
            //console.log(new_data);
            mySelf[0] = new_data[2];
            mySelf[1] = new_data[3];
            mySelf[2] = new_data[4];
            
            //Update all the other clients about my update
            //console.log(mySelf);
            console.log('UM,' + statusMessage + ',' + mySelf[0] + ',' + mySelf[1] + ',' + mySelf[2]);
            socket.broadcast.emit("message",'UM,' + statusMessage + ',' + mySelf[0] + ',' + mySelf[1] + ',' + mySelf[2]);

        }
        else if (new_data[0] == 'S') { // a s message
            var shoot_info = [];
            shoot_info[0] = new_data[1]; //ini x
            shoot_info[1] = new_data[2]; //ini y

            shoot_info[2] = new_data[3]; //degrees

            //Update all the other clients about my update
            socket.broadcast.emit("message",
			'S,' + mySelf[0] + ',' + shoot_info[0] + ',' + shoot_info[1] + ',' + shoot_info[2]);
        }
    });

});

//"UM," & str(initMessage.Text) & "," & int() & "," & int() & "," & int()

