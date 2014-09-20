var readlineHelpers = require('./readline_helpers');

var APISpec = [
	readlineHelpers.stringHandler.bind(null, {
		field: "first_name",
		desc: "Your first name",
		required: true
	}),
	readlineHelpers.stringHandler.bind(null, {
		field: "last_name",
		desc: "Your last name",
		required: true
	}),
	readlineHelpers.stringHandler.bind(null, {
		field: "email",
		desc: "Your email",
		required: true
	}),
	readlineHelpers.stringHandler.bind(null, {
		field: "position_id",
		desc: "Id of position you are applying for (Don't want to be placed in a bucket? Use \"GENERALIST\")",
		required: true
	}),
	readlineHelpers.stringHandler.bind(null, {
		field: "explanation",
		desc: "Tell us how you made the API request",
		required: false
	}),
	readlineHelpers.arrayOfStringsHandler.bind(null, {
		field: "projects",
		desc: "Links to your GitHub profile, personal projects, or other awesome things that you've done",
		required: false
	}),
	readlineHelpers.stringHandler.bind(null, {
		field: "source",
		desc: "How did you find Perka? (avid user, talent scout, friend, Hacker School…)",
		required: false
	}),
	readlineHelpers.fileHandler.bind(null, {
		field: "resume",
		desc: "Your resume in PDF format",
		required: true
	})
];

module.exports = APISpec;
