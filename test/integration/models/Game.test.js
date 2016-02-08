var should = require('should');

describe('GameModel', function() {

    describe('#new()', function() {
        it('shall create a new game instance', function(done) {
            Game.new(10, 10, 5, function(err, game) {
                if (err) {
                    return done(err);
                }
                game.should.have.property('id');
                Game.find({
                        id: game.id
                    }).populateAll().exec(function(err, game) {
                        if (err) {
                            return done(err);
                        }
                        game[0].should.have.property('cells').with.lengthOf(100);
                        game[0].should.have.property('players').with.lengthOf(0);
                        game[0].should.have.property('animals').with.lengthOf(5);
                        done();
                    });
            });
        });
    });

});
