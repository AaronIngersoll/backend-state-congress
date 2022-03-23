const express = require("express");
const request = require("request");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/representatives/:state", findRepresentativesByState, jsonResponse);

app.get("/senators/:state", findSenatorsByState, jsonResponse);

const statesAbbrs = [
	"AL",
	"AK",
	"AZ",
	"AR",
	"CA",
	"CO",
	"CT",
	"DE",
	"FL",
	"GA",
	"HI",
	"ID",
	"IL",
	"IN",
	"IA",
	"KS",
	"KY",
	"LA",
	"ME",
	"MD",
	"MA",
	"MI",
	"MN",
	"MS",
	"MO",
	"MT",
	"NE",
	"NV",
	"NH",
	"NJ",
	"NM",
	"NY",
	"NC",
	"ND",
	"OH",
	"OK",
	"OR",
	"PA",
	"RI",
	"SC",
	"SD",
	"TN",
	"TX",
	"UT",
	"VT",
	"VA",
	"WA",
	"WV",
	"WI",
	"WY",
];
app.get("/state-codes", (req, res) => {
	res.send(statesAbbrs);
});
function findRepresentativesByState(req, res, next) {
	const url = `http://whoismyrepresentative.com/getall_reps_bystate.php?state=${req.params.state}&output=json`;
	request(url, handleApiResponse(res, next));
}

function findSenatorsByState(req, res, next) {
	const url = `http://whoismyrepresentative.com/getall_sens_bystate.php?state=${req.params.state}&output=json`;
	request(url, handleApiResponse(res, next));
}

function handleApiResponse(res, next) {
	return (err, response, body) => {
		if (err || body[0] === "<") {
			res.locals = {
				success: false,
				error: err || "Invalid request. Please check your state variable.",
			};
			return next();
		}
		res.locals = {
			success: true,
			results: JSON.parse(body).results,
		};
		return next();
	};
}

function jsonResponse(req, res, next) {
	return res.json(res.locals);
}

const server = app.listen(3000, () => {
	const host = server.address().address,
		port = server.address().port;

	console.log("API listening at http://%s:%s", host, port);
});
