const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
const parseurl = require('parseurl');

const app = express();

var users = [
  {'username' : 'michael', 'password' : 'moo'},
  {'username' : 'tommy', 'password' : 'fred'},
  {'username' : 'faith', 'password' : 'puppies'},
];

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret : 'secretword',
  resave : false,
  saveUninitialized : true
}));






app.get('/login', function(req, res){
  res.render('login', {});
});

app.listen(3000);
