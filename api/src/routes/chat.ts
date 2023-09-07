import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    return res.send('Hello world from chat router');
});

const chatRouter = router;

export default chatRouter;
