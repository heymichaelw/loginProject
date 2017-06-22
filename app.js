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

app.use(function(req, res, next){
  var pathname = parseurl(req).pathname;

  if (!req.session.user && pathname != '/login') {
    let qs = pathname != '/login' ? "?next=" + pathname : '';
    res.redirect('/login' + qs);
  } else {
    next();
  }
});

app.use(function(req, res, next){
  var views = req.session.views;
  if (!views) {
    views = req.session.views = {};
  }
  views = (views || 0) + 1;
  next();
});

app.get('/login', function(req, res){
  var context = {
    next : req.query.next
  };
  res.render('login', context);
});

app.get('/', function(req, res){
  var context = {
    'username' : req.session.user.username,
    'views' : req.session.views
  };
  res.render('index', context);
});

app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var nextPage = req.body.next || '/';
  var person = users.find(function(user){
    return user.username == username;
  });
  if (person && person.password == password) {
    req.session.user = person;
  } else if (req.session.user) {
    delete req.session.user;
  }

  if (req.session.user) {
    res.redirect(nextPage);
  } else {
    res.redirect('/login');
  }
});

app.listen(3000);
