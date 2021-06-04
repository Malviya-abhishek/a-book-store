require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');





const app = express();

const PORT = process.env.PORT || 3000;


// Assets
app.use(express.static('public'));

// Set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// Routes
require('./routes/web')(app);


// Server 
const server = app.listen(PORT, ()=>{
  console.log(`Listening at PORT ${PORT}`);
});
