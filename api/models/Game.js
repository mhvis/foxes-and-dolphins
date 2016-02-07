/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Noise = require('noisejs');

module.exports = {
    attributes: {
        boardWidth: {
            type: 'integer',
            required: true,
            min: 2,
            max: 100
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
        Game.create();
        Cell.create({
            game: id,
            type: 'water'
        });
    }
};

/**
 * Generates a board with water and land cells using simplex or Perlin noise.
 * @param  {Number}  width  Width of board.
 * @param  {Number}  height Height of board.
 * @param  {Boolean} perlin When true, Perlin noise is used instead of simplex
 * noise.
 * @param  {Number}  land   The percentage of land cells as a value between 0
 * and 1.
 * @return {Array}   A two-dimensional array with for each cell either the
 * string 'water' or the string 'land'.
 */
function generateBoardNoise(width, height, perlin, land) {
    var board = [];
    var noise = new Noise(Math.random());
    var landMax = land * 2 - 1;
    for (var x = 0; x < width; x++) {
        board[x] = [];
        for (var y = 0; y < height; y++) {
            var value;
            if (perlin) {
                value = noise.perlin2(x,y);
            } else {
                value = noise.simplex2(x, y);
            }
            var cell = (value <= landMax) ? 'land' : 'water';
            board[x][y] = cell;
        }
    }
}
