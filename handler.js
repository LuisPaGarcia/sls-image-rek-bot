//@ts-check
const twitter = require("./twitter/twitter");
const reko = require('./rekognition/rekognition-api');
const getFromDB = require('./mongo/get');

const load = async() => {
	try {
		console.log('INIT');
		const a = await twitter.Init();
		const b = await getFromDB.get();
		if (b.length > 0) {
			await Promise.all(
				b.map(async (r) => {
					const c = await reko.urlToLabels(r.image);
					const d = await twitter.respondTweet(r.tweet, c);
					console.log(d);
				})
			);
		}
		console.log('END');
	} catch (error) {
		console.error({ error });
	}
};

module.exports.imagebot = load;


load();
