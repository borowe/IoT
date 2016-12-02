var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var data;

// define app port and directory to for express to access
app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Serve views on get requests
app.get('/', function(request, response) {
    //data = url.parse(request.url, true).query;
    //console.log(data.bob);
    response.render('pages/index');
});


app.get('/sprinkler', function(request, response) {
    response.render('pages/sprinkler');
});

app.get('/update', function(request, response) {
    data = url.parse(request.url, true).query;
    
    //normalize data to the full and empty container levels
    var level = ((parseInt(data.level) - 17) / -9) * 100;
    
    console.log('emitting the data level ', level);
    io.emit('updateLevel', level);
    response.writeHead(200, {"Content-type": "text/html"});
    response.end('container updated');
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// socket.io
io.on('connection', function(socket) {
    console.log('a user connected');
    
    socket.on('lcdsend', function(lcdmsg) {
	console.log('message: ' + lcdmsg);

	io.emit('sendback', lcdmsg);
	console.log('sent sendback via ioemit', lcdmsg);
    });

    socket.on('disconnect', function(){
	console.log('a user disconnected');
    });
	
});


