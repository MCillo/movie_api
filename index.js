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
        movieId: 1,
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        genre: 'Drama'
    },
    {
        movieId: 2,
        title: 'The Godfather',
        director: 'Francis Ford Coppola',
        genre: 'Crime, Drama'
    },
    {
        movieId: 3,
        title: 'The Dark Night',
        director: 'Christopher Nolan',
        genre: 'Action, Crime, Drama, Thriller'
    },
    {
        movieId: 4,
        title: 'The Godfather Part II',
        director: 'Francis Ford Coppola',
        genre: 'Crime, Drama'
    },
    {
        movieId: 5,
        title: '12 Angry Men',
        director: 'Sidney Lumet',
        genre: 'Crime, Drama'
    },
    {
        movieId: 6,
        title: 'Shindler\'s List',
        director: 'Steven Spielberg',
        genre: 'Biography, Drama, History'
    },
    {
        movieId: 7,
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson',
        genre: 'Action, Adventure, Drama'
    },
    {
        movieId: 8,
        title: 'Pulp Fiction',
        director: 'Quenton Tarantino',
        genre: 'Crime, Drama'
    },
    {
        movieId: 9,
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: 'Peter Jackson',
        genre: 'Action, Adventure, Drama'
    },
    {
        movieId: 10,
        title: 'The Good, the Bad and the Ugly',
        director: 'Sergio Leone',
        genre: 'Adventure, Western'
    },
];

let director = [
    {
        directorId: 1,
        directorName: 'Francis Ford Coppola',
        movies: 'The Godfather, The Godfather Part II'
    },
    {
        directorId: 2,
        directorName: 'Peter Jackson',
        movies: 'The Lord of the Rings: The Fellowship of the Ring, The Lord of the Rings: The Return of the King'
    },
    {
        directorId: 3,
        directorName: 'Christopher Nolan',
        movies: 'The Dark Knight'
    }
];
let users = [
    {
        userId: 1,
        name: 'Mike Cillo',
        userName: 'MCillo',
        favorites: 'The Dark Knight'
    },
    {
        userId: 2,
        name: 'John Doe',
        userName: 'moviebuff',
        favorites: 'The Lord of the Rings: The Return of the King'
    },
    {
        userId: 3,
        name: 'Suzy Somebody',
        userName: 'suzyWhatchAlot',
        favorites: 'Pulp Fiction'
    }
];

let genre = [
    {
        genreId: 1,
        genreName: 'Action',
        genreDescription: 'Action means explosions and gunfights'
    },
    {
        genreId: 2,
        genreName: 'Adventure',
        genreDescription: 'Similiar to action but with less explosions'
    },
    {
        genreId: 3,
        genreName: 'Anime',
        genreDescription: 'Cartoon but for an older audience'
    }
];

// Get requests
app.get('/', (req, res) => { // http GET request that returns welcome message
    res.send('Welcome to Movie Tracker!');
});

app.use(express.static('public'));

// HTTP GET request that returns all the movies, the finished app would return a JSON object with all the movie data
app.get('/movies', (req, res) => {
    res.json(movies);

    // Response for testing purposes, to be changed before deploying app
    res.send('Here is the list of all the movies that you requested.');
});

// HTTP GET request that returns data for a single movie to the user, the finished app will return a JSON object with the selected movie's data
app.get('/movies/:title', (req, res) => {
    //res.json(movies.find((title) => { return movies.title === req.params.title }));
    res.send('Here is the data for the movie that you requested.');
});

// HTTP GET request that returns data about a selected "Genre" to the user, the finished app will return a JSON object with the selected genre's data
app.get('/genre/:genreName', (req, res) => {
    //res.json(movies.find((genre) => { return movies.genre === req.params.genre }));

    // Response for testing purposes, to be changed before deploying app
    res.send('Here is the data for the genre that you requested.');
});

// HTTP GET request that returns data about a selected director to the user, the finished app will return a JSON object with the selected director's data
app.get('/director/:directorName', (req, res) => {

    //res.json(movies.find((director) => { return movies.director === req.params.director }));

    // Response for testing purposes, to be changed before deploying app
    res.send('Here is the data for the director that you requested.');
});

// HTTP POST request that creates a new user in the user registry,
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        const message = 'Missing "name" in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// HTTP PUT request that allows users to update their username
app.put('/users/:name', (req, res) => {
    let userName = users.find((userName) => { return userName.name === req.params.name });

    // Response for testing purposes, to be changed before deploying app
    res.send('You have succussfully updated your user name.');

    // if else statement to allow user to update their username, and return a message for failure or success

});

// HTTP PUT request that allows users to add a favorite movie to their list
app.put('/users/:favorites', (req, res) => {
    let userFavoriteMovies = users.find((userFavoriteMovies) => { return userFavoriteMovies.favorites === req.params.favorites });

    // Response for testing purposes, to be changed before deploying app
    res.send('You have added a movie to your favorites list.');

    // if else statement to allow user to add a movie to their favorites list, and return a message for failure or success

});

// HTTP REMOVE request that allows users to remove a favorite movie from their list
app.delete('/users/:favorites', (req, res) => {
    let userFavoriteMovies = users.find((userFavoriteMovies) => { return users.favorites === req.params.favorites });

    if (userFavoriteMovies) {
        users = users.filter((obj) => { return obj.favorites !== req.params.favorites });
        res.status(201).send('Favorite ' + req.params.favorites + ' was removed.');
    }
});


// HTTP REMOVE request that allows users to deregister their account
app.delete('users/:userName', (req, res) => {
    let searchName = users.find((userName) => { return searchName.userName === req.params.userName });

    if (searchName) {
        users = users.filter((obj) => { return obj.userName !== req.params.userName });
        res.status(201).send('User ' + req.params.userName + ' has been deleted from our records.');
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
