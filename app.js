/**
 * Module dependencies.
 */
const express = require('express');
const http = require('http');
const io = require('socket.io');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
*/

dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();
const server = http.createServer(app);
const socketIO = io(server);

/**
 * Connect to MongoDB.
 */

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

app.set('jwt_secret', process.env.JWT_SECRET)



/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
const port = process.env.PORT || 3001;
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.use(expressStatusMonitor({
//     websocket: socketIO
// }));
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
// app.use(session({
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
//     autoReconnect: true,
//     clear_interval: 3600
//   })
// }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());
// app.use(lusca.csrf({
//     cookie: 'csrftoken'
// }));
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//     console.log('request', req.user);
//   res.locals.user = req.user;
//   next();
// });
// app.use((req, res, next) => {
//   // After successful login, redirect back to the intended page
//   if (!req.user &&
//       req.path !== '/login' &&
//       req.path !== '/signup' &&
//       !req.path.match(/^\/auth/) &&
//       !req.path.match(/\./)) {
//     req.session.returnTo = req.path;
//   } else if (req.user &&
//       req.path === '/account') {
//     req.session.returnTo = req.path;
//   }
//   next();
// });
// app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'client', 'build')));
// app.use(express.static(path.join(__dirname, 'client', 'public')));

/**
 * Primary app routes.
 */
// app.get('/', homeController.index);
app.get('/', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'client', 'build', 'index.html')
  )
});

app.get('/challenge/:id', passport.authenticate('jwt', { session: false }), homeController.challenge);
app.get('/challenge_list/:user_id', passport.authenticate('jwt', { session: false }), homeController.challengeList);
app.post('/challenge', passport.authenticate('jwt', { session: false }), homeController.createChallenge);
app.post('/join_challenge', passport.authenticate('jwt', { session: false }), homeController.joinChallenge);
app.post('/check_user_name', homeController.checkUserName);
app.post('/register_user', homeController.registerUser);
app.post('/login', homeController.login);
app.get('/players/:id', passport.authenticate('jwt', { session: false }), homeController.fetchPlayers);
app.get('/get_user', passport.authenticate('jwt', { session: false }), homeController.fetchCurrentUser);
app.get('*', function(req, res) {
    res.redirect('/');
});


// app.get('/login', userController.getLogin);
// app.post('/login', userController.postLogin);
// app.get('/logout', userController.logout);
// app.get('/forgot', userController.getForgot);
// app.post('/forgot', userController.postForgot);
// app.get('/reset/:token', userController.getReset);
// app.post('/reset/:token', userController.postReset);
// app.get('/signup', userController.getSignup);
// app.post('/signup', userController.postSignup);
// app.get('/contact', contactController.getContact);
// app.post('/contact', contactController.postContact);
// app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
// app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
// app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
// app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
// app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

// /**
//  * API examples routes.
//  */
// app.get('/api', apiController.getApi);
// app.get('/api/lastfm', apiController.getLastfm);
// app.get('/api/nyt', apiController.getNewYorkTimes);
// app.get('/api/aviary', apiController.getAviary);
// app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
// app.get('/api/stripe', apiController.getStripe);
// app.post('/api/stripe', apiController.postStripe);
// app.get('/api/scraping', apiController.getScraping);
// app.get('/api/twilio', apiController.getTwilio);
// app.post('/api/twilio', apiController.postTwilio);
// app.get('/api/clockwork', apiController.getClockwork);
// app.post('/api/clockwork', apiController.postClockwork);
// app.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
// app.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
// app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
// app.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
// app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
// app.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
// app.get('/api/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
// app.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
// app.get('/api/paypal', apiController.getPayPal);
// app.get('/api/paypal/success', apiController.getPayPalSuccess);
// app.get('/api/paypal/cancel', apiController.getPayPalCancel);
// app.get('/api/lob', apiController.getLob);
// app.get('/api/upload', apiController.getFileUpload);
// app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
// app.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
// app.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
// app.get('/api/google-maps', apiController.getGoogleMaps);

// /**
//  * OAuth authentication routes. (Sign in)
//  */
// app.get('/auth/instagram', passport.authenticate('instagram'));
// app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
// app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// app.get('/auth/github', passport.authenticate('github'));
// app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// app.get('/auth/twitter', passport.authenticate('twitter'));
// app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
// app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });

// /**
//  * OAuth authorization routes. (API examples)
//  */
// app.get('/auth/foursquare', passport.authorize('foursquare'));
// app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
//   res.redirect('/api/foursquare');
// });
// app.get('/auth/tumblr', passport.authorize('tumblr'));
// app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
//   res.redirect('/api/tumblr');
// });
// app.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
// app.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// app.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
// app.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect('/api/pinterest');
// });


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
server.listen(port, () => {
  console.log('%s App is running at http://%s:%d in %s mode', chalk.green('✓'), app.get('host'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

socketIO.on('connection', function (client) {
    console.log('connection', client.client.id);
    client.on('challenge_update', function (data) {
        console.log('challenge_update in socket', client.client.id);
        homeController.updateChallenge(data, socketIO);
    });
});



module.exports = app;
