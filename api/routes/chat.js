const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    return res.send('Hello world from chat router');
});

const chatRouter = router;

module.exports = router;
