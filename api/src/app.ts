import express from 'express';
import path from 'path';

import userRouter from './routes/user';

import ErrorControllerDev from './controllers/error/DevErrorController';
import ErrorControllerProd from './controllers/error/ProdErrorController';

const app = express();

const publicPath: string = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));

if (process.env.NODE_ENV === 'development') {
    app.use(new ErrorControllerDev().controller);
} else {
    app.use(new ErrorControllerProd().controller);
}

app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.send('<h1> Hello world</h1>');
});

export default app;
