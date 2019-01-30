var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var app = express();
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {		
	res.send('That is a URL shortener.');
})

app.get('/URLs', function(req, res) {		
	db.collection('URLs').find().toArray(function(err, docs) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}	
		res.send(docs);
	})
})

app.get('/r/:short', function(req, res) {
	db.collection('URLs').find({'short': req.params.short}).toArray(function(err, docs) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}	
		var site_url = 	docs[0]['site'];
	    if (!((docs[0]['site']).startsWith("http"))) site_url = 'https://' + site_url;	
		res.redirect(site_url);
		console.log(docs);
	})
})

app.post('/URLs', function(req, res) {	
	var URL = {
		site: req.body.site,
		short: req.body.short
	};	
	db.collection('URLs').insert(URL, function (err, result) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(URL);
	})
})

app.delete('/URLs/:id', function(req, res) {	
	db.collection('URLs').deleteOne(
		{ _id: ObjectID(req.params.id) },
		function (err, result) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
			res.sendStatus(200);
		}
	)
})


MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, client){
	if (err) {
		return console.log(err);
	}	
	db = client.db('myapi');
	
	app.listen(3012, function() {
		console.log('It works!!!');
	})		
}) 
