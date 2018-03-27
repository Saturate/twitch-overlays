
import settings from '../config.js';
import express from 'express';
import passport from 'passport';
import chalk from 'chalk';
import graphqlHTTP from 'express-graphql';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import requestify from 'requestify';

import schema from './schema';

const StreamlabsStrategy = require('passport-streamlabs').Strategy;
const app = express();

app.set('view engine', 'ejs');

// Middlewares
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!graphql).)*/, bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({ secret: 'SOME_SECRET_KEY' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

passport.use(new StreamlabsStrategy({
    clientID: settings.CLIENT_ID,
    clientSecret: settings.CLIENT_SECRET,
    // https://dev.streamlabs.com/docs/scopes
    scope: [
        'donations.read',
        'donations.create',
        'socket.token',
        //'points.read',
        //'points.write',
        //'alerts.create',
        //'credits.write',
        //'profiles.write',
        //'jar.write',
        //'wheel.write'
    ],
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
    console.log('logged in', req.user.token);
    res.redirect('/');

    // At this point, the authentication was successful.
});

app.use(express.static('client'));

app.get('/', function(req, res, next) {
    console.log('getting frontpage');
    if (req.isAuthenticated()) return next();

    // Not authenticated.
    res.send('<a href="/login">Please login here</a>');
}, function (req, res) {

    console.log('logged in... we are getting data?', req.user);

    requestify.request('https://streamlabs.com/api/v1.0/socket/token', {
        method: 'GET',
        timeout: 3000,
        dataType: 'json',
        params: {
            access_token: req.user.token
        }	
    })
    .then(function(response) {
        console.log(response.getBody());
        res.status(200).render('../client/index.ejs', {
            token: req.user.token,
            socket_token: response.getBody().socket_token
        });
    })
    .catch((err) => console.error)
    .fail((err) => console.error)
});


app.get('/login', function(req, res) {
    res.redirect('/auth/streamlabs/authorize');
});

app.get('/logout', function(req, res) {
    req.logout();

    res.redirect('/');
});

app.listen(8383, () => {
    console.log('Listening on http://127.0.0.1:8383');
});