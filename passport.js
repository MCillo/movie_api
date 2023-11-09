/** 
 *  passport is an authentication middleware for Node.js and Express
 *  it will be used to authenticate users for the App
 */

// 
const passport = require('passport'),


    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/**
    * LocalStrategy takes the username and password from the http request body
    * uses Mongoose to search the DataBase for a user with the same username
    */

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({ Username: username }).then((user) => {
        // If the LocalStrategy does not match the username in the request body with a username in the database
        if (!user) {
            console.log('Incorrect username');
            return callback(null, false, { message: 'Incorrect username or password.' });
        }
        // If the
        if (!user.validatePassword(password)) {
            console.log('Incorrect Password');
            return callback(null, false, { message: 'Incorrect Password.' });
        }
        console.log('Finished');
        return callback(null, user);
    }).catch((error) => {
        return callback(error)
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));
