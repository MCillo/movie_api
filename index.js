const express = require('express'); // Imports the Express module and assigns it to the variable express so that it can be used 
const morgan = require('morgan'); // Imports morgan, to be used to log URL requests
const bodyParser = require('body-parser'); // Imports body-parser, to be used for error handling
const methodOverride = require('method-override'); // Imports method-override, to be used for error handling

const app = express(); // creates a varaiable that encapsulates Express's functionality to configure the web server

// top ten movies as per IMDB's top 250 movies 
let topTenMovies = [
    {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont'
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola'
    },
    {
        title: 'The Dark Night',
        director: 'Christopher Nolan'
    },
    {
        title: 'The Godfather Part II',
        director: 'Francis Ford Coppola'
    },
    {
        title: '12 Angry Men',
        director: 'Sidney Lumet'
    },
    {
        title: 'Shindler\'s List',
        director: 'Steven Spielberg'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quenton Tarantino'
    },
    {
        title: 'The Lord of teh Rings: The Fellowship of the Ring',
        director: 'Peter Jackson'
    },
    {
        title: 'The Good, the Bad and the Ugly',
        director: 'Sergio Leone'
    },
];

// calling on the middleware functions 
app.use(morgan('common'));

// Get requests
app.get('/', (req, res) => {
    res.send('Welcome to Movie Tracker!');
});

app.use(express.static('public'));

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

// error handling middleware called after all instances of app.use() except for app.listen()
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
})
