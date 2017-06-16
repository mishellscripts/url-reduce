// Requirements & initialization of app
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var shortURL = require('./models/shortURL');
var validURL = require('valid-url');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.static('views'));

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.get('/new/:url(*)', function(req, res, next) {
    var urlToShorten = req.params.url;
  
    // Make upcoming check less strict (allow beginning with 'www.')
    if (urlToShorten.substring(0,4) === 'www.') {
        urlToShorten = "http://" + urlToShorten;
    }
  
    // Check if already in database
    shortURL.findOne({'originalURL': urlToShorten}, function(err, targetData) {
        // Found in database - Send url information
        if (targetData) { res.send(targetData) }
        // Not found - Create url information, save, send
        else {
            // Check if URL is valid
            if (validURL.isWebUri(urlToShorten) ) {
                // Generate number for shorter URL
                var num = Math.floor(Math.random()*10000).toString();
                // Create data from model and save to database
                var data = new shortURL({
                  originalURL: urlToShorten,
                  shortID: num,
                  shorterURL: 'https://url-reduce.glitch.me/' + num
                });
                data.save(function(err) {
                    if (err) throw err;
                });
                res.send(data);
            }
            else {
                res.send(new shortURL ({
                  originalURL: urlToShorten,
                  shortID: 'Failed - Invalid URL',
                  shorterURL: 'Failed - Invalid URL'
                }));
            }
        }
    });
});

app.get('/:redirectID', function(req, res, next) {
    // Find ID in database
    var redirectID = req.params.redirectID;
    shortURL.findOne({'shortID': redirectID}, function(err, data) {
        if (err) throw err;
        // If ID not found, redirect to main page
        if (!data) res.sendFile(__dirname + '/views/index.html');
        // If found, redirect to corresponding page
        else {
            var re = new RegExp("^(http|https)://", "i");
            var strToCheck = data.originalURL;
            if (re.test(strToCheck)) {
                res.redirect(301, data.originalURL);
            }
            else {
                res.redirect(301, 'http://' + data.originalURL);
            }  
        }
    });
});

// listen for requests :)
app.listen(process.env.PORT || 3000, function () {
  console.log('Working!');
});
