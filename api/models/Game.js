/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var PerlinGenerator = require('proc-noise');
var async = require('async');

var MIN_BOARD_SIZE = 2;
var MAX_BOARD_SIZE = 100;
var MIN_START_ANIMALS = 1;
var MAX_START_ANIMALS = 100;

module.exports = {
    attributes: {
        boardWidth: {
            type: 'integer',
            required: true,
            min: MIN_BOARD_SIZE,
            max: MAX_BOARD_SIZE
        },
        cells: {
            collection: 'cell',
            via: 'game'
        },
        players: {
            collection: 'player',
            via: 'game'
        },
        animals: {
            collection: 'animal',
            via: 'game'
        }
    },

    new: function(width, height, animalCount, cb) {
        if (width < MIN_BOARD_SIZE || width > MAX_BOARD_SIZE ||
            height < MIN_BOARD_SIZE || height > MAX_BOARD_SIZE ||
            animalCount < MIN_START_ANIMALS || animalCount > MAX_START_ANIMALS) {
            return cb('Invalid arguments.');
        }
        async.waterfall([
            function(cb) {
                Game.create({
                    boardWidth: width
                }).exec(cb);
            },
            function(game, cb) {
                createCells(game, width, height, cb);
            },
            function(game, cells, cb) {
                createAnimals(game, cells, animalCount, cb);
            }
        ], function(err, game) {
            cb(err, game);
        });
    }
};


function createAnimals(game, cells, animalCount, cb) {
    return cb(false, game);
}

/**
 * Creates board cells using the board noise generator.
 * @param  {Object}   game   The game record to link to the cells.
 * @param  {Number}   width  Width of board.
 * @param  {Number}   height Height of board.
 * @param  {Function} cb     Called after creation, has possible error
 * parameter.
 * @return {Void}
 */
function createCells(game, width, height, cb) {
    var board = generateBoardNoise(width, height, 0.29);
    var records = [];
    var recordCount = width * height;
    for (var i = 0; i < recordCount; i++) {
        var x = i % width;
        var y = Math.floor(i / width);
        records[i] = {
            game: game,
            type: board[x][y]
        };
    }
    Cell.create(records).exec(function(err, cells) {
        cb(err, game, cells);
    });
}

/**
 * Generates a board with water and land cells using simplex or Perlin noise.
 * @param  {Number}  width  Width of board.
 * @param  {Number}  height Height of board.
 * @param  {Number}  land   The percentage of land cells as a value between 0
 * and 1.
 * @return {Array}   A two-dimensional array with for each cell either the
 * string 'water' or the string 'land'.
 */
function generateBoardNoise(width, height, land) {
    var board = [];
    var perlin = new PerlinGenerator();
    for (var x = 0; x < width; x++) {
        board[x] = [];
        for (var y = 0; y < height; y++) {
            var value = perlin.noise(x, y);
            var cell = (value <= land) ? 'land' : 'water';
            board[x][y] = cell;
        }
    }
    return board;
}
