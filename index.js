const express = require('express'); // Imports the Express module and assigns it to the variable express so that it can be used 
const morgan = require('morgan'); // Imports morgan, to be used to log URL requests
const bodyParser = require('body-parser'); // Imports body-parser, to be used for error handling
const methodOverride = require('method-override'); // Imports method-override, to be used for error handling
const uuid = require('uuid'); // Imports uuid module for creating specific id's for movies and users
const mongoose = require('mongoose');  // Imports mongoose allowing CRUD operations on the MongoDB
const Models = require('./models.js');  // Imports the DB model schemas from models.js to enforce attributes defined in models.js

const Movies = Models.Movie; // creates a variable to use the Movie model
const Users = Models.User;  // creates a variable to use the User model

mongoose.connect('mongodb://localhost:27017/MyFlix', { useNewUrlParser: true, useUnifiedTopology: true });  // allows mongoose to connect to the DB allowing CRUD operations from the API
//mongoose.connect('mongodb://localhost:8080/MyFlix', { useNewUrlParser: true, useUnifiedTopology: true });  // allows mongoose to connect to the DB allowing CRUD operations from the API

const app = express(); // creates a varaiable that encapsulates Express's functionality to configure the web server

// calling on the middleware functions 
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// HTTP Requests

// Get requests
app.get('/', (req, res) => { // http GET request that returns welcome message
    res.send('Welcome to Movie Tracker!');
});

app.use(express.static('public'));


// HTTP GET request that returns all the movies from MongoDB
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500), send('Error: ' + err);
        });
});

// HTTP GET request that returns data for a single movie to the user, the finished app will return a JSON object with the selected movie's data
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500), send('Error: ' + err);
        });
});

// HTTP GET request that returns data about a selected "Genre" to the user, the finished app will return a JSON object with the selected genre's data
app.get('/Movies/Genre/:Name', (req, res) => {
    Movies.find({ 'Genre.Name': req.params.Name }, { 'Genre.Name': 1, 'Genre.Description': 1, _id: 0 })
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// HTTP GET request that returns data about a selected director to the user, the finished app will return a JSON object with the selected director's data
app.get('/movies/Director/:Name', (req, res) => {

    Movies.find({ 'Director.Name': req.params.Name }, { 'Director.Name': 1, 'Director.Bio': 1, _id: 0 })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });

});

// HTTP GET request for all users from MongoDB 
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// HTTP GET request for user by username from MongoDB
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// NEW HTTP Post request to create a new user in the external MongoDB
/* Expect JSON in the format
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}
*/
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username }) // checks to see if username already exists in DB
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists'); // returns error if username is already in DB
            } else {
                Users
                    .create({  // Mongoose's create command creates a new user if username is not already in DB
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => { res.status(201).json(user) })  // callback that takes document named user - created by create command above responds back to client with status code and document named user
                    .catch((error) => {  // catches any errors when creating new user in DB
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {  // catches any errors when checking if username already exists
            console.error(error);
            res.status(500).send('Error ' + error);
        });
});

// HTTP PUT request that allows users to update their username
/* Expect JSON in the format
{
    Username: String, (Required)
    Password: String, (Required)
    Email: String, (Required)
    Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }, // This line makes sure that the updated document is returned
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                console.error(err);
                return res.status(404).send('Error: Username already exists.');
            } else {
                res.json(updatedUser);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// HTTP POST request that allows users to add a favorite movie to their list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, // This line makes sure that the updated document is returned
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                console.error(err);
                res.status(404).send('Error: User does not exist.');
            } else {
                res.json(updatedUser);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// HTTP REMOVE request that allows users to remove a favorite movie from their list
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, // This line makes sure that the updated document is returned
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                console.error(err);
                res.status(404).send('Error: User does not exist.');
            } else {
                res.json(updatedUser);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// HTTP REMOVE request that allows users to delete their account
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// error handling middleware called after all instances of app.use() except for app.listen()
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json()); // for handling errors
app.use(methodOverride()); // for handling errors

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
})

