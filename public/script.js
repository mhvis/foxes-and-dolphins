var socket = io.connect();

var $board = $('#board');

function updateGui(game) {
    var $cells = initBoard(game.board);
    setBoard(game.board, $cells);
    setAnimals(game, $cells);
    setTurn(game, $cells);
}

function initBoard(board) {
    $board.empty();
    var $cells = [];
    for (var y = 0; y < board.length; y++) {
        var $row = $('<div/>', { class: 'board-row' });
        $board.append($row);
        $cells.push([]);
        for (var x = 0; x < board[y].length; x++) {
            $cells[y][x] = $('<div/>', { class: 'board-cell' });
            $row.append($cells[y][x]);
        }
    }
    return $cells;
}

function setBoard(board, $cells) {
    for (var y = 0; y < board.length; y++) {
        for (var x = 0; x < board[y].length; x++) {
            var type = (board[y][x] == 'w') ? 'water' : 'land';
            var otherType = (type == 'water') ? 'land' : 'water';
            $cells[y][x].removeClass('board-cell-' + otherType);
            $cells[y][x].addClass('board-cell-' + type);
        }
    }
}

function setAnimals(game, $cells) {
    var foxes = game.foxes;
    var dolphins = game.dolphins;
    $cells.forEach(function(row) {
        row.forEach(function($cell) {
            $cell.removeClass('board-cell-fox');
            $cell.removeClass('board-cell-dolphin');
        });
    });
    $foxes = [];
    $dolphins = [];
    foxes.forEach(function(fox) {
        $cells[fox.y][fox.x].addClass('board-cell-fox');
        $foxes.push($cells[fox.y][fox.x]);
    });
    dolphins.forEach(function(dolphin) {
        $cells[dolphin.y][dolphin.x].addClass('board-cell-dolphin');
        $dolphins.push($cells[dolphin.y][dolphin.x]);
    });
}

function setTurn(game, $cells) {
    $('#spanTurn').text(game.turn);

    function cellAction(loc, isFox) {
        $cells[loc.y][loc.x].hover(function() {
            $(this).addClass('board-cell-hover');
        }, function() {
            $(this).removeClass('board-cell-hover');
        });
        $cells[loc.y][loc.x].click(function() {
            $(this).addClass('board-cell-selected');
            var dirs = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
            dirs.forEach(function(dir) {
                if (loc.x + dir.x < 0 || loc.x + dir.x >= $cells.length ||
                    loc.y + dir.y < 0 || loc.y + dir.y >= $cells[0].length) {
                    return;
                }
                var $cell = $cells[loc.y + dir.y][loc.x + dir.x];
                if (isFox && $cell.hasClass('board-cell-fox') ||
                    !isFox && $cell.hasClass('board-cell-dolphin')) {
                    return;
                }
                $cell.addClass('board-cell-selectable');
                $cell.click(function() {
                    socket.emit('action', { from: loc, to: { x: loc.x + dir.x, y: loc.y + dir.y } });
                });
            });
        });
    }
    if (game.turn == 'foxes') {
        game.foxes.forEach(function(fox) {
            cellAction(fox, true);
        });
    } else {
        game.dolphins.forEach(function(dolphin) {
            cellAction(dolphin, false);
        });
    }
}

socket.on('game', function(game) {
    console.log(game);
    updateGui(game);
});

$('#btnNewGame').click(function() {
    socket.emit('newGame', $('#inputNewGameSize').val());
});
