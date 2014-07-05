var express    = require('express'),
    bodyParser = require('body-parser'),
    app        = express(),
    Datastore  = require('nedb'),
    db         = {};

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
.post('/rpc', function( req, res) {
  var body    = req.body,
      respond = function( err, results ) {
        if ( err ) {
          res.send( JSON.stringify(err) );
        }
        else {
          res.send( JSON.stringify(results) );
        }
      };

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
