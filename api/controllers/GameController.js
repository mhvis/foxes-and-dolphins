/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function(req, res) {
		var width = req.param("width");
		var height = req.param("height");
		var animalCount = req.param("animalCount");
		Game.new(width, height, animalCount, function(err, game) {
			if (err) {
				return res.serverError(err);
			}
			res.ok(game);
		});
	},
	
};

