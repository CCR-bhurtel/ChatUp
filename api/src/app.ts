/* eslint-disable import/first */
import express from 'express';
import path from 'path';


import userRouter from './routes/user';
import authRouter from './routes/auth';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';

import ErrorControllerDev from './controllers/error/DevErrorController';
import ErrorControllerProd from './controllers/error/ProdErrorController';

const app = express();

const publicPath: string = path.resolve(__dirname, '../public');

app.use(express.json());
app.use(express.static(publicPath));

app.use(
    cookieSession({
        maxAge: 5 * 24 * 60 * 60,
        keys: [process.env.COOKIE_KEY as string],
    })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRouter);

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('<h1> Hello world</h1>');
});

if (process.env.NODE_ENV === 'development') {
    app.use(new ErrorControllerDev().controller);
} else {
    app.use(new ErrorControllerProd().controller);
}
export default app;
