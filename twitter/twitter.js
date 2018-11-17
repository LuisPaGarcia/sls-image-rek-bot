const Twit = require('twit');
const Insert = require('../mongo/insert');

var T = new Twit({
	consumer_key: process.env.CONSUMERKEY,
	consumer_secret: process.env.CONSUMERSECRET,
	access_token: process.env.ACCESSTOKENKEY,
	access_token_secret: process.env.ACCESSTOKENSECRET
});

function Init() {
	return new Promise((resolve, reject) => {
		T.get('account/verify_credentials', {
			include_entities: false,
			skip_status: true,
			include_email: false
		}).then((data) => {
			console.log('Successful login...');
			T.get('search/tweets', { q: `@${process.env.USERNAME}`, count: 100 })
				.then(async ({ data }) => {
					await Promise.all(
						data.statuses.map(async (status) => {
							await Insert.insert({
								tweet: status,
								id: status.id_str,
								treated: 'n',
								image: status.entities.media ? status.entities.media[0].media_url : 'NO IMAGE'
							});
						})
					);
					resolve(true);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	});
}

function respondTweet(tweet, text) {
	return new Promise((resolve, reject) => {
		var name = tweet.user.screen_name;
		var nameID = tweet.id_str;

		var reply = `Image Recognition Bot

${text}

@${name} thanks for participate! 🤖`;
		var params = {
			status: reply,
			in_reply_to_status_id: nameID
		};

		T.post('statuses/update', params, function(err, data, response) {
			if (err !== undefined) {
				console.log(err);
				reject(err);
			} else {
				console.log('Tweeted: ' + params.status);
				resolve('Tweeted: ' + params.status);
			}
		});
	});
}

module.exports.respondTweet = respondTweet;
module.exports.Init = Init;
