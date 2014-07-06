var express    = require('express'),
    nunjucks   = require('nunjucks'),
    bodyParser = require('body-parser'),
    app        = express(),
    path       = require('path'),
    Datastore  = require('nedb'),
    db         = {},
    wrapper    = require('./lib/wrapper.js');

// Configure Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express   : app
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Port and Root
var port = process.argv[2] || 1337,
    root = 'http://localhost:' + port;

// Connect to an NeDB database
db.crips = new Datastore({
  filename: 'db/crips',
  autoload: true
});

// Add an index
db.crips.ensureIndex({
  unique: true,
  fieldName: 'name'
});

// Necessary for accessing POST data via req.body object
app.use(bodyParser.json());

// Catch-all route to set global values
app.use(function( req, res, next ) {
  res.type('application/json');
  res.locals.wrap = wrapper.create({
    start: new Date()
  });
  next();
});

// Routes
app.get('/', function( req, res ) {
  res.type('text/html');
  res.render('index.html', {
    title: "Crip as a Service",
    name: "Crip API",
    desc: "api.crip.io",
    url: root
  });
});

app.get('/crips', function( req, res ) {
  db.crips.find({}, function( err, results ) {
    if ( err ) {
      res.json(500, { error: err });
      return;
    }

    res.json(200, res.locals.wrap(results.map(function( crip ) {
      crip.links = {
        self: root + '/crips/' + crip._id
      };
      return crip;
    }), {
      next: root + '/crips?page=2'
    }));

    // res.json(200, res.locals.wrap({}, { item: results.map(function ( crip ) {
    //   return root + '/crips/' + crip._id;
    // })}));
  });
});

app.post('/crips', function( req, res ) {
  if ( !req.body.name ) {
    res.json(400, {
      error: { message: "A name is required to create a new crip." }
    });
    return;
  }
  db.crips.insert({ name: req.body.name }, function( err, created) {
    if ( err ) {
      res.json(500, { error: err });
      return;
    }

    res.set('Location', root + '/crips/' + created._id);
    res.json(201, created);
  });
});

app.get('/crips/:id', function( req, res ) {
  db.crips.findOne({ _id: req.params.id }, function( err, result) {
    if ( err ) {
      res.json(500, { error: err });
      return;
    }

    if ( !result ) {
      res.json(404, { error: { message: "We did not find a crip with id: " + req.params.id }});
      return;
    }

    res.json(200, res.locals.wrap(result, {
      self: root + '/crips/' + req.params.id
    }));
  });
});

app.put('/crips/:id', function( req, res ) {
  db.crips.update({ _id: req.params.id }, req.body, function( err, num ) {
    res.locals.respond(err, { success: num + " records updated" });
  });
});

app.delete('/crips/:id', function( req, res ) {
  db.crips.remove({ _id: req.params.id }, function( err, num) {
    if ( err ) {
      res.json(500, { error: err });
      return;
    }

    if ( num === 0 ) {
      res.json(404, { error: { message: "We did not find a crip with id: " + req.params.id }});
      return;
    }

    res.set('Link', root + '/crips; rel="collection"');
    res.send(204);
  });
});

app.listen(port);
