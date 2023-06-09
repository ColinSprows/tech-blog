const path = require('path'); 
const express = require('express'); 
const session = require('express-session'); 
const exphbs = require('express-handlebars'); 
const routes = require('./controllers'); 
const helpers = require('./utils/helpers'); 

require('dotenv').config()

const sequelize = require('./config/connection'); 
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Set up sessions with cookies
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
 
sequelize.sync();

app.listen(PORT, () => console.log(`Now listening on port http://localhost:${PORT}`));