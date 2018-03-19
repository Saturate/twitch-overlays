
import settings from '../config.js';
import express from 'express';
import passport from 'passport';

const bodyParser         = require('body-parser');
const cookieParser       = require('cookie-parser');
const cookieSession      = require('cookie-session');

const requestify = require('requestify'); 

const StreamlabsStrategy = require('passport-streamlabs').Strategy;
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({ secret: 'SOME_SECRET_KEY' }));
app.use(passport.initialize());
app.use(passport.session());

console.log('Middleware loaded...');

passport.use(new StreamlabsStrategy({
    clientID: settings.CLIENT_ID,
    clientSecret: settings.CLIENT_SECRET,
    scope: ['donations.read', 'donations.create'],
    callbackURL: settings.REDIRECT_URI
}, function(accessToken, refreshToken, profile, done) {
    return done(undefined, profile);
}));

// User serialization
passport.serializeUser(function(user, done)   { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

// Routes
app.get('/auth/streamlabs/authorize', passport.authenticate('streamlabs'));

app.get('/auth/streamlabs/callback', passport.authenticate('streamlabs', {
	failureRedirect: '/auth/streamlabs/authorize'
}), function(req, res) {
    console.log('logged in');
    console.log(req);
    // At this point, the authentication was successful.
});

app.get('/', function(req, res, next) {
    if (req.isAuthenticated()) return next();

    // Not authenticated.
    res.redirect('/auth/streamlabs/authorize');
}, function (req, res) {

    console.log('logged in... we are getting data?', req.user);

    requestify.request('https://streamlabs.com/api/v1.0/donations', {
        method: 'GET',
        timeout: 3000,
        dataType: 'json',
        params: {
            access_token:  req.user.token
        }	
    })
    .then(function(response) {
        console.log(response)
        console.log(response.getBody());

        console.log(response)
        res.send('Logged in!' + JSON.stringify(response.getBody(), null, '\t'));
    })
    .catch((err) => console.error)
});

app.get('/logout', function(req, res) {
    req.logout();

    res.redirect('/');
});


console.log('Starting server on http://127.0.0.1:8383');
app.listen(8383);