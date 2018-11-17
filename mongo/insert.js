//@ts-check

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGOURL;

const insert = (values) => {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, { useNewUrlParser: true })
			.then(function(db) {
				var dbo = db.db('serverless');
				var myobj = values;

				var myquery = { id: values.id };
				var update = { $setOnInsert: values };
				var config = {
					upsert: true
				};

				dbo.collection('twits').updateOne(myquery, update, config, function(err, res) {
					if (err) throw err;
					console.log('Success');
					db.close();
					resolve(res);
				});
			})
			.catch(function(err) {
				console.error(err);
				reject(err);
			});
	});
};

module.exports.insert = insert;
