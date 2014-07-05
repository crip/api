var express    = require('express'),
    bodyParser = require('body-parser'),
    app        = express(),
    Datastore  = require('nedb'),
    db         = {},
    responder  = require('./httpResponder');

// Connect to an NeDB database
db.crips = new Datastore({
  filename: 'db/crips',
  autoload: true
});

// Necessary for accessing POST data via req.body object
app.use(bodyParser.json());

// Catch-all route to set global values
app.use(function( req, res, next ) {
  res.type('application/json');
  res.locals.respond = responder.setup( res );
  next();
});

// Routes
app.get('/', function( req, res ) {
  res.send("The API is working.");
});

app.get('/crips', function( req, res ) {
  db.crips.find({}, res.locals.respond);
});

app.post('/crips', function( req, res ) {
  db.crips.insert({ name: req.body.name }, res.locals.respond);
});

app.get('/crips/:id', function( req, res ) {
  db.crips.findOne({ _id: req.params.id }, res.locals.respond);
});

app.put('/crips/:id', function( req, res ) {
  db.crips.update({ _id: req.params.id }, req.body, function( err, num ) {
    res.locals.respond(err, { success: num + " records updated" });
  });
});

app.delete('/crips/:id', function( req, res ) {
  db.crips.remove({ _id: req.params.id }, res.locals.respond);
});

app.post('/crips/:id', function( req, res ) {

  switch ( req.body.action ) {
    case "view":
      db.crips.find({
        _id: req.params.id
      }, respond);
      break;

    case "position":
      db.crips.update({ _id: req.params.id },
        { $set: { position: req.body.position }
      }, function( err, num) {
        res.locals.respond(err, { success: num + " records updated" });
      });
      break;
  }
})
.post('/rpc', function( req, res) {

  switch ( req.body.action ) {
    case "getCrips":
      db.crips.find({}, res.locals.respond);
      break;

    case "addCrip":
      db.crips.insert({ name: req.body.name }, res.locals.respond);
      break;

    case "positionCrip":
      db.crips.update({ name: req.body.name },
        { $set: { position: req.body.position }
      }, function( err, num) {
        res.locals.respond(err, { success: num + " records updated" });
      });
      break;

    default:
      res.locals.respond("No action given");
  }
})
.listen(1337);
