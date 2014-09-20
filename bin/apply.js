var readline = require('readline');
var Q = require('q');
var needle = require('needle');
var APISpec = require('../lib/api_spec');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Generate array of API functions
var API = APISpec.map(function (fn) {
	return fn.bind(null, rl);
});


// Call each one returning an array
API.reduce(Q.when, Q([])).then(function (responses) {
	rl.close();

	var options = {
		headers: { 'X-Submitted-With': 'perka-jobs-api' }
	};
	var postObj = responsesToObject(responses);

	needle.post("https://httpbin.org/post", JSON.stringify(postObj), options, function (err, response) {
		console.log(response);
	});
});

function responsesToObject (responses) {
	return responses.reduce(function (obj, response) {
		if (response.hasData) {
			obj[response.field] = response.data;
		}
		return obj;
	}, {});
}
