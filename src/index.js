
require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const mongoData = process.env.DATABASE_URL;
mongoose.connect(mongoData);
const cors = require('cors')
const database = mongoose.connection;
const routes = require('./routes/index.js');


database.on('error' ,(error) => {
    console.log(error);
}) 

database.once('connected', () => {
    console.log('Database Connected'); 
})

const app = express();

app.use(cors())
app.options('*',cors())

app.use(express.json());
 
app.use(
    '/api', routes);

app.listen(3000, () =>{
    console.log(`Server started at ${3000}`)
})