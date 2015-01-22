var Hapi = require('hapi');
var joi = require('joi');
var hostname = require('os').hostname();
var shuffle = require('shuffle-array');
var bcrypt = require('bcrypt');
var uuid = require('uuid');
var db;

var dbOpts = {
	"url": "mongodb://localhost:27017/pooreBingo",
	"settings": {
		"db": {
			"native_parser" : false
		}
	}
};

var port = (hostname == 'jeremyrcox' || hostname == 'poorebingo') ? 80 : 3000;
console.log(hostname, port)

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
    	db = request.server.plugins['hapi-mongodb'].db;

		db.collection('words').find().toArray(function (err, doc){
			reply(shuffle.pick(doc, 25));
		});
    }
});

server.route({
    method: 'GET',
    path: '/words',
    handler: function (request, reply) {
    	db = request.server.plugins['hapi-mongodb'].db;

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

			db = request.server.plugins['hapi-mongodb'].db;
			
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

//User access
server.route({
	method: 'POST',
	path: '/access/register',
	config: {
		handler: function(request, reply){
			var email = request.payload.email;
			var password = request.payload.password;
			var userInfo = request.payload.info;
			delete(userInfo.email);
			delete(userInfo.password);

			bcrypt.genSalt(10, function(err, salt){
				bcrypt.hash(password, salt, function(err, hash){
					if (err){
						return reply(Hapi.error.internal('Error registering', err));
					}else{
						db = request.server.plugins['hapi-mongodb'].db;

						db.collection('users').count({email: email}, function(err, count){
							if (err){
								return reply(Hapi.error.internal('Internal MongoDB error', err));
							}else{
								if(count > 0){
									return reply(Hapi.error.badRequest('User already exists'));
								}
							}
						});

						var newUser = {
							email: email,
							password: hash,
							info: userInfo
						};

						db.collection('users').insert(newUser, function (err, doc){
							if (err){
								return reply(Hapi.error.internal('Internal MongoDB error', err));
							}else{
								delete(doc.password);
								reply(doc);
							}
						});
					}
				});
			});
		},

		validate: {
			payload: {
				email: joi.string().email().required(),
				password: joi.string().required(),
				info: joi.object()
			}
		}
	}
});

server.route({
	method: 'POST',
	path: '/access/login',
	config: {
		handler: function(request, reply){
			var email = request.payload.email;
			var password = request.payload.password;

			db = request.server.plugins['hapi-mongodb'].db;

			db.collection('users').findOne({email: email}, function(err, user){
				if(err){
					return reply(Hapi.error.internal('Internal MongoDB error', err));
				}else{
					bcrypt.compare(password, user.password, function(err, res){
						if(res){
							var token = uuid.v1();

							db.collection('users').update({email: email}, {$set: {'token' : token}}, function(err, response){
								if(err){
									return reply(Hapi.error.internal('Internal MongoDB error', err));
								}else{
									user.token = token;
									delete(user.password);
									reply(user);
								}
							});
						}else{
							return reply(Hapi.error.forbidden());
						}
					});
				}
			});
		},

		validate: {
			payload: {
				email: joi.string().required(),
				password: joi.string().required()
			}
		}
	}
});

server.route({
	method: 'POST',
	path: '/access/logout',
	config: {
		handler: function(request, reply){
			var email = request.payload.email;
			var token = request.payload.token;

			db = request.server.plugins['hapi-mongodb'].db;

			db.collection('users').update({email: email, token: token}, {token: null}, function(err, response){
				if(err){
					return reply(Hapi.error.internal('Internal MongoDB error', err));
				}else{
					reply(response);
				}
			});
		}
	}
})

//Basic file response
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public/app'
        }
    }
});

//Redirects for BOA speed bump 
server.route({
    method: 'GET',
    path: '/accepted-Speed_Bump',
    config: {
        handler: function(request, reply){
            reply.redirect('/');
        }
    }
});

server.route({
    method: 'GET',
    path: '/verify-Speed_Bump',
    config:{
        handler: function(request, reply){
            reply.redirect('/');
        }
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
