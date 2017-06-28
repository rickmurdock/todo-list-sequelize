const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const morgan = require("morgan");
const models = require("./models");
const port = 7000;
var app = express();

// var listData = [{'item': 'eat', 'complete': false}, 
//                 {'item': 'sleep', 'complete': false},
//                 {'item': 'code', 'complete': false} ];

// RENDER ENGINE
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache")

// MIDDLEWARE
app.use("/", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// ROUTES
app.get("/", function(req, res) {
  models.todo
    .findAll()
    .then(function(foundTodo) {
    // res.send(foundTodo);
    res.render("index", {listBox: foundTodo});
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

// app.get("/", function(req, res){
//   res.render("index", {listBox: listData});
// });

// app.post('/', function(req, res) {
//   var newItem = req.body.newItem;
//   listData.push({'item': newItem, 'complete': false});
//   res.redirect('/');
// });

app.post("/", function(req, res) {
  var todoData = req.body.item;
  
  var newItem = models.todo.build({ item:todoData });
  newItem
    .save()
    .then(function(savedTodo) {
      // res.send(savedTodo);
      res.redirect("/");
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.listen(port, function() {
  console.log('Server up and running on port', port);
});