// Setup
const express = require('express');
const cors = require('cors');
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
require('dotenv').config();
const app = express();

const HTTP_PORT = process.env.PORT || 8080;


// Add support for incoming JSON entities
app.use(cors());
app.use(express.json());


// ******************* ROUTES *******************
// Deliver the app's home page to browser clients
app.get('/', (req, res) => {
  res.status(201).json({ message: 'API Listening' });
});

// Add new
app.post('/api/movies', (req, res) => {
  db.addNewMovie(req.body).then(() => {
    res.status(201).json({message: 'Movie added'});
  }).catch((err) => {
    res.status(500).json({error: err});
  })
});

// Get all
app.get('/api/movies', (req, res) => {
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data) => {
    if(data.length === 0)
      res.status(204).json({message: 'Data not found'});
    else
      res.status(201).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
});

// Get one
app.get('/api/movies/:_id', (req,res) => {
  db.getMovieById(req.params._id).then((data) => {
    res.status(201).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
});

// Edit existing
app.put('/api/movies/:_id', (req, res) => {    
  db.updateMovieById(req.body, req.params._id).then(() => {
    res.status(201).json({message: 'Movie updated'});
  }).catch((err) => {
    res.status(500).json({error: err});
  });
});

// Delete item
app.delete('/api/movies/:_id', (req, res) => {
  db.deleteMovieById(req.params._id).then(() => {
    res.status(201).json({message: 'Movie deleted'});
  }).catch((err) => {
    res.status(500).json({error: err});
  });
});


// ********************************************
// "Initializing" the Module & start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
  });
  }).catch((err)=>{
    console.log(err);
  });
