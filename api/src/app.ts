import express from 'express';
import path from 'path';

import userRouter from './routes/user';

const app = express();

const publicPath: string = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));

app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.send('<h1> Hello world</h1>');
});

export default app;
