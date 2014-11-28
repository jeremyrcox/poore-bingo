module.exports ={
	game: function(request, replay){
		var db = request.server.plugins['hapi-mongodb'].db;
		
		db.collection('words').find().toArray(function (err, doc){
			reply(shuffle.pick(doc, 25));
		});
	}
};