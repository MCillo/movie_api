const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // Requiring the passport.js file

/**
 * Generates a JWT token that will be assigned to the user upon successful login
 * the token will be used for all subsequent http requests
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // This is the username you’re encoding in the JWT
        expiresIn: '7d', // This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
    });
}

/**
 * POST login
 *  uses LocalStrategy from passport.js file to check if the username and password 
 *  in the http request body exist with the database
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        console.log('Received login request') //testing
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                console.error('Authentication failed:', error); //testing
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    console.error('Login failed:', error); // testing
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                console.log('Login successful, token generated:', token);
                return res.json({ user, token });
            });
        })(req, res);
    });
}
