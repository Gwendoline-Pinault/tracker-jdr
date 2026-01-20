require('dotenv').config()
const express = require('express');
const router = require('./app/router');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/app/views') );

app.use('/static', express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(PORT, () => {
  console.info(`Serveur running on : http://localhost:${PORT}`);
});

module.exports = app;