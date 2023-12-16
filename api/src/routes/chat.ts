import express from 'express';
import sendMessage from '../controllers/chat/sendMessage';

const router = express.Router();

// router.get('/', (req, res) => {
//     return res.send('Hello world from chat router');
// });

router.post('/', sendMessage);

const chatRouter = router;

export default chatRouter;
