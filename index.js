require('dotenv').config()
const express = require('express');
const router = require('./app/router');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3002;

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use('/static', express.static('./public'));
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 3600000,
  }
}));

app.use(router);

app.listen(PORT, () => {
  console.info(`Serveur running on : http://localhost:${PORT}`);
});

module.exports = app;