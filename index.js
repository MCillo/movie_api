/**
 * The following imports are required for the API functionality
*/
const express = require('express'); // Imports the Express module and assigns it to the variable express so that it can be used 
const morgan = require('morgan'); // Imports morgan, to be used to log URL requests
const bodyParser = require('body-parser'); // Imports body-parser, to be used for error handling
const methodOverride = require('method-override'); // Imports method-override, to be used for error handling
const uuid = require('uuid'); // Imports uuid module for creating specific id's for movies and users
const mongoose = require('mongoose');  // Imports mongoose allowing CRUD operations on the MongoDB
const Models = require('./models.js');  // Imports the DB model schemas from models.js to enforce attributes defined in models.js
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie; // creates a variable to use the Movie model
const Users = Models.User;  // creates a variable to use the User model

// Cloud Computing code start
const { S3Client, ListObjectsV2Command, PutObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3'); // imports S3 client and commands to interact with bucket
const fs = require('fs');
const express = require('express');
// CC Code End


// mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });  // allows mongoose to connect to MongoDB Atlas
//mongoose.connect("mongodb://AWSUser:AWSConnect@mc-cluster.rsva2v5.mongodb.net:27017/myFlixDB"); // should allow connection to MongoDB from AWS EC2
// mongoose.connect("mongodb://AWSUser:AWSConnect@172.31.27.50:27017/myFlixDB");
// For connecting with AWS instance
mongoose.connect('mongodb+srv://AWSUser:AWSConnect@mc-cluster.rsva2v5.mongodb.net/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Cloud Computing Code Start
// Instantiate's an S3 Client Object
const s3Client = new S3Client({ // Create a new S3Client for 
  region: 'us-east-1', // passing region when working with AWS or Localstack
  //endpoint: 'http://localhost:4566', // Passing endpoint and forcePathStyle when working with localstack
  endpoint: 'http://localhost:8080', // Passing endpoint and forcePathStyle when working with localstack

  forcePathStyle: true
});
// CC Code End

// Cloud Computing Code Start
const listObjectsParams = { // Instantiates an object from classes for individual commands
  Bucket: 'my-localstack-bucket' // parameter of bucket name
}

const listObjectsCmd = new ListObjectsV2Command(listObjectsParams) // Instantiates ListObjectsV2Command object to pass to S3 client 
// CC Code End

const app = express(); // creates a varaiable that encapsulates Express's functionality to configure the web server

const cors = require('cors'); // requires CORS (Cross-Origin Resource Sharing) for data security in app
//app.use(cors()); // allows requests from all origins
let allowedOrigins = [   // restricts access to only the included origin domains
  'http://localhost:8080', // localhost machine
  'http://testsite.com',
  'http://localhost:1234',
  'https://myflixapp-765.herokuapp.com', //client side app hosted on heroku
  'https://myflix765.netlify.app',
  'http://localhost:4200',
  'https://mcillo.github.io',
  'https://45.20.16.153', // My IP according to checkip
  'http://45.20.16.153', // My IP according to checkip

  'https://54.174.235.42', //Amazon EC2 Instance for MongoDB Public IP
  'http://54.174.235.42', //Amazon EC2 Instance for MongoDB

  'https://54.196.11.95',  //Amazon EC2 Instance for this API
  'http://54.196.11.95',  //Amazon EC2 Instance for this API

  'https://172.31.19.68/32', // trying something here
  'http://172.31.19.68/32', // trying something here

  'http://18.215.146.253/32', // trying something here

  'http://34.203.234.174', // New AWS EC2 instance id i-04400fada97d48317 MyFlix_API-Instance IP's Public IP
  'http://172.31.20.161',  // Private IP

  'http://54.83.113.51', // New AWS EC2 instance id i-06fa82c71d266dfc9 MyFlix-MongoDB-Instance IP's Public IP
  'http://172.31.27.92',  // Private IP 

  'https://my-flix-client-code.s3.amazonaws.com/src/index.html', // location in AWS S3 bucket
  'http://my-flix-client-code.s3.amazonaws.com/src/index.html'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // if a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

// calling on the middleware functions 
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// HTTP Requests

// calling on authentiacation functions for ability to authenticate users
let auth = require('./auth')(app);  // imports auth.js file to be used in the project, (app) argument ensures that Express is available in auth.js file as well
const passport = require('passport'); //  requires passport module
require('./passport');  // imports the passport.js file for use 

// HTTP GET request that returns welcome message
app.get('/', (req, res) => {  //  request has 2 parameters: URL = '/', and callback function = (req, res)
  res.send('Welcome to Movie Tracker!');
});

app.use(express.static('public'));

// HTTP GET request that returns all the movies from MongoDB
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {  //  request has 2 parameters: URL = '/movies' and callback function
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => { //  request has 3 parameters: URL = '/movies/:Title', passport.authenticate, and callback function
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
app.get('/Movies/Genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/Director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {

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
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .populate({ path: 'FavoriteMovies' })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send('Error: ' + req.params.Username + ' was not found');
      }
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
  // Validation logic 
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // checks to see if username already exists in DB
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists'); // returns error if username is already in DB
      } else {
        Users
          .create({  // Mongoose's create command creates a new user if username is not already in DB
            Username: req.body.Username,
            Password: hashedPassword,
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
  ], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  }
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
  ], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  }
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

// Cloud Computing Code Start
// For Listing the Items in the AWS S3 Bucket
app.get('/images', (req, res) => {
  listObjectsParams.Bucket = 'my-localstack-bucket'; // Update the bucket name
  s3Client.send(new ListObjectsV2Command(listObjectsParams))
    .then((listObjectsResponse) => {
      console.log("Bucket Contents:", listObjectsResponse.Contents);
      res.send(listObjectsResponse);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error listing images');
    });
});

app.get('/images/:key', (req, res) => {
  const getObjectParams = {
    Bucket: 'my-localstack-bucket',
    //Key: req.params.key // Use the key (filename) from the request parameters
  };

  s3Client.send(new GetObjectCommand(getObjectParams))
    .then((getObjectResponse) => {
      res.send(getObjectResponse);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving image');
    });
});

app.post('/upload', (req, res) => {
  const uploadParams = {
    Bucket: 'my-localstack-bucket',
    Key: 'test-image.jpg',
    Body: fs.createReadStream('/Users/michaelcillo/test-image.jpg'),
    ContentType: 'image/jpg'
  };

  s3Client.send(new PutObjectCommand(uploadParams))
    .then((uploadResponse) => {
      res.send(uploadResponse);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error uploading image');
    });
});


// CC Code End

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

// Listens for requests
const port = process.env.PORT || 8080;
// const port = process.env.PORT || 1234;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});