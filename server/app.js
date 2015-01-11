var Hapi = require('hapi');
var joi = require('joi');
var hostname = require('os').hostname
var shuffle = require('shuffle-array');

var dbOpts = {
	"url": "mongodb://localhost:27017/pooreBingo",
	"settings": {
		"db": {
			"native_parser" : false
		}
	}
};

var port = (hostname == 'jeremyrcox') ? 80 : 3000;

var server = new Hapi.Server(port);

server.pack.register({
	plugin: require('hapi-mongodb'),
	options: dbOpts
}, function(err){
	if(err){
		console.log(err);
		throw err;
	} 
});

server.route({
    method: 'GET',
    path: '/game',
    handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
		
		db.collection('words').find().toArray(function (err, doc){
			reply(shuffle.pick(doc, 25));
		});
    }
});

server.route({
    method: 'GET',
    path: '/words',
    handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
		
		db.collection('words').find().toArray(function (err, doc){
			reply(doc);
		});
    }
});

server.route({
	method: 'POST',
	path: '/words',
	config: {
		handler: function (request, reply) {
			var newWord = {
				word: request.payload.word,
			};
			
			var db = request.server.plugins['hapi-mongodb'].db;
			db.collection('words').insert(newWord, {w:1}, function (err, doc){
				if (err){
					return reply(Hapi.error.internal('Internal MongoDB error', err));
				}else{
					reply(doc);
				}
			});
		},
		
		validate: {
			payload: {
				word: joi.string().required()
			}
		}
	}
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public/app'
        }
    }
});
 
server.start(function () {
    console.log('Server running at:', server.info.uri);
});