var express    = require('express'),
    bodyParser = require('body-parser'),
    app        = express(),
    Datastore  = require('nedb'),
    db         = {};

var setupResponder = function( res ) {
  return function( err, response ) {
    if ( err ) {
      res.send( JSON.stringify(err) );
    }
    else {
      res.send( JSON.stringify(response) );
    }
  };
};

// Connect to an NeDB database
db.crips = new Datastore({
  filename: 'db/crips',
  autoload: true
});

// Necessary for accessing POST data via req.body object
app.use(bodyParser.json());

// Routes
app.get('/', function( req, res ) {
  res.send("The API is working.");
})
.post('/crips', function( req, res ) {
  var body    = req.body,
      respond = setupResponder(res);

  res.set('Content-Type', 'application/json');

  switch ( body.action ) {
    case "viewList":
      db.crips.find({}, respond);
      break;

    case "addNew":
      db.crips.insert({ name: body.name }, respond);
      break;

    default:
      respond({ error: "No action given in request." });
  }
})
.post('/crips/:id', function( req, res ) {
  var body    = req.body,
      respond = setupResponder(res);

  res.set('Content-Type', 'application/json');

  switch ( body.action ) {
    case "view":
      db.crips.find({
        _id: req.params.id
      }, respond);
      break;

    case "position":
      db.crips.update({ _id: req.params.id },
        { $set: { position: body.position }
      }, function( err, num) {
        respond(err, { success: num + " records updated" });
      });
      break;
  }
})
.post('/rpc', function( req, res) {
  var body    = req.body,
      respond = setupResponder(res);

  res.set('Content-Type', 'application/json');

  switch ( body.action ) {
    case "getCrips":
      db.crips.find({}, respond);
      break;

    case "addCrip":
      db.crips.insert({ name: body.name }, respond);
      break;

    case "positionCrip":
      db.crips.update({ name: body.name },
        { $set: { position: body.position }
      }, function( err, num) {
        respond(err, { success: num + " records updated" });
      });
      break;

    default:
      respond("No action given");
  }
})
.listen(1337);
