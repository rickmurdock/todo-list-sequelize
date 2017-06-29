const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const morgan = require("morgan");
const models = require("./models");
const port = 7000;
var app = express();

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

app.post("/completed", function(req, res) {
  var todoComplete = req.body.incomplete;
  models.todo
    .update( { complete: true}, { where: { id: todoComplete } })
    .then (function() {
      res.redirect("/");
    })
      .catch(function(err) {
      res.status(500).send(err);
    });
});

app.post("/delete", function(req, res) {
  var delId = req.body.completed;
  models.todo
    .destroy({ where: { id: delId } })
    .then(function() {
      res.redirect("/");
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.post("/deletecompleted", function(req, res) {
  // var delId = req.body.completed;
  models.todo
    .destroy({ where: { complete: true } })
    .then(function() {
      res.redirect("/");
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.listen(port, function() {
  console.log('Server up and running on port', port);
});