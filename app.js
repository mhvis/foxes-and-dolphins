var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

var game = {};

function gameType1(size) {
    game.board = [];
    game.foxes = [];
    game.dolphins = [];
    game.turn = (Math.floor(Math.random() * 2) === 0) ? 'fox' : 'dolphin';
    tideState = size / 2;
    var foxes = [];
    var dolphins = [];
    for (var y = 0; y < size; y++) {
        game.board.push([]);
        for (var x = 0; x < size; x++) {
            game.board[y][x] = (x < size / 2) ? 'l' : 'w';
            if (x < size / 2) {
                foxes.push({ x: x, y: y });
            } else {
                dolphins.push({ x: x, y: y });
            }
        }
    }
    for (var i = 0; i < size; i++) {
        var foxIndex = Math.floor(Math.random() * foxes.length);
        var dolphinIndex = Math.floor(Math.random() * dolphins.length);
        game.foxes.push(foxes[foxIndex]);
        game.dolphins.push(dolphins[dolphinIndex]);
        foxes.splice(foxIndex, 1);
        dolphins.splice(dolphinIndex, 1);
    }
}
gameType1(8);

var tideState;

function tide() {
    var action = Math.floor(Math.random() * 3);
    if (action === 0 && tideState > 1) {
        tideState--;
    } else if (action === 1 && tideState < game.board.length - 1) {
        tideState++;
    }
    game.board.forEach(function(row) {
        for (var i = 0; i < row.length; i++) {
            row[i] = (i < tideState) ? 'l' : 'w';
        }
    });
}

io.on('connection', function(socket) {
    socket.emit('game', game);

    socket.on('newGame', function(size) {
        gameType1(size);
        io.emit('game', game);
    });

    socket.on('action', function(action) {
        var animals = (game.turn == 'foxes') ? game.foxes : game.dolphins;
        var animalIndex = -1;
        animals.forEach(function(animal, index) {
            if (action.from.x == animal.x && action.from.y == animal.y) {
                animalIndex = index;
            }
        });
        // Skip when animal was not found
        if (animalIndex == -1) {
            return;
        }
        animals[animalIndex].x = action.to.x;
        animals[animalIndex].y = action.to.y;
        // If attacking, remove other animal
        var otherAnimals = (game.turn == 'foxes') ? game.dolphins : game.foxes;
        var otherAnimalIndex = -1;
        otherAnimals.forEach(function(otherAnimal, index) {
            if (animals[animalIndex].x == otherAnimal.x &&
                animals[animalIndex].y == otherAnimal.y) {
                otherAnimalIndex = index;
            }
        });
        if (otherAnimalIndex != -1) {
            if (game.board[animals[animalIndex].y][animals[animalIndex].x] == 'w') {
                game.foxes.splice((game.turn == 'foxes') ? animalIndex :
                    otherAnimalIndex, 1);
            } else {
                game.dolphins.splice((game.turn == 'dolphins') ? animalIndex :
                    otherAnimalIndex, 1);
            }
        }
        // Update turn
        game.turn = (game.turn == 'foxes') ? 'dolphins' : 'foxes';
        // Apply tide
        tide();
        // Send new board
        io.emit('game', game);
    });
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var host = process.env.OPENSHIFT_NODEJS_IP || false;

server.listen(port, host, function() {
    console.log('Listening on ' + host + ':' + port);
});
