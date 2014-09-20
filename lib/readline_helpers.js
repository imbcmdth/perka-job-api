var fs = require('fs');
var Q = require('q');

function stringHandler (options, readLine, response) {
	var deferred = Q.defer();
	var question = options.desc;

	if (options.required) {
		question += ": ";
		getNonEmptyString(question, options.field, readLine, deferred, response);
	} else {
		question += " [enter to skip]: "
		getPossiblyEmptyString(question, options.field, readLine, deferred, response);
	}

	return deferred.promise;
}

function getPossiblyEmptyString (question, field, readLine, deferred, response) {
	readLine.question(question, function (answer) {
		if (answer.length < 1) {
			respond(field, false, null, deferred, response);
		} else {
			respond(field, true, answer, deferred, response);
		}
	});
}

function getNonEmptyString (question, field, readLine, deferred, response) {
	readLine.question(question, function (answer) {
		if (answer.length < 1) {
			console.log ('An answer is required!');
			setImmediate(getNonEmptyString, question, field, readLine, deferred, response);
		} else {
			respond(field, true, answer, deferred, response);
		}
	});
}

function arrayOfStringsHandler (options, readLine, response) {
	var deferred = Q.defer();
	var question = options.desc;
	var store = [];

	question += " [enter an empty line to end]: "

	getArrayOfString(question, options.field, options.required, store, readLine, deferred, response);

	return deferred.promise;
}

function getArrayOfString (question, field, required, store, readLine, deferred, response) {
	readLine.question(question, function (answer) {
		if (answer.length < 1) {
			if (required) {
				if (store.length < 1) {
					console.log ('At least one answer is required!');
					setImmediate(getArrayOfString, question, field, required, store, readLine, deferred, response);
				} else {
					respond(field, true, store, deferred, response);
				}
			} else {
				if (store.length < 1) {
					respond(field, false, store, deferred, response);
				} else {
					respond(field, true, store, deferred, response);
				}
			}
		} else {
			store.push(answer);
			setImmediate(getArrayOfString, question, field, required, store, readLine, deferred, response);
		}
	});
}

function respond (field, hasData, data, deferred, response) {
	response.push({
		field: field,
		data: data,
		hasData: hasData
	});

	deferred.resolve(response);
}

function fileHandler (options, readLine, response) {
	var deferred = Q.defer();
	var question = options.desc;
	var store = [];

	question += " [enter a file name]: "

	if (options.required) {
		getFileAsBase64(question, options.field, readLine, deferred, response);
	} // TODO: Optional?

	return deferred.promise;
}

function getFileAsBase64(question, field, readLine, deferred, response) {
	readLine.question(question, function (answer) {
		if (answer.length < 1) {
			console.log ('A file is required!');
			setImmediate(getFileAsBase64, question, field, readLine, deferred, response);
		} else {
			fs.readFile(answer, function (err, data){
				if (err) {
					console.log ('An error occured reading file!');
					setImmediate(getFileAsBase64, question, field, readLine, deferred, response);
				} else {
					respond(field, true, data.toString('base64'), deferred, response);
				}
			});
		}
	});
}

module.exports = {
	stringHandler: stringHandler,
	fileHandler: fileHandler,
	arrayOfStringsHandler: arrayOfStringsHandler
};
