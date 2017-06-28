const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const port = 7000;
var app = express();

var listData = [{'item': 'eat', 'complete': false}, 
                {'item': 'sleep', 'complete': false},
                {'item': 'code', 'complete': false} ];

// RENDER ENGINE
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache")

// MIDDLEWARE
app.use("/", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
app.get("/", function(req, res){
  res.render("index", {listBox: listData});
});

app.post('/', function(req, res) {
  var newItem = req.body.newItem;
  listData.push({'item': newItem, 'complete': false});
  res.redirect('/');
});

app.listen(port, function() {
  console.log('Server up and running on port', port);
});