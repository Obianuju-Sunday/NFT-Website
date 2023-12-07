const express = require('express');
const router = express.Router();

// Define your routes
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// More route definitions...

module.exports = router;
