/* eslint-disable import/first */

import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import connectDb from './database/connect';
import { PORT } from './config/keys';

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`app listening to port ${PORT}`);
        });
    })
    .catch((err: any) => {
        console.log(err);
    });
