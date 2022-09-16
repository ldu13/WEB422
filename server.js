/********************************************************************************* 
 * * WEB422 – Assignment 1 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * * No part of this assignment has been copied manually or electronically from any other source 
 * * (including web sites) or distributed to other students. 
 * 
 * Name: _____Lei Du______ Student ID: __047587134___ Date: ___Sept. 16, 2022___ 
 * Cyclic Link: ___https://tired-red-top-coat.cyclic.app_________________________ 
 * 
 ********************************************************************************/

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
  db.addNewMovie(req.body).then(()=>{
    res.status(201).json("Movie added");
  }).catch(()=>{
    res.status(500).json({message:"ERROR"});
  })
});

// Get all
app.get('/api/movies', (req, res) => {
  db.getAllMovies(req.query.page,req.query.perPage, req.query.title).then((data)=>{
    if(data.length === 0)
      res.status(204).json({message:"Data not found"});
    else
      res.status(201).json(data);
  })
  .catch((err)=>{
    res.status(500).json({message:err.message});
  });
});

// Get one
app.get('/api/movies/:_id', (req,res) => {
  db.getMovieById(req.params._id).then((data)=>{
    res.status(201).json(data);
  }).catch(()=>{
    res.status(500).json({message:"ERROR"});
  });
});

// Edit existing
app.put('/api/movies/:_id', (req, res) => {
    
    db.updateMovieById(req.body,req.params._id).then(()=>{
      res.status(201).json({message:"MOVIE UPDATED"});
    }).catch(()=>{
      res.status(500).json({message:ERROR});
    });
});

// Delete item
app.delete('/api/movies/:_id', (req, res) => {

    db.deleteMovieById(req.params._id).then(()=>{
      res.status(201).json({message: "Movie deleted"});
    })
    .catch(()=> {
    res.status(500).json({message: "ERROR"});
  });
});

// Resource not found (this should be at the end)
// app.use((req, res) => {
//   res.status(404).json({message: "404 - Resource not found"});
// });


// ********************************************
// "Initializing" the Module & start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
  });
  }).catch((err)=>{
    console.log(err);
  });