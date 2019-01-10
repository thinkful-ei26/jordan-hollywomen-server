const express = require('express');
const mongoose = require('mongoose');

const History = require('../models/history');


const historyRouter = express.Router();

/* ========== GET/READ ALL SEARCHES ========== */
historyRouter.get('/history', (req, res, next) => {
    // const { searchTerm } = req.query;

    History.find()
    .sort({ searchDate: 'desc' })
    .then(history => {
        res.json(history);
    })
    .catch(err => {
        next(err);
    })
});

/* ========== GET/READ A SINGLE ITEM ========== */
historyRouter.get('/history/:id', (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }

    return History.findById(id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    })
});

/* ========== POST/CREATE AN ITEM ========== */
historyRouter.post('/history', (req, res, next) => {
    const { searchTerm, searchDate } = req.body;

    if (!searchTerm) {
        const err = new Error('Missing `search term` in request body');
        err.status = 400;
        return next(err);
      }
 
    const newSearch = {
        searchTerm: searchTerm,
        searchDate: searchDate
    }

    History.create(newSearch)
    .then(results => {
        res.location(`http://${req.headers.host}/history/${results}`).status(201).json(results);    
    })
    .catch(err => {
        next(err);
      newSearch.save();
      })
    });

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
historyRouter.put('/history/:id', (req, res, next) => {
    const id = req.params.id;
    const { searchTerm, searchDate } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
  
    if (!searchTerm) {
      const err = new Error('Missing `search term` in request body');
      err.status = 400;
      return next(err);
    }
  
    const updatedSearch = {
      id: id,
      searchTerm: searchTerm,
      searchDate: searchDate
    }
  
    return History.findByIdAndUpdate(id, updatedSearch)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
      updatedNote.save(); 
    })
  
  });

module.exports = historyRouter;