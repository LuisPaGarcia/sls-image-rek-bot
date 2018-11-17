//@ts-check
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGOURL;

function update() {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			var dbo = db.db('serverless');
			dbo.collection('twits').updateMany({ treated: 'n' }, { $set: { treated: 'y' } }, function(err, res) {
				if (err) reject(err);
				console.log(res.result.nModified);
				db.close();
				resolve(res);
			});
		});
	});
}

module.exports.update = update;
