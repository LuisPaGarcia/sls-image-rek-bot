const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition({ region: 'eu-west-1' });
const fetch = require('node-fetch');

const imageToData = (url) => {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then((data) => {
				data
					.buffer()
					.then((buff) => {
						resolve(buff);
					})
					.catch((error) => {
						console.log({ error });
						reject(error);
					});
			})
			.catch((error) => {
				console.log({ error });
				reject(error);
			});
	});
};

const init = (url) => {
	return new Promise((resolve, reject) => {
		imageToData(url)
			.then((buff) => {
				const params = {
					MaxLabels: process.env.MAXLABELS,
					MinConfidence: process.env.MINCONFIDENCE,
					Image: {
						Bytes: buff
					}
				};

				rekognition.detectLabels(params, function(err, data) {
					if (err) {
						console.log({ err, stack: err.stack });
						reject(err);
					} else {
						resolve(data);
					}
				});
			})
			.catch((error) => {
				console.log({ error });

				reject(error);
			});
	});
};

function urlToLabels(url) {
	return new Promise((resolve, reject) => {
		init(url)
			.then((data) => {
				let string = '';
				let dec = data.Labels.forEach((e) => {
					string += `${e.Name}: ${parseInt(e.Confidence)}%
`;
				});

				let tweet = `
This photo have:

${string} 
`;
				resolve(tweet);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports.urlToLabels = urlToLabels;
