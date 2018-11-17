//@ts-check
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGOURL;
var DB = require('./insert');
var UP = require('./update');
const get = () => {
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, { useNewUrlParser: true })
			.then(function(db) {
				var dbo = db.db('serverless');

				dbo.collection('twits').find({ treated: 'n', image: { $ne: 'NO IMAGE' } }).toArray(function(err, res) {
					if (err) throw err;
					db.close();
					UP.update()
						.then((data) => {
							resolve(res);
						})
						.catch((error) => {
							console.log(error);
						});
				});
			})
			.catch(function(err) {
				console.error(err);
				reject(err);
			});
	});
};

module.exports.get = get;
