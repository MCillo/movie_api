const express = require('express'); // Imports the Express module and assigns it to the variable express so that it can be used 
const morgan = require('morgan'); // Imports morgan, to be used to log URL requests
const bodyParser = require('body-parser'); // Imports body-parser, to be used for error handling
const methodOverride = require('method-override'); // Imports method-override, to be used for error handling
const uuid = require('uuid'); // Imports uuid module for creating specific id's for movies and users

const app = express(); // creates a varaiable that encapsulates Express's functionality to configure the web server

// calling on the middleware functions 
app.use(morgan('common'));
app.use(bodyParser.json());

// movies data objects 
let movies = [
    {
        'movieId': 1,
        'title': 'The Shawshank Redemption',
        'movieDescription': 'The description for The Shawshank Redemptioin goes here.',
        'director': {
            'directorName': 'Frank Darabont',
            'directorBio': 'Frank Darabont bio goes here',
            'directorBirth': 'January 01, 1950',
            'directorDeath': ''
        },
        'genre': {
            'genreName': 'Drama',
            'genreDescription': 'Description for drama goes here.'
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': false
    },
    {
        'movieId': 2,
        'title': 'The Godfather',
        'movieDescription': 'The description for The Godfather goes here.',
        'director': {
            directorName: 'Francis Ford Coppola',
            directorBio: 'Francis Ford Coppola bio goes here',
            directorBirth: 'February 05, 1960',
            directorDeath: ''
        },
        'genre': {
            'genreName': 'Crime',
            'genreDescription': 'Description for Crime goes here.'
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': false
    },
    {
        'movieId': 3,
        'title': 'The Dark Night',
        'movieDescription': 'The description for The Dark Night goes here.',
        'director': {
            'directorName': 'Christopher Nolan',
            'directorBio': 'Christopher Nolan bio goes here',
            'directorBirth': 'March 10, 1970',
            'directorDeath': ''
        },
        'genre': {
            'genreName': 'Action',
            'genreDescription': 'Description for Action goes here.'
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': true
    },
    {
        'movieId': 4,
        'title': 'The Godfather Part II',
        'movieDescription': 'The description for The Godfather Part II goes here.',
        'director': {
            'directorName': 'Francis Ford Coppola',
            'directorBio': 'Francis Ford Coppola bio goes here',
            'directorBirth': 'February 05, 1960',
            'directorDeath': ''
        },
        'genre': {
            'genreName': 'Crime',
            'genreDescription': 'Description for Crime goes here.'
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': false
    },
    {
        'movieId': 5,
        'title': '12 Angry Men',
        'movieDescription': 'The description for 12 Angry Men goes here.',
        'director': {
            'directorName': 'Sidney Lumet',
            'directorBio': 'Sidney Lumet bio goes here',
            'directorBirth': 'April 15, 1930',
            'directorDeath': 'January 31, 2010'
        },
        'genre': {
            'genreName': 'Drama',
            'genreDescription': 'Description for drama goes here'
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': false
    },
    {
        'movieId': 6,
        'title': 'Shindler\'s List',
        'movieDescription': 'The description for Shindler\'s List goes here.',
        'director': {
            'directorName': 'Steven Spielberg',
            'directorBio': 'Steven Spielberg bio goes here',
            'directorBirth': 'May 20, 1940',
            'directorDeath': ''
        },
        'genre': {
            'genreName': 'History',
            'genreDescription': 'Description for History goes here'
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': false
    },
    {
        'movieId': 7,
        'title': 'The Lord of the Rings: The Return of the King',
        'movieDescription': 'The description for The Lord of the Rings: The Return of the King goes here.',
        'director': {
            'directorName': 'Peter Jackson',
            'directorBio': 'Peter Jackson bio goes here',
            'directorBirth': 'June 25, 1950',
            'directorDeath': ''
        },
        'genre': {
            'genreName': 'Adventure',
            'genreDescription': 'Description for adventure goes here'
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': true
    },
    {
        'movieId': 8,
        'title': 'Pulp Fiction',
        'movieDescription': 'The description for Pulp Fiction goes here.',
        'director': {
            'directorName': 'Quenton Tarantino',
            'directorBio': 'Quentin Tarantino bio goes here',
            'directorBirth': 'July 30, 1960',
            'directorDeath': '',
        },
        'genre': {
            'genreName': 'Drama',
            'genreDescription': 'Description for drama goes here',
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': false
    },
    {
        'movieId': 9,
        'title': 'The Lord of the Rings: The Fellowship of the Ring',
        'movieDescription': 'The description for The Lord of the Rings: The Fellowship of the Ring goes here',
        'director': {
            'directorName': 'Peter Jackson',
            'directorBio': 'Peter Jackson bio goes here',
            'directorBirth': 'June 25, 1950',
            'directorDeath': ''
        },
        'genre': {
            'genreName': 'Adventure',
            'genreDescription': 'Description for adventure goes here'
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': true
    },
    {
        'movieId': 10,
        'title': 'The Good, the Bad and the Ugly',
        'movieDescription': 'The description for The Good, the Bad and the Ugly goes here.',
        'director': {
            'directorName': 'Sergio Leone',
            'directorBio': 'Sergio Leone bio goes here',
            'directorBirth': 'August 24, 1925',
            'directorDeath': 'September 25, 2005',
        },
        'genre': {
            'genreName': 'Western',
            'genreDescription': 'Description for western goes here',
        },
        'movieImageURL': 'An Image URL for the movie goes here',
        'featured': false
    },
];

let users = [
    {
        'userId': 1,
        'userName': 'Mike Cillo',
        'userFavorites': ['The Dark Knight']
    },
    {
        'userId': 2,
        'userName': 'John Doe',
        'userFavorites': ['The Lord of the Rings: The Return of the King']
    },
    {
        'userId': 3,
        'userName': 'Suzy Somebody',
        'userFavorites': ['12 Angry Men']
    }
];

// Get requests
app.get('/', (req, res) => { // http GET request that returns welcome message
    res.send('Welcome to Movie Tracker!');
});

app.use(express.static('public'));

// HTTP GET request that returns all the movies, the finished app would return a JSON object with all the movie data
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// HTTP GET request that returns data for a single movie to the user, the finished app will return a JSON object with the selected movie's data
app.get('/movies/:title', (req, res) => {

    const { title } = req.params; // <= object destructuring
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('The movie you requested could not be found!');
    }
});

// HTTP GET request that returns data about a selected "Genre" to the user, the finished app will return a JSON object with the selected genre's data
app.get('/movies/genre/:genreName', (req, res) => {

    const { genreName } = req.params;
    const genre = movies.find(movie => movie.genre.genreName === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('The genre you requested could not be found!');
    }
});

// HTTP GET request that returns data about a selected director to the user, the finished app will return a JSON object with the selected director's data
app.get('/movies/director/:directorName', (req, res) => {

    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.directorName === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('The Director you requested could not be found!');
    }
});

// HTTP POST request that creates a new user in the user registry,
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('Name is required for New Users!');
    }
});

// HTTP PUT request that allows users to update their username
app.put('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.userId == userId);

    if (user) {
        user.userName = updatedUser.userName;
        res.status(200).json(user);
    } else {
        res.status(400).send('The user could not be found!');
    }
});

// HTTP POST request that allows users to add a favorite movie to their list
app.put('/users/:userId/:movieTitle', (req, res) => {
    const { userId, movieTitle } = req.params;

    let user = users.find(user => user.userId == userId);

    if (user) {
        user.userFavorites.push(movieTitle);
        res.status(200).json(user).send('Movie added to users favorites list!');
    } else {
        res.status(400).send('The user could not be found!');
    }
});

// HTTP REMOVE request that allows users to remove a favorite movie from their list
app.delete('/users/:userId/:movieTitle', (req, res) => {
    const { userId, movieTitle } = req.params;

    let user = users.find(user => user.userId == userId);

    if (user) {
        user.userFavorites = user.userFavorites.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} was removed from user ${userId}'s favorites list!`);
    } else {
        res.status(400).send('The user could not be found!');
    }
});

// HTTP REMOVE request that allows users to deregister their account
app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;

    let user = users.find(user => user.userId == userId);

    if (user) {
        users = users.filter(user => user.userId != userId);
        res.status(200).send(`User ${userId} has been deleted!`);
    } else {
        res.status(400).send('The user could not be found!');
    }
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
