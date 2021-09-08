require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const MongoDbStore = require("connect-mongo");
const flash = require("express-flash");
const passport = require("passport");

const app = express();

const PORT = process.env.PORT || 3000;

// Database connection
const mongoose = require("mongoose");
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect(process.env.DB_URL, options);

const connection = mongoose.connection;

const connectWithRetry = () => {
	console.log("MongoDb connection with retry");
	connection
		.once("open", () => {
			console.log("MongoDb connected");
		})
		.catch((err) => {
			console.log(
				"MongoDb connection unsuccesful, retry after 5 seconds",
				err
			);
			setTimeout(connectWithRetry, 5000);
		});
};

connectWithRetry();

//Session Store
const mongoStore = MongoDbStore.create({
	client: connection.client,
	collection: "sessions",
	clear_interval: 300,
});

//Sesion Config
app.use(
	session({
		secret: process.env.COOKIE_SECERET,
		resave: false,
		store: mongoStore,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
	})
);

app.use(flash());

// Passport Config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Assets
app.use(express.static("public"));
app.use(express.json()); // To send data to the client side
app.use(express.urlencoded({ extended: false })); // To get the data from the request

// Global Middleware
app.use((req, res, next) => {
	res.locals.session = req.session;
	next();
});

// Provide user
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// Set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Routes
require("./routes/web")(app);

// Server
const server = app.listen(PORT, () => {
	console.log(`Listening at PORT ${PORT}!`);
});
