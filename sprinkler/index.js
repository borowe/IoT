var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var talky = require('http');
var fs = require('fs');

// define app port and directory to for express to access
app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Serve views on get requests
app.get('/sprinkler', function(request, response) {
  response.render('pages/index');
});

app.get('/test', function(request, response) {
  response.render('pages/test');
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// socket.io
io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  }); // socket.on disconnect
});  //io.on connection

io.on('connection', function(socket) {

  socket.on('toggle', function(direction) {
    console.log('message: ' + direction);

      // send event back to clients
      //io.emit('sendback', lcdmsg);
     // console.log('sent sendback via ioemit', lcdmsg);

      // Send GET request to LCD
      var options = {
	  host: '50.159.64.235',
	  port: '1025',
	  path: '/sprinkler?direction=' + direction
	  
	  // debugging test site
	//  host: 'www.random.org',
	//  path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	  };

      console.log("called to ", options.host + ":" + options.port + options.path);

      var req = talky.request(options, function(res) {
	  console.log('STATUS: ', res.statusCode);
	  console.log('HEADERS: ', JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	      console.log('BODY: ' + chunk);
	      }); // --res.on data
	  res.on('end', function() {
	      console.log('No more data in response');
	      }); // --res.on end
	  }).on('error', function(e) {
	      console.log("got an error " + e.message);
	      console.log(e.stack);
	      }).end();

     
  });  //socket.on toggle

}); // io.on connection


