
require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const mongoData = process.env.DATABASE_URL;
mongoose.connect(mongoData);
const cors = require('cors')
const database = mongoose.connection;
const routes = require('./routes/index.js');
// const session = require('express-session');
const AppError = require('./utils/appError.js')
const globalErrorHandler = require('./controllers/errorController.js')
const port = '4000'


database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

app.use(cors())
app.options('*', cors())


app.use(express.json());

app.use(
    '/api', routes);

app.all('*', (req, res, next) => {

    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404))
})

app.use(globalErrorHandler)

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})