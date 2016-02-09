var feathers = require('feathers');
var bodyParser = require('body-parser');
var memory = require('feathers-memory');

var app = feathers();

app.configure(feathers.rest());
app.configure(feathers.socketio());

app.use(bodyParser.json());

app.use('/game', memory());

app.use('/', feathers.static(__dirname + '/public'));

app.listen(3000, function() {
    console.log('Listening');
});