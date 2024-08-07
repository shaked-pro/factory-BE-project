const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const commonUsage = require('../commonUsage');
const { JsonWebTokenError } = require('jsonwebtoken');

const mongoURL = 'mongodb://localhost:27017';

const router = express.Router();

// Entry point: http://localhost:3000/shifts

// router.get('/', async (req, res) => {

// }